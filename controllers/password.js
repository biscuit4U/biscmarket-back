import { hashPassword, generateOTP, sendOTPEmail, comparePassword } from "../utils/auth.js";
import xss from "xss";
import pool from "../db/pool.js";
export const requestPasswordChange = async (req, res) => {
    const { email } = xss(req.body.email)


    try {
        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND is_verified = TRUE',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                error: 'No verified user found with this email'
            });
        }

        const user = userResult.rows[0];
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query(
            'UPDATE users SET verification_otp = $1, otp_expires_at = $2 WHERE id = $3',
            [otp, otpExpires, user.id]
        );

        await sendOTPEmail(email, otp);

        res.json({
            message: 'OTP sent to your email for password change verification',
            email: email
        });

    } catch (error) {
        console.error('Password change request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const verifyPasswordChangeOTP = async (req, res) => {
    const { email } = xss(req.body.email)
    const { otp } = xss(req.body.otp)


    try {
        const userResult = await pool.query(
            `SELECT * FROM users 
             WHERE email = $1 AND verification_otp = $2 AND otp_expires_at > NOW()`,
            [email, otp]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({
                error: 'Invalid or expired OTP'
            });
        }

        const user = userResult.rows[0];

        // Generate a password change token (short-lived)
        const passwordChangeToken = jwt.sign(
            { userId: user.id, purpose: 'password_change' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Short-lived token for password change
        );

        // Clear OTP after successful verification
        await pool.query(
            'UPDATE users SET verification_otp = NULL, otp_expires_at = NULL WHERE id = $1',
            [user.id]
        );

        res.json({
            message: 'OTP verified successfully',
            passwordChangeToken: passwordChangeToken,
            email: user.email
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const changePasswordWithToken = async (req, res) => {
    const { passwordChangeToken } = xss(req.body.passwordChangeToken)
    const { newPassword } = xss(req.body.newPassword)


    try {
        // Verify the password change token
        const decoded = jwt.verify(passwordChangeToken, process.env.JWT_SECRET);

        if (decoded.purpose !== 'password_change') {
            return res.status(400).json({ error: 'Invalid token purpose' });
        }

        const userId = decoded.userId;

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [hashedPassword, userId]
        );

        res.json({
            message: 'Password changed successfully!'
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'Password change token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ error: 'Invalid token' });
        }
        console.error('Password change error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const changePasswordAuthenticated = async (req, res) => {
    const { currentPassword } = xss(req.body.currentPassword)
    const { newPassword } = xss(req.body.newPassword)

    const userId = req.user.id; // From auth middleware

    try {
        const userResult = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        // Verify current password
        const isCurrentPasswordValid = await comparePassword(currentPassword, user.password_hash);

        if (!isCurrentPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [hashedPassword, userId]
        );

        res.json({
            message: 'Password changed successfully!'
        });

    } catch (error) {
        console.error('Authenticated password change error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
