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
export const createCustomerSubscription = async (customerId: string, priceId: string) => {
    return await stripe.subscriptions.create({
       customer: customerId,
       // identification of the plan(s) desired in Stripe
       items: [{ price: priceId }],
       // marks the subscription incomplete if payment is required so frontend can handle payment
       payment_behavior: 'default_incomplete',
       // return the client_secret to frontend Stripe SDK in order to confirm payment
       expand: ['latest_invoice.confirmation_secret']
    });
};