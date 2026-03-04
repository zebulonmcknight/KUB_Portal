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

    async signup(email: string, password: string, first_name?: string, last_name?: string, phone?: string) {
        await axios.post(`https://${AUTH0_DOMAIN}/dbconnections/signup`, {
            client_id: AUTH0_CLIENT_ID,
            email,
            password,
            connection: 'Username-Password-Authentication',
            ...(first_name && { given_name: first_name }),
            ...(last_name && { family_name: last_name }),
            ...(phone && { user_metadata: { phone } })
        });

        return await this.login(email, password);
    }

    private async syncUser(accessToken: string) {
        const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString()); 
        
        const userInfoResponse = await axios.get(`https://${AUTH0_DOMAIN}/userinfo`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const user = userInfoResponse.data;
        //console.log('userinfo response:', JSON.stringify(user, null, 2)); 

        const phone = payload.user_metadata?.phone ?? null;
        const formattedPhone = phone ? this.formatPhone(phone) : null;

        await supabase.from('dev_users').upsert({
            id: user.sub,
            email: user.email,
            first_name: user.given_name || null,
            last_name: user.family_name || null,
            phone: formattedPhone
        }, { onConflict: 'id' });
    }

    private formatPhone(phone: string): string {
        const digits = phone.replace(/\D/g, '');
        return digits.length === 10 ? `+1${digits}` : `+${digits}`;
    }
}

export const auth0Service = new Auth0Service(); 

