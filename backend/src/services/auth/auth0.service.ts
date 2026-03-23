import axios from 'axios';
import { supabase } from '../../database/supabase';

import dotenv from 'dotenv';
dotenv.config(); 

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN!;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID!;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET!;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE!; 

export class Auth0Service {
    async login(email: string, password: string, account_number?: string) 
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

        await this.syncUser(response.data.access_token, account_number); 
        return response.data; 
    }

    async signup(email: string, password: string, account_number: string, first_name?: string, last_name?: string, phone?: string) {
        await axios.post(`https://${AUTH0_DOMAIN}/dbconnections/signup`, {
            client_id: AUTH0_CLIENT_ID,
            email,
            password,
            connection: 'Username-Password-Authentication',
            ...(first_name && { given_name: first_name }),
            ...(last_name && { family_name: last_name }),
            ...(phone && { user_metadata: { phone } })
        });

        return await this.login(email, password, account_number);
    }

    async verifyKubAccount(account_number: string, ssn_last4: string, zip: string) {
        const { data, error } = await supabase
            .from('kub_accounts')
            .select('account_number, is_registered')
            .eq('account_number', account_number)
            .eq('ssn_last4', ssn_last4)
            .eq('zip', zip)
            .maybeSingle(); 

        if (error || !data) {
            const err: any = new Error('No matching service account found.'); 
            err.status = 404; 
            throw err; 
        }

        if (data.is_registered) {
            const err: any = new Error('An app account already exists for this service account.'); 
            err.status = 409; 
            throw err; 
        }
    }

    private async syncUser(accessToken: string, account_number?: string) {
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
            phone: formattedPhone, 
            ...(account_number && {account_number})
        }, { onConflict: 'id' });

        if (account_number) {
            await supabase
                .from('kub_accounts')
                .update({ is_registered: true })
                .eq('account_number', account_number); 
        }
    }

    private formatPhone(phone: string): string {
        const digits = phone.replace(/\D/g, '');
        return digits.length === 10 ? `+1${digits}` : `+${digits}`;
    }
}

export const auth0Service = new Auth0Service(); 

