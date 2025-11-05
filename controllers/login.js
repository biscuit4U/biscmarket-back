import { comparePassword, generateOTP, sendOTPEmail, generateAccessToken, generateRefreshToken } from "../utils/auth.js";
import pool from "../db/pool.js";
import xss from "xss";

export const login = async (req, res) => {
    const email = xss(req.body.email)
    const password = xss(req.body.password)

    console.log(email, password)

    try {
        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        console.log(userResult.rows.length)
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = userResult.rows[0];

        // User exists but only has Google auth
        if (user.google_id && !user.password_hash) {
            return res.status(400).json({
                error: 'Account exists with Google',
                message: 'Please use "Continue with Google" to login'
            });
        }

        const isPasswordValid = await comparePassword(password, user.password_hash);
        console.log(isPasswordValid)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.is_verified) {
            const newOtp = generateOTP();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

            await pool.query(
                'UPDATE users SET verification_otp = $1, otp_expires_at = $2 WHERE id = $3',
                [newOtp, otpExpires, user.id]
            );

            await sendOTPEmail(email, newOtp);

            return res.status(403).json({
                error: 'Email not verified',
                message: 'New OTP sent to your email'
            });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });


        res.json({
            message: 'Login successful!',
            user: { name: user.name, id: user.id, email: user.email },
            accessToken
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};