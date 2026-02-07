import { Request, Response } from 'express';

export const payment = (req : Request, res: Response) => {
    res.status(501).json({
        error: 'Not Implemented', 
        message: 'Billing payment endpoint is not yet implemented', 
        endpoint: 'POST /api/billing/payment'
    }); 
};