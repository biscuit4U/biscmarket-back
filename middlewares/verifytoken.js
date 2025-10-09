import jwt from "jsonwebtoken";
import 'dotenv/config';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log(!token)

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        console.log(decoded)

        req.user = {
            id: decoded.userId,
            ...decoded
        };

        next();
    });
};