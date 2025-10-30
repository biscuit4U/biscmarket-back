import { generateAccessToken, generateRefreshToken } from "../utils/auth.js";
import pool from "../db/pool.js";
import xss from "xss";
export const googleAuth = async (req, res) => {
    const googleId = xss(req.body.google_token)
    const email = xss(req.body.email)
    const name = xss(req.body.name)


    console.log(googleId, email, name)

    try {
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR google_id = $2',
            [email, googleId]
        );

        let user;

        if (existingUser.rows.length > 0) {
            user = existingUser.rows[0];

            // Update existing user with Google ID if needed
            if (!user.google_id) {
                await pool.query(
                    'UPDATE users SET google_id = $1, is_verified = TRUE WHERE id = $2',
                    [googleId, user.id]
                );
                user.google_id = googleId;
                user.is_verified = true;
            }
        } else {
            // New Google user
            const result = await pool.query(
                `INSERT INTO users (name, email, google_id, is_verified) 
                 VALUES ($1, $2, $3, TRUE) RETURNING *`,
                [name, email, googleId]
            );
            user = result.rows[0];
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });


        res.json({
            message: 'Google login successful!',
            user: { name: user.name, id: user.id, email: user.email },
            accessToken
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};