import { Request, Response } from 'express';
import { supabase } from '../../database/supabase';

export const get_user_by_email = async (req : Request, res: Response) => {
    try {
        const { email } = req.query; 
        
        if (!email || typeof email !== "string") {
            return res.status(400).json({
                error: "Missing or invalid email",
            }); 
        }

        const {data, error} = await supabase
            .from("dev_users")
            .select("*")
            .eq("email", email.toLowerCase())
            .single(); 

        if (error || !data) {
            return res.status(404).json({
                error: "User not found", 
            }); 
        }

        return res.status(200).json({
            user: data,
        }); 

    } catch (err) {
        console.error("GET_USER_ERROR:", err); 

        return res.status(500).json({
            error: "Internal server error",
        }); 
    }
}; 