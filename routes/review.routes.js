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
const { verifyAdmin } = require("../middlewares/verifyAdmin");


router.get("/:recipeId", getRecipeReviews);
router.post("/", verifyToken, postReview);
router.get("/admin/pending", verifyToken, verifyAdmin, getPendingReviews); 
router.patch("/approve/:id", verifyToken, verifyAdmin, approveReview);
router.patch("/status/:id", verifyToken, verifyAdmin, updateReviewStatus);
router.delete("/admin/:id", verifyToken,verifyAdmin, deleteReview);

module.exports = router;