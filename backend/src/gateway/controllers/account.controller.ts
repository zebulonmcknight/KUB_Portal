import { Request, Response } from 'express';

export const profile = (req : Request, res: Response) => {
    res.status(501).json({
        error: 'Not Implemented', 
        message: 'Account endpoint is not yet implemented', 
        endpoint: 'POST /api/account/profile'
    }); 
}; 