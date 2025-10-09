import { pool } from "../db/pool.js";

export const deleteAccount = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting account" });
    }
};
