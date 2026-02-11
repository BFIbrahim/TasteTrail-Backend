const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const Review = require("../models/Review.model");
const Cookbook = require("../models/Cookbook.model");

const getAdminStats = async (req, res) => {
    try {
        const [totalUsers, totalRecipes, totalReviews, totalSaves] = await Promise.all([
            User.countDocuments(),
            Recipe.countDocuments(),
            Review.countDocuments(),
            Cookbook.countDocuments(),
        ]);

        const categoryDistribution = await Recipe.aggregate([
            { $group: { _id: "$category", value: { $sum: 1 } } },
            { $project: { name: "$_id", value: 1, _id: 0 } }
        ]);

        const userGrowth = [
            { month: 'Oct', users: 40 },
            { month: 'Nov', users: 80 },
            { month: 'Dec', users: 150 },
            { month: 'Jan', users: totalUsers }
        ];

        res.status(200).json({
            totalUsers,
            totalRecipes,
            totalReviews,
            totalSaves,
            categoryDistribution,
            userGrowth,
            recentActivities: []
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAdminStats };