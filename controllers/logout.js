export const logOut = async (req, res) => {
    const id = req.user?.id;

    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        res.status(200).json({ message: "Logged out" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
