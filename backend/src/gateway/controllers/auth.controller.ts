import { Request, Response } from 'express';

export const login = (req : Request, res: Response) => {
    res.status(501).json({
        error: 'Not Implemented', 
        message: 'Auth login endpoint is not yet implemented', 
        endpoint: 'POST /api/auth/login'
    }); 
}; 