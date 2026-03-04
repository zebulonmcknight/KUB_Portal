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
        const {email, password, first_name, last_name, phone} = req.body; 
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required'}); 
        }

        const signup = await auth0Service.signup(email, password, first_name, last_name, phone); 
        return res.status(201).json({
            message: 'Signup Successful',
            access_token: signup.access_token, 
            expires_in: signup.expires_in
        })

    } catch (error: any) {
        console.error('Signup error details:', error);
        console.error('message', error.message) 
        // return the error description or if null, 'Signup Failed' 
        return res.status(401).json({error: error.response?.data?.message || 'Signup Failed'})
    }
}