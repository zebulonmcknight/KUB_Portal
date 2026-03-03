import axios from 'axios';
import { supabase } from '../../database/supabase';

import dotenv from 'dotenv';
dotenv.config(); 

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN!;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID!;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET!;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE!; 

export class Auth0Service {
    async login(email: string, password: string) 
    {
        const response = await axios.post(
            `https://${AUTH0_DOMAIN}/oauth/token`, 
            {
                grant_type: 'password', 
                username: email, 
                password: password, 
                audience: AUTH0_AUDIENCE, 
                client_id: AUTH0_CLIENT_ID, 
                client_secret: AUTH0_CLIENT_SECRET, 
                scope: 'openid profile email'
            }
        ); 

        await this.syncUser(response.data.access_token); 
        return response.data; 
    }

    async signup(email: string, password: string, first_name?: string, last_name?: string, phone?: string)
    {
        const userData: any = {
            email, 
            password, 
            connection: 'Username-Password-Authentication'
        }; 

        if (first_name || last_name || phone) {
            userData.user_metadata = { first_name, last_name, phone}
        }

        await axios.post(
            `https://${AUTH0_DOMAIN}/dbconnections/signup`,
            { client_id: AUTH0_CLIENT_ID, ...userData}
        ); 

        return await this.login(email, password) 
    }

    private async syncUser(accessToken: string) 
    {
        const userInfo = await axios.get(
            `https://${AUTH0_DOMAIN}/userinfo`, 
            {
                headers: {Authorization: `Bearer ${accessToken}`}
            }
        ); 

        const user = userInfo.data; 

        // These two lines are absolutely disgusting sorry. 
        // It's pretty much fixing phone number format to be consistent between Auth0 
        // and supabase. strip non digit numbers, check if country code is present, 
        // if it is prepend '+', if it isn't prepend '+1' (assume american)
        const phone = user.phone_number?.replace(/\D/g, '');
        const formattedPhone = phone?.length === 10 ? `+1${phone}` : phone ? `+${phone}` : null;

        await supabase.from('dev_users').upsert({
            id: user.sub,
            email: user.email,
            first_name: user.given_name || null,
            last_name: user.family_name || null,
            phone: formattedPhone
        }, { onConflict: 'id' });

    }
}

export const auth0Service = new Auth0Service(); 

