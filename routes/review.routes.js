const express = require("express");
const router = express.Router();
const { 
    postReview, 
    getRecipeReviews, 
    updateReviewStatus,
    getPendingReviews,
    approveReview ,
    deleteReview
} = require("../controllers/review.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/:recipeId", getRecipeReviews);

router.post("/", verifyToken, postReview);

router.get("/admin/pending", verifyToken, getPendingReviews); 
router.patch("/approve/:id", verifyToken, approveReview);
router.patch("/status/:id", verifyToken, updateReviewStatus);
router.delete("/admin/:id", verifyToken, deleteReview);

module.exports = router;