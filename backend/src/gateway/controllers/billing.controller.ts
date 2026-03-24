// functions required to make Utility payments

import { Request, Response } from 'express';
import { createCustomer } from '../../services/stripeService';
import { createCustomerSubscription } from '../../services/stripeService';
import dotenv from 'dotenv';
import { supabase } from '../../database/supabase';
dotenv.config();

// for demo purposes of creating a customer and setting up a subscription
export const newCustomerSubscription = async (req: Request, res: Response) => {
    // try to create the customer and corresponding subscription, catch all errors and return server side error otherwise
    try {
        // get the userId from middleware authorization
        const userId = (req as any).userId
        console.log(userId)
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
            return res.status(400).json({ error: 'User Not Found'})
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

        // hard code price IDs
        const electricId = process.env.STRIPE_ELECTRIC_ID!;
        const wasteWaterId = process.env.STRIPE_WASTE_WATER_ID!;
        const waterId = process.env.STRIPE_WATER_ID!;

        // if either the stripeId or the price IDs are not retrieved from the frontend request
        if( !stripeId || !electricId || !wasteWaterId || !waterId ){
            return res.status(400).json({ error: 'stripeId and price IDs are required' });
        }

        // create the subscription
        const subscription = await createCustomerSubscription( stripeId, electricId, wasteWaterId, waterId );

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
        const wasteSubscriptionId = subscription.items.data[1].id
        const waterSubscriptionId = subscription.items.data[2].id
        if( !stripeSubscriptionId || !wasteSubscriptionId || !waterSubscriptionId ){
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