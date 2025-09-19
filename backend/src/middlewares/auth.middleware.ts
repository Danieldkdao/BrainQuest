import { type Request, type Response, type NextFunction } from 'express';
import { getAuth } from '@clerk/express';

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  if(!auth.isAuthenticated) return res.status(401).json({success: false, message: "You are not authorized. Please login or create an account."});

  next();
}