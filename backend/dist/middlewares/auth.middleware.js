import { getAuth } from '@clerk/express';
export const protectRoute = async (req, res, next) => {
    const auth = getAuth(req);
    if (!auth.isAuthenticated)
        return res.status(401).json({ success: false, message: "You are not authorized. Please login or create an account." });
    next();
};
