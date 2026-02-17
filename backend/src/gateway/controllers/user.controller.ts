import { Request, Response } from 'express';
import { supabase } from '../../database/supabase'; // example database client import 

// THIS ENDPOINT SHOULD NEVER BE EXPOSED TO USERS. DO NOT LET USERS RETURN DATA
// ABOUT ARBITRARY USERS BY EMAIL. 


export const get_user_by_email = async (req : Request, res: Response) => {
    try {
        const { email } = req.query; // request should contain email in the body
        
        // If the email is missing or invalid, send a 400 'bad request' error
        if (!email || typeof email !== "string") {
            return res.status(400).json({
                error: "Missing or invalid email",
            }); 
        }

        // Here we await supabase, ie we pause execution until supabase client responds with 
        // queried data. In this case the row corresponding to the entered email. 
        const {data, error} = await supabase
            .from("dev_users")
            .select("*")
            .eq("email", email.toLowerCase())
            .single(); 

        // If there is an error or no data is returned, send a 404 'not found' error
        if (error || !data) {
            return res.status(404).json({
                error: "User not found", 
            }); 
        }

        // Once we have passed all error checks, send a 200 'good' code and the user body
        return res.status(200).json({
            user: data,
        }); 

    } catch (err) { // catch block for internal errors 
        console.error("GET_USER_ERROR:", err); 
        
        // respond with 500 'internal error' 
        return res.status(500).json({
            error: "Internal server error",
        }); 
    }
}; 