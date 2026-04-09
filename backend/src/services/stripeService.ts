// initialize Stripe API
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

// pull Stripe key from env
const stripeKey = process.env.STRIPE_SECRET_KEY!;

// create an instance of Stripe API
const stripe = new Stripe(stripeKey);

// method to create a customer
export const createCustomer = async (email: string) => {
    return await stripe.customers.create({ email });
}

// method to start a subscription
export const createCustomerSubscription = async (
    stripeId: string,
    priceIds: string[]
) => {

    const now = new Date(); // Captures the date and time as of now
    const anchor = new Date(now); // Make a copy of that time to edit
    anchor.setDate(15); // Set the day to the 15th, only the day changes. 15th will be our billing date.

    // Since we changed the date of anchor, we use now to compare.
    // Only when we are already past the 15th do we anchor to the next month
    if( now.getDate() >= 15 ){
        anchor.setMonth(anchor.getMonth() + 1);
    }

    // Stripe wants the anchor in seconds so we convert it here
    const anchorInSeconds = Math.floor(anchor.getTime() / 1000);

    return await stripe.subscriptions.create({
       customer: stripeId,
       // identification of the plan(s) desired in Stripe
       items: priceIds.map(price => ({ price })),
       // default collection method has auto pay turned off
       collection_method: 'send_invoice',
       // they have 18 days after the invoice is created to pay the bill
       days_until_due: 18,
       // Tell stripe to anchor the billing cycle to next upcoming 15th. Makes it so everyone gets billed same day.
       billing_cycle_anchor: anchorInSeconds,
       // Tells stripe not to charge for the small window of time between signup and next anchor date
       proration_behavior: 'none',
    });
};

// method to report electric usage
export const reportElectricUsage = async (
    stripeId: string,
    kwh: string,
) => {
    return await stripe.billing.meterEvents.create({
        event_name: 'electric_meter',
        payload: {
            stripe_customer_id: stripeId,
            value: kwh
        }
    });
}

// method to update the number of units
export const reportWaterOrWasteUsage = async (
    itemSubscriptionId: string,
    numUnits: number
) => {
    return await stripe.subscriptionItems.update(itemSubscriptionId, {
        quantity: numUnits,
        proration_behavior: 'none',
    });   
}

// method to get the current customer invoice to display
export const getCustomerInvoice = async ( stripeId: string ) => {

    // Get the most recent open invoice
    const openInvoices = await stripe.invoices.list({customer: stripeId, status: 'open', limit: 1, expand: ["data.confirmation_secret"]});
    if( openInvoices.data.length > 0 ){
        return { invoice: openInvoices.data[0], status: 'open' }; // if it exists return the invoice
    }
    
    // Will run this if no open invoice, get the most recent paid
    const paidInvoices = await stripe.invoices.list({customer: stripeId, status: 'paid', limit: 1});
    if( paidInvoices.data.length > 0 ){
        return { invoice: paidInvoices.data[0], status: 'paid' };
    }

    // if no billing data just return empty
    return { invoice: null, status: 'none' };
}

// method to save a payment method and link it to customer. Used when they enroll in autopay
export const attachPaymentMethod = async ( stripeId: string, paymentMethodId: string ) => {
    return await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeId });
}

// method to change their payment method to autopay
export const enableAutoPay = async ( subscriptionId: string, paymentMethodId: string ) => {
    return await stripe.subscriptions.update(subscriptionId, {
       collection_method: 'charge_automatically',
       default_payment_method: paymentMethodId
    });
}

// method to disable autopay. Convert back to send_invoice and give 18 days to pay after next invoice created
export const disableAutoPay = async ( subscriptionId: string ) => {
    return await stripe.subscriptions.update(subscriptionId, {
       collection_method: 'send_invoice',
       days_until_due: 18
    });
}

// method for setupsheet, so user can enter card info when enrolling in autopay. doesnt charge them just saves card
export const createSetupIntent = async (stripeId: string) => {
    return await stripe.setupIntents.create({
        customer: stripeId,
        payment_method_types: ['card'],
    });
}

// setupIntent only returns Id so need this to retrieve the actual data
export const retrieveSetupIntent = async (setupIntentId: string) => {
    return await stripe.setupIntents.retrieve(setupIntentId);
}

// // marks the subscription incomplete if payment is required so frontend can handle payment
// payment_behavior: 'default_incomplete',
// // return the client_secret to frontend Stripe SDK in order to confirm payment
// expand: ['latest_invoice.confirmation_secret']