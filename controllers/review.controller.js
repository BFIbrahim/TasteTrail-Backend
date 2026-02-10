const Review = require("../models/Review.model");
const mongoose = require("mongoose");

const postReview = async (req, res) => {
    try {
        const { recipeId, rating, comment, userName, userEmail, userImage } = req.body;

        if (!recipeId || !rating || !comment) {
            return res.status(400).json({ message: "Rating and comment are required." });
        }

        const newReview = await Review.create({
            recipeId,
            rating,
            comment,
            userName,
            userEmail,
            userImage,
            status: "pending"
        });

        res.status(201).json({ 
            message: "Review submitted! It will appear after admin approval.", 
            review: newReview 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecipeReviews = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const reviews = await Review.find({ 
            recipeId: new mongoose.Types.ObjectId(recipeId), 
            status: "approved" 
        }).sort({ createdAt: -1 });

        const stats = await Review.aggregate([
            { 
                $match: { 
                    recipeId: new mongoose.Types.ObjectId(recipeId), 
                    status: "approved" 
                } 
            },
            { 
                $group: { 
                    _id: "$recipeId", 
                    avgRating: { $avg: "$rating" }, 
                    totalReviews: { $sum: 1 } 
                } 
            }
        ]);

        res.status(200).json({
            reviews,
            stats: stats[0] || { avgRating: 0, totalReviews: 0 }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Admin: Update review status (Approve/Delete)
const updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // e.g., "approved"

        const updatedReview = await Review.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );

        res.status(200).json({ message: `Review ${status}`, updatedReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { postReview, getRecipeReviews, updateReviewStatus };