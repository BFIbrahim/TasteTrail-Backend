// routes/review.routes.js
const express = require("express");
const router = express.Router();
const { 
    postReview, 
    getRecipeReviews, 
    updateReviewStatus 
} = require("../controllers/review.controller");
const verifyToken = require("../middlewares/verifyToken");

// Public: View approved reviews for a recipe
router.get("/:recipeId", getRecipeReviews);

// Private: Post a review
router.post("/", verifyToken, postReview);

// Admin Only: Approve a review (You should add verifyAdmin here later)
router.patch("/approve/:id", verifyToken, updateReviewStatus);

module.exports = router;