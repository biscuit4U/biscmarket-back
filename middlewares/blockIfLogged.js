import jwt from 'jsonwebtoken';
import 'dotenv/config'

export const blockIfLogin = (req, res, next) => {
    const token = req.cookies.refreshToken;
    console.log("token" + !token)
    if (!token) return next();
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err) => {
        if (err) return next();
        return res.status(403).json({ message: 'you are already logged in' });
    })
}  