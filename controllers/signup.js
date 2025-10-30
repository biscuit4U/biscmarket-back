import pool from "../db/pool.js"
import { hashPassword, generateOTP, sendOTPEmail } from "../utils/auth.js";
import xss from "xss";
export const register = async (req, res) => {
    const email = xss(req.body.email);
    const password = xss(req.body.password);
    const name = xss(req.body.name);

    console.log(name, email, password)

    try {
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        console.log(existingUser)

        if (existingUser.rows.length > 0) {
            const user = existingUser.rows[0];

            // User exists with Google - convert to email/password
            if (user.google_id && !user.password_hash) {
                const hashedPassword = await hashPassword(password);
                const otp = generateOTP();
                const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

                await pool.query(
                    `UPDATE users 
                     SET name = $1, password_hash = $2, verification_otp = $3, otp_expires_at = $4, 
                         is_verified = FALSE 
                     WHERE id = $5`,
                    [name, hashedPassword, otp, otpExpires, user.id]
                );

                await sendOTPEmail(email, otp);

                return res.json({
                    message: 'Account converted to email/password. OTP sent for verification.',
                    converted: true
                });
            }

            if (user.is_verified) {
                return res.status(400).json({ message: 'Email already registered' });
            } else {
                // Existing unverified user - resend OTP
                const newOtp = generateOTP();
                const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

                await pool.query(
                    'UPDATE users SET verification_otp = $1, otp_expires_at = $2 WHERE id = $3',
                    [newOtp, otpExpires, user.id]
                );

                await sendOTPEmail(email, newOtp);

                return res.json({
                    message: 'OTP resent to your email',
                    email: email
                }
                );
            }
        }

        // New user - create account
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword)
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, verification_otp, otp_expires_at) 
             VALUES ($1, $2, $3, $4, $5) RETURNING name, id, email, is_verified`,
            [name, email, hashedPassword, otp, otpExpires]
        );

        await sendOTPEmail(email, otp);

        res.status(201).json({
            message: 'Registration successful! OTP sent to your email.',
            user: { id: result.rows[0].id, email: result.rows[0].email }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};