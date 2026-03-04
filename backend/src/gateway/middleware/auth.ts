import { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

export const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE, 
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`, 
    tokenSigningAlg: 'RS256'
}); 

export const extractUserID = (req: Request, res: Response, next: NextFunction) => {
    const authPayload = (req as any).auth?.payload;
    if (!authPayload?.sub) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    (req as any).userId = authPayload.sub;
    next();
}