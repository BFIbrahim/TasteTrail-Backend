const User = require("../models/User.model");

const verifyAdmin = async (req, res, next) => {
    try {
        const email = req.user?.email; 

        if (!email) {
            return res.status(401).json({ message: 'Unauthorized: User email not found' });
        }

        const user = await User.findOne({ email });
        
        if (user?.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error during admin verification" });
    }
};

module.exports = { verifyAdmin };