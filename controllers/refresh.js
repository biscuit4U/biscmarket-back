import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { pool } from '../db/pool.js';

export const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        console.log(user)
        const userInfo = await pool.query('SELECT * FROM users WHERE id = $1', [user.userId])
        const { id, email, name } = userInfo.rows[0]


        const accessToken = jwt.sign(
            { id: userInfo.rows[0].id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '30m' }
        );


        res.status(200).json({
            message: "Access token refreshed",
            accessToken,
            user: { id, name, email },
        });
    });
};
