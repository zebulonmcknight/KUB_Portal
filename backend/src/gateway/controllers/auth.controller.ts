import { Request, Response } from 'express';
import { auth0Service } from '../../services/auth/auth0.service';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body; 
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required'}); 
        }

        const token = await auth0Service.login(email, password); 
        return res.status(200).json({
            access_token: token.access_token, 
            expires_in: token.expires_in
        }); 

    } catch (error: any) {
        console.error('Login error details:', error);
        console.error('message: ', error.message) 
        // return the error description or if null, 'Login Failed' 
        return res.status(401).json({error: error.response?.data?.error_description || 'Login Failed'})
    }
}

export const signup = async (req: Request, res: Response) => {
    try {
        const {email, password, account_number, first_name, last_name, phone} = req.body; 
        if (!email || !password || !account_number) {
            return res.status(400).json({error: 'Email, password, and account_number are required'}); 
        }

        const signup = await auth0Service.signup(email, password, account_number, first_name, last_name, phone);

        const stripeSubscriptionResponse = await fetch(
            "http://localhost:3000/api/billing/newCustomerSubscription",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${signup.access_token}`
                }
            }
        )

        return res.status(201).json({
            message: 'Signup Successful',
            access_token: signup.access_token, 
            expires_in: signup.expires_in
        })

    } catch (error: any) {
        console.error('Signup error details:', error);
        console.error('message', error.message);  

        if (error.status === 409) {
            return res.status(409).json({ error: error.message}); 
        }
        // return the error description or if null, 'Signup Failed' 
        console.log ('Auth0 error data:', error.response?.data); 
        return res.status(401).json({error: error.response?.data?.message || error.response?.data?.description || 'Signup Failed'}); 
    }
}

export const verifyKubAccount = async (req: Request, res: Response) =>  {
    try {
        const { account_number, ssn_last4, zip } = req.body; 
        if (!account_number || !ssn_last4 || !zip ){
            return res.status(400).json({error: 'account_number, ssn_last4, and zip are required.'}); 
        }

        await auth0Service.verifyKubAccount(account_number, ssn_last4, zip); 
        return res.status(200).json({account_number}); 
        
    } catch (error: any) {
        return res.status(error.status || 500).json({error: error.message || 'Verification failed'}); 
    }
}