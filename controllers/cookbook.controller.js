const Cookbook = require("../models/Cookbook.model");

const addToCookbook = async (req, res) => {
    try {
        const { recipeId, userEmail } = req.body;

        const result = await Cookbook.findOneAndUpdate(
            { recipeId, userEmail },
            { recipeId, userEmail },
            {
                upsert: true,
                new: true,
                includeResultMetadata: true
            }
        );

        const wasAlreadyThere = result.lastErrorObject?.updatedExisting || false;

        if (wasAlreadyThere) {
            return res.status(200).json({
                alreadySaved: true,
                message: "Recipe is already in your cookbook!"
            });
        }

        res.status(201).json({
            message: "Added to your cookbook!",
            result: result.value || result
        });
    } catch (error) {
        console.error("Cookbook Error:", error);
        res.status(500).json({ message: "Failed to save recipe", error: error.message });
    }
};

const getMyCookbook = async (req, res) => {
    try {
        const { email } = req.params;
        const data = await Cookbook.find({ userEmail: email })
            .populate("recipeId")
            .sort({ createdAt: -1 });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFromCookbook = async (req, res) => {
    try {
        const { id } = req.params;
        await Cookbook.findByIdAndDelete(id);
        res.status(200).json({ message: "Removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToCookbook, getMyCookbook, removeFromCookbook };