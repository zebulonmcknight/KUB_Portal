// functions required to make Utility payments

import { Request, Response } from 'express';
import { createCustomer } from '../../services/stripeService';
import { createCustomerSubscription } from '../../services/stripeService';
import dotenv from 'dotenv';
dotenv.config();

// for demo purposes of creating a customer and setting up a subscription
export const newCustomerSubscription = async (req: Request, res: Response) => {
    // try to create the customer and corresponding subscription, catch all errors and return server side error otherwise
    try {
        const { email } = req.body;
        // if email is not retrieved from frontend request
        if( !email ){
            return res.status(400).json({ error: 'Email is required' });
        }
        // create the customer
        const customer = await createCustomer(email);

        // extract the customer id
        const customerId = customer.id;

        // hard code priceId
        const priceId = process.env.STRIPE_PRICE_ID!;

                // if either the customerId or the priceId are not retrieved from the frontend request
        if( !customerId || !priceId ){
            return res.status(400).json({ error: 'customerId and priceId are required' });
        }

        // create the subscription
        const subscription = await createCustomerSubscription( customerId, priceId );

        // fix ts type errors and obtain the client_secret for payment confirmation on frontend
        let clientSecret: string | undefined;
        const latestInvoice = subscription.latest_invoice;
        if( latestInvoice && typeof latestInvoice !== 'string' ){
            const confirmationSecret = latestInvoice.confirmation_secret;

            if( confirmationSecret ){
                clientSecret = confirmationSecret.client_secret;
            }
        }

        // ensure clientSecret exists
        if( !clientSecret ){
            return res.status(500).json({ error: 'Failed to retrieve client secret from subscription'});
        }

        res.json({ clientSecret: clientSecret })
    }
    // if any uncaught error arise
    catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create customer/subscription' });
    }
}

// create a customer within Stripe using Stripe API call in stripeService.ts
export const createBillingCustomer = async (req : Request, res: Response) => {
    // try to make the post, catch all errors and return server side error otherwise
    try {
        const { email } = req.body;
        // if email is not retrieved from frontend request
        if( !email ){
            return res.status(400).json({ error: 'Email is required' });
        }
        // create the customer
        const customer = await createCustomer(email);

        // return the customer.id (WILL NEED TO PLACE CUSTOMER ID IN DATABASE)
        res.json({ message: 'Customer Created', customerId: customer.id });
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create customer' });
    }
};

// this will need to be adjusted to grab necessary information from the DB rather than hardcoded in the request
export const createBillingCustomerSubscription = async (req: Request, res: Response) => {
    // try to make the post, catch all errors and return server side error otherwise
    try {
        const { customerId, priceId } = req.body;

        // if either the customerId or the priceId are not retrieved from the frontend request
        if( !customerId || !priceId ){
            return res.status(400).json({ error: 'customerId and priceId are required' });
        }

        // create the subscription
        const subscription = await createCustomerSubscription( customerId, priceId );

        // fix ts type errors and obtain the client_secret for payment confirmation on frontend
        let clientSecret: string | undefined;
        const latestInvoice = subscription.latest_invoice;
        if( latestInvoice && typeof latestInvoice !== 'string' ){
            const confirmationSecret = latestInvoice.confirmation_secret;

            if( confirmationSecret ){
                clientSecret = confirmationSecret.client_secret;
            }
        }
        
        // return the subscription id along with the client secret
        res.json({ message: 'Subscription created', subscriptionId: subscription.id, clientSecret});
    }
    // catch any error and return a server side error
    catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
};