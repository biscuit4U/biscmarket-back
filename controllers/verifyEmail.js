import { generateAccessToken, generateRefreshToken } from "../utils/auth.js";
import { pool } from "../db/pool.js";
import xss from "xss";

//after the user sent otp, this step for check
export const verifyEmail = async (req, res) => {
    const email = xss(req.body.email);
    const otp = xss(req.body.otp);


    try {
        // Find user by email and OTP
        const userResult = await pool.query(
            `SELECT * FROM users 
       WHERE email = $1 AND verification_otp = $2 AND otp_expires_at > NOW()`,
            [email, otp]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({
                error: 'Invalid or expired OTP. Please request a new one.'
            });
        }

        const user = userResult.rows[0];

        // Mark email as verified and clear OTP
        await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_otp = NULL, otp_expires_at = NULL WHERE id = $1',
            [user.id]
        );

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });


        res.json({
            message: 'Email verified successfully!',
            user: {
                name: user.name,
                id: user.id,
                email: user.email,
                isVerified: true
            },
            accessToken
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            error: 'Internal server error during email verification'
        });
    }
};
