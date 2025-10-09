import { pool } from "../db/pool.js";
import { generateOTP, sendOTPEmail } from "../utils/auth.js";
import xss from "xss";

//if user already registered but otp is expired
export const resendOTP = async (req, res) => {
    const { email } = xss(req.body.email);

    try {
        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND is_verified = FALSE',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                error: 'No pending verification found for this email.'
            });
        }

        const user = userResult.rows[0];
        const newOtp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query(
            'UPDATE users SET verification_otp = $1, otp_expires_at = $2 WHERE id = $3',
            [newOtp, otpExpires, user.id]
        );

        await sendOTPEmail(email, newOtp);

        res.json({
            message: 'New OTP sent to your email.'
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            error: 'Internal server error while resending OTP'
        });
    }
};