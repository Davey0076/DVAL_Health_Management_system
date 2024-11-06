// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'some_secret_key';


export interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return; 
    }

    try {
        // Verify the token and attach decoded token info to request object
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 

        next();
    } catch (error) {
        if (error instanceof Error) {
            console.error('Token Verification Error:', error.message);
        } else {
            console.error('Token Verification Error:', error);
        }
        res.status(403).json({ message: 'Invalid token.' });
    }
};

export default authMiddleware;
