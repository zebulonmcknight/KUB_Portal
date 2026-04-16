// functions required to make Utility payments

import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { supabase } from '../../database/supabase';
import {
    attachPaymentMethod,
    confirmPaymentIntent,
    createCustomer, createCustomerSubscription,
    createSetupIntent,
    disableAutoPay,
    enableAutoPay,
    getCustomerInvoice,
    getInvoiceHistory,
    getPaymentMethods,
    removePaymentMethod,
    reportElectricUsage, reportWaterOrWasteUsage,
    retrieveSetupIntent,
    setDefaultPaymentMethod
} from '../../services/stripeService';
dotenv.config();

// for demo purposes of creating a customer and setting up a subscription
export const newCustomerSubscription = async (req: Request, res: Response) => {
    // try to create the customer and corresponding subscription, catch all errors and return server side error otherwise
    try {
        // get the userId from middleware authorization
        const userId = (req as any).userId;

        const { priceIds } = req.body;

        // Validate that priceIds was passed and has at least one service
        if( !priceIds || priceIds.length === 0 ){
            return res.status(400).json({ error: 'priceIds array is required' });
        }

        // extract user email from supabase
        const { data, error: queryError } = await supabase
            .from('dev_users')
            .select('email')
            .eq('id', userId)
            .single()
        
        if( queryError ){
            return res.status(500).json({ error: queryError.message })
        }
        // if the database query resulted in no response
        if( !data ){
            return res.status(404).json({ error: 'User Not Found'})
        }

        // set the email from database response
        const email = data.email
        // if email is not retrieved from frontend request
        if( !email ){
            return res.status(400).json({ error: 'Email is required' });
        }
        // create the customer
        const customer = await createCustomer(email);

        // extract the customer id
        const stripeId = customer.id;
        
        // if the stripeId is not retrieved from the frontend request
        if( !stripeId ){
            return res.status(400).json({ error: 'stripeId and price IDs are required' });
        }
        
        // create the subscription
        const subscription = await createCustomerSubscription( stripeId, priceIds );
        
        // // fix ts type errors and obtain the client_secret for payment confirmation on frontend
        // let clientSecret: string | undefined;
        // const latestInvoice = subscription.latest_invoice;
        // if( latestInvoice && typeof latestInvoice !== 'string' ){
            //     const confirmationSecret = latestInvoice.confirmation_secret;
            
            //     if( confirmationSecret ){
                //         clientSecret = confirmationSecret.client_secret;
                //     }
                // }
                
                // // ensure clientSecret exists
                // if( !clientSecret ){
                    //     return res.status(500).json({ error: 'Failed to retrieve client secret from subscription'});
                    // }
        
        // ensure subscription created successfully and retrieve subscription ID
        const stripeSubscriptionId = subscription.id;
        
        // get the water and waste water price ids, set to null if they dont exist
        const wasteSubscriptionId = subscription.items.data
            .find(item => item.price.id === process.env.STRIPE_WASTE_WATER_ID)?.id ?? null; // searches the array to find a match for the id, if its undefined set it to null

        const waterSubscriptionId = subscription.items.data
            .find(item => item.price.id === process.env.STRIPE_WATER_ID)?.id ?? null;

        if( !stripeSubscriptionId ){
            return res.status(500).json({ error: 'Subscription Creation Failed' });
        }
        
        const { error: postError } = await supabase
            .from('billing_profiles')
            .upsert({
                user_id: userId,
                stripe_customer_id: stripeId,
                stripe_subscription_id: stripeSubscriptionId,
                waste_subscription_id: wasteSubscriptionId,
                water_subscription_id: waterSubscriptionId,
                autopay_enabled: false
            }, { onConflict: 'user_id' });

        if( postError ){
            return res.status(500).json({ error: 'Database Post Failure' });
        }
        res.json({ success: true})
    }

    // if any uncaught error arise
    catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create customer/subscription' });
    }
}

// Will pull the customers most recent bill and return the information as a json object to frontend
export const getCurrentBill = async (req: Request, res: Response) => {
    try{
        // get the userId from middleware
        const userId = (req as any).userId
        // extract user information from database
        const { data, error: queryError } = await supabase
            .from('billing_profiles')
            .select('stripe_customer_id, autopay_enabled, paperless_enabled')
            .eq('user_id', userId)
            .single()

        if( queryError ){
            return res.status(500).json({ error: queryError.message })
        }
        // if the database query resulted in no response
        if( !data ){
            return res.status(404).json({ error: 'User Not Found'})
        }

        // get the information from the database
        const stripeId = data.stripe_customer_id;
        const autopayEnabled = data.autopay_enabled;
        const paperlessEnabled = data.paperless_enabled
        
        // use stripeId to fetch any recent invoices
        const { invoice, status } = await getCustomerInvoice(stripeId);

        // New user so no prior invoice exists, return empty state so frontend doesnt crash
        if( status === "none" ){
            return res.status(200).json({
                totalAmountDue: 0,
                dueDate: null,
                isAutoPay: autopayEnabled,
                isPaperless: paperlessEnabled,
                status: 'none',
                lineItems: [],
                invoicePdf: null
            });
        }

        // Stripe stores in cents so have to convert to dollars
        const totalAmountDue = invoice!.amount_remaining / 100; // '!' mark here is to tell the compiler that we know this value is not null as we accounted for that in the if statement above

        // Stripe stores timestamps in seconds, JS date function needs ms so we convert.
        // if due date exists convert it to ISOString
        // if we are on autopay it wont exist in which case we check whether finalized date exists and then add our 18 days that we defined to it to get date.
        const dueDate = invoice!.due_date
            ? new Date(invoice!.due_date * 1000).toISOString()
            : invoice!.status_transitions?.finalized_at
            ? new Date((invoice!.status_transitions.finalized_at + 18 * 24 * 60 * 60) * 1000).toISOString()
            : null;

        const lineItems = invoice!.lines.data.map((line) => ({
            service: line.description ?? 'Service', // Add fall back just in case. If left side is null, service will just be 'Service'. Otherwise: electric, water, waste
            units: line.quantity ?? 0,
            amount: line.amount / 100, // have to convert to dollars
        }));

        // Create a json object of the information we extracted
        return res.status(200).json({
            totalAmountDue,
            dueDate,
            isAutoPay: autopayEnabled,
            isPaperless: paperlessEnabled,
            status,
            lineItems,
            invoicePdf: invoice?.invoice_pdf ?? null
        });
    }
    // If any uncaught error arise
    catch( error: any ){
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve customer bill' });
    }
}

// Returns full invoice and payment history for the current user
// Each paid invoice produces both an invoice row and a payment row in the combined list
export const getInvoiceHistoryController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const { data, error: queryError } = await supabase
            .from('billing_profiles')
            .select('stripe_customer_id')
            .eq('user_id', userId)
            .single();

        if (queryError){
            return res.status(500).json({ error: queryError.message });
        }
        if (!data){
            return res.status(404).json({ error: 'User Not Found' });
        }
        const invoices = await getInvoiceHistory(data.stripe_customer_id);

        // Build the combined list, each invoice becomes an invoice row,
        // and each paid invoice also produces a corresponding payment row
        const items: any[] = [];

        for (const invoice of invoices.data) {
            // Push payment row first if paid, then the invoice it belongs to
            if (invoice.status === 'paid') {
                const paymentType = invoice.collection_method === 'charge_automatically'
                    ? 'Card Payment'
                    : 'Electronic Payment';

                items.push({
                    type: 'payment',
                    id: `pay_${invoice.id}`,
                    paymentDate: invoice.status_transitions.paid_at
                        ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
                        : new Date(invoice.created * 1000).toISOString(),
                    paymentAmount: invoice.amount_paid / 100,
                    paymentType,
                    paymentStatus: 'Completed',
                    invoiceId: invoice.id,
                });
            }

            // Invoice row always pushed after its payment
            items.push({
                type: 'invoice',
                id: invoice.id,
                invoiceDate: new Date(invoice.created * 1000).toISOString(),
                amountDue: invoice.amount_due / 100,
                dueDate: invoice.due_date
                    ? new Date(invoice.due_date * 1000).toISOString()
                    : null,
                invoicePdf: invoice.invoice_pdf ?? null,
            });
        }

        // return the combined list of invoices and paid invoices
        return res.status(200).json({ items });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve invoice history' });
    }
}

// Returns all saved payment methods for the current user
export const getPaymentMethodsController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const { data, error: queryError } = await supabase
            .from('billing_profiles')
            .select('stripe_customer_id')
            .eq('user_id', userId)
            .single();

        if (queryError){
            return res.status(500).json({ error: queryError.message });
        }
        if (!data){
            return res.status(404).json({ error: 'User Not Found' });
        }

         const { paymentMethods, defaultPaymentMethodId } = await getPaymentMethods(data.stripe_customer_id);

        // Map to only what the frontend needs
        // use left side of ?? if it exists otherwise right hand side
        const methods = paymentMethods.map(payMethod => ({
            id: payMethod.id,
            brand: payMethod.card?.brand ?? 'unknown',
            last4: payMethod.card?.last4 ?? '****',
            expMonth: payMethod.card?.exp_month ?? 0,
            expYear: payMethod.card?.exp_year ?? 0,
            isDefault: payMethod.id === defaultPaymentMethodId,
        }));

        return res.status(200).json({ methods });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve payment methods' });
    }
}

// Detaches a payment method from the customer's Stripe account
export const removePaymentMethodController = async (req: Request, res: Response) => {
    try {
        const { paymentMethodId } = req.body;

        if (!paymentMethodId) {
            return res.status(400).json({ error: 'paymentMethodId is required' });
        }

        await removePaymentMethod(paymentMethodId);

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to remove payment method' });
    }
}

// Adds a new payment method via a completed SetupIntent
// Frontend presents SetupSheet, completes it, then sends the setupIntentId here
export const addPaymentMethod = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { setupIntentId } = req.body;

        if (!setupIntentId) {
            return res.status(400).json({ error: 'setupIntentId is required' });
        }

        const { data, error: queryError } = await supabase
            .from('billing_profiles')
            .select('stripe_customer_id')
            .eq('user_id', userId)
            .single();

        if (queryError) return res.status(500).json({ error: queryError.message });
        if (!data) return res.status(404).json({ error: 'User Not Found' });

        // Retrieve the completed SetupIntent to get the payment method ID
        const setupIntent = await retrieveSetupIntent(setupIntentId);
        const paymentMethodId = setupIntent.payment_method as string;

        if (!paymentMethodId) {
            return res.status(400).json({ error: 'No payment method found on setup intent' });
        }

        // Attach the payment method to the Stripe customer
        await attachPaymentMethod(data.stripe_customer_id, paymentMethodId);

        // After attaching the payment method, check if it's their first
        // If so, automatically set it as default so the customer always has one
        const existingMethods = await getPaymentMethods(data.stripe_customer_id);
        if (existingMethods.paymentMethods.length === 1) {
            await setDefaultPaymentMethod(data.stripe_customer_id, paymentMethodId);
        }

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to add payment method' });
    }
}

// Sets a payment method as the customer's default for invoices
export const setDefaultPaymentMethodController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { paymentMethodId } = req.body;

        if (!paymentMethodId) {
            return res.status(400).json({ error: 'paymentMethodId is required' });
        }

        const { data, error: queryError } = await supabase
            .from('billing_profiles')
            .select('stripe_customer_id')
            .eq('user_id', userId)
            .single();

        if (queryError) return res.status(500).json({ error: queryError.message });
        if (!data) return res.status(404).json({ error: 'User Not Found' });

        await setDefaultPaymentMethod(data.stripe_customer_id, paymentMethodId);

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to set default payment method' });
    }
}

export const setupAutoPay = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        // get the customer stripe id
        const { data, error: queryError } = await supabase
            .from('billing_profiles')
            .select('stripe_customer_id')
            .eq('user_id', userId)
            .single();

        if (queryError){
          return res.status(500).json({ error: queryError.message });  
        } 
        if (!data){
           return res.status(404).json({ error: 'User Not Found' }); 
        } 

        const setupIntent = await createSetupIntent(data.stripe_customer_id);

        return res.status(200).json({ clientSecret: setupIntent.client_secret });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create setup intent' });
    }
}

export const enrollAutoPay = async (req: Request, res: Response) => {
    try{
        // get the userId from middleware
        const userId = (req as any).userId;
        
        const { setupIntentId, paymentMethodId: existingPaymentMethodId } = req.body;

        if (!setupIntentId && !existingPaymentMethodId) {
            return res.status(400).json({ error: 'setupIntentId or paymentMethodId is required' });
        }

        // If using existing payment method skip the SetupIntent retrieval
        const paymentMethodId = existingPaymentMethodId ?? (await retrieveSetupIntent(setupIntentId)).payment_method as string;

        if (!paymentMethodId) {
            return res.status(400).json({ error: 'No payment method found' });
        }

        // get the stripe customer and subscription IDs from the database
        const { data, error: queryError } = await supabase
            .from('billing_profiles')
            .select('stripe_customer_id, stripe_subscription_id')
            .eq('user_id', userId)
            .single()

        if( queryError ){
            return res.status(500).json({ error: queryError.message })
        }
        if( !data ){
            return res.status(404).json({ error: 'User Not Found'})
        }

        const stripeId = data.stripe_customer_id;
        const subscriptionId = data.stripe_subscription_id;

        // Only attach if using a new card via SetupIntent, existing cards are already attached
        if (!existingPaymentMethodId) {
            await attachPaymentMethod(stripeId, paymentMethodId);
    
            // Auto-set as default if this is their first payment method
            const existingMethods = await getPaymentMethods(stripeId);
            if (existingMethods.paymentMethods.length === 1) {
                await setDefaultPaymentMethod(stripeId, paymentMethodId);
            }
        }
        await enableAutoPay(subscriptionId, paymentMethodId);

        // Update the database to reflect the new autopay status
        const { error: postError } = await supabase
            .from('billing_profiles')
            .update({ autopay_enabled: true })
            .eq('user_id', userId)
        
        if( postError ){
            return res.status(500).json({ error: 'Database Post Failure' });
        }
        res.json({ success: true})
    }
    // If any uncaught error arise
    catch( error: any ){
        console.error(error);
        return res.status(500).json({ error: 'Failed to enroll in AutoPay' });
    }
}

export const cancelAutoPay = async (req: Request, res: Response) => {
    try{
        // get the userId from middleware
        const userId = (req as any).userId;

        // only need the subscription ID to disable autopay, no payment method needed
        const { data, error: queryError } = await supabase
            .from('billing_profiles')
            .select('stripe_subscription_id')
            .eq('user_id', userId)
            .single()

        if( queryError ){
            return res.status(500).json({ error: queryError.message })
        }
        if( !data ){
            return res.status(404).json({ error: 'User Not Found'})
        }

        const subscriptionId = data.stripe_subscription_id;

        // Switch the subscription back to manual invoice collection
        await disableAutoPay(subscriptionId);

        // Update the database to reflect the new autopay status
        const { error: postError } = await supabase
            .from('billing_profiles')
            .update({ autopay_enabled: false })
            .eq('user_id', userId)
        
        if( postError ){
            return res.status(500).json({ error: 'Database Post Failure' });
        }
        res.json({ success: true })
    }
    // If any uncaught error arise
    catch( error: any ){
        console.error(error);
        return res.status(500).json({ error: 'Failed to cancel AutoPay' });
    }
}

export const submitUsage = async (req: Request, res: Response) => {
    try{
        // get the userId from middleware
        const userId = (req as any).userId;

        // extract usage units from request body. Each is optional since we assume not every customer has all three services
        const { electricUnits, waterUnits, wastewaterUnits } = req.body;

        // get the subscription IDs for water and wastewater.
        // these will be null if the customer doesn't have those services
        const { data, error: queryError } = await supabase
            .from('billing_profiles')
            .select('stripe_customer_id, water_subscription_id, waste_subscription_id')
            .eq('user_id', userId)
            .single()

        if( queryError ){
            return res.status(500).json({ error: queryError.message })
        }
        if( !data ){
            return res.status(404).json({ error: "User not found" })
        }

        const stripeId = data.stripe_customer_id;
        const waterSubId = data.water_subscription_id;
        const wasteSubId = data.waste_subscription_id;

        // Build the promises array conditionally so we only report usage for services the customer actually has.
        const promises = [];

        // If no electric units provided we can assume that they dont have it as a service.
        if( electricUnits ){
            promises.push(reportElectricUsage(stripeId, electricUnits));
        }
        // Check both that the subscription ID exists and that units were provided
        if( waterSubId && waterUnits ){
            promises.push(reportWaterOrWasteUsage(waterSubId, waterUnits));
        }
        if( wasteSubId && wastewaterUnits ){
            promises.push(reportWaterOrWasteUsage(wasteSubId, wastewaterUnits));
        }

        await Promise.all(promises);

        return res.status(200).json({ success: true })
    }
    // If any uncaught error arise
    catch( error: any ){
        console.error(error);
        return res.status(500).json({ error: 'Failed to submit usage' });
    }
}

export const payInvoice = async ( req: Request, res: Response ) => {
    try{
        const userId = (req as any).userId;
        // optional — if provided, confirm the PaymentIntent server-side with the saved card
        const { paymentMethodId } = req.body;

        // get the stripe id for the customer, used for paymentIntent
        const { data, error: queryError } = await supabase
            .from("billing_profiles")
            .select("stripe_customer_id")
            .eq("user_id", userId)
            .single()

        if( queryError ){
            return res.status(500).json({ error: queryError.message })
        }
        if( !data ){
            return res.status(404).json({ error: "User not found" })
        }

        // get their latest invoice
        const { invoice, status } = await getCustomerInvoice(data.stripe_customer_id);

        // if they dont have one open no need to pay
        if( status !== "open" || !invoice ){
            return res.status(400).json({ error: "No open invoice" });
        }

        const clientSecret = invoice.confirmation_secret?.client_secret;

        if( !clientSecret ){
            return res.status(500).json({ error: 'No client secret found on invoice' });
        }

        // If a saved payment method was provided, confirm the PaymentIntent directly on the backend, dont need to show sheet
        if( paymentMethodId ){
            // PaymentIntent ID is embedded in the clientSecret before '_secret_'
            const paymentIntentId = clientSecret.split('_secret_')[0];
            const result = await confirmPaymentIntent(paymentIntentId, paymentMethodId);

            if( result.status !== 'succeeded' ){
                return res.status(400).json({ error: 'Payment failed' });
            }

            return res.status(200).json({ success: true });
        }

        return res.status(200).json({ clientSecret });

    } catch( error: any ){
        console.error(error);
        return res.status(500).json({ error: 'Failed to pay invoice' });
    }
}

// Toggles paperless billing on or off for the current user
export const togglePaperless = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        // Get current paperless status
        const { data, error: queryError } = await supabase
            .from('billing_profiles')
            .select('paperless_enabled')
            .eq('user_id', userId)
            .single();

        if (queryError){
            return res.status(500).json({ error: queryError.message });
        }
        if (!data){
            return res.status(404).json({ error: 'User Not Found' });
        }

        // Flip the current value
        const { error: updateError } = await supabase
            .from('billing_profiles')
            .update({ paperless_enabled: !data.paperless_enabled })
            .eq('user_id', userId);

        if (updateError){
            return res.status(500).json({ error: updateError.message });
        }
        
        return res.status(200).json({ success: true, isPaperless: !data.paperless_enabled });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to toggle paperless billing' });
    }
}