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
    electricId: string,
    wasteWaterId: string,
    waterId: string
) => {
    return await stripe.subscriptions.create({
       customer: stripeId,
       // identification of the plan(s) desired in Stripe
       items: [{price: electricId}, {price: wasteWaterId}, {price: waterId}],
       // default collection method has auto pay turned off
       collection_method: 'send_invoice',
       // 30 days to pay if auto pay is turned off
       days_until_due: 30,
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
        quantity: numUnits
    });   
}

// disable/enable auto-pay


// // marks the subscription incomplete if payment is required so frontend can handle payment
// payment_behavior: 'default_incomplete',
// // return the client_secret to frontend Stripe SDK in order to confirm payment
// expand: ['latest_invoice.confirmation_secret']