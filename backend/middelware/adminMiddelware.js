
const User = require("../models/userModel");
const admin = require("../firebase/firebaseAdmin");

const adminCheck = async (req, res, next) => {
    const idToken = req.headers.idtoken;

    if (!idToken) {
        return res.status(401).json({ message: "Token is required" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid } = decodedToken;

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only" });
        }

        req.user = user; // Attach user to request object
        next(); // Call next middleware or route handler
    } catch (error) {
        console.error("Error verifying admin:", error);
        return res.status(500).json({ message: "Server error. Unable to verify admin." });
    }
};

module.exports = adminCheck;
