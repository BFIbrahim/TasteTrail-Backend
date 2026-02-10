const MealPlan = require("../models/MealPlan.model");

// 1. Add Recipe to Plan
const addToPlan = async (req, res) => {
    try {
        const { recipeId, day, userEmail: bodyEmail } = req.body;
        // Use email from token (req.user) for security, fall back to body if needed
        const userEmail = req.user?.email || bodyEmail; 

        if (!userEmail) {
            return res.status(401).json({ message: "User email not found" });
        }

        const existing = await MealPlan.findOne({ userEmail, recipeId, day });
        if (existing) {
            return res.status(400).json({ message: "Recipe already planned for this day!" });
        }

        const newPlan = await MealPlan.create({ userEmail, recipeId, day });
        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get User's Weekly Plan
const getWeeklyPlan = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const plan = await MealPlan.find({ userEmail })
            // CHANGE: Use "title" instead of "name" to match your DB
            .populate("recipeId", "title image calories") 
            .sort({ date: 1 });

        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Update Status (Planned -> Cooking -> Cooked)
const updateMealStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updated = await MealPlan.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Delete from Plan
const deleteFromPlan = async (req, res) => {
    try {
        const { id } = req.params;
        await MealPlan.findByIdAndDelete(id);
        res.status(200).json({ message: "Removed from meal planner" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Get Stats for Progress Bar
const getMealStats = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const stats = await MealPlan.aggregate([
            { $match: { userEmail } },
            { $group: {
                _id: null,
                total: { $sum: 1 },
                cooked: { $sum: { $cond: [{ $eq: ["$status", "Cooked"] }, 1, 0] } }
            }}
        ]);
        res.status(200).json(stats[0] || { total: 0, cooked: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToPlan, getWeeklyPlan, updateMealStatus, deleteFromPlan, getMealStats };