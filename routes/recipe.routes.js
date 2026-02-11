const express = require("express");
const router = express.Router();
const { 
  addRecipe, 
  getRecipes, 
  updateRecipe, 
  deleteRecipe,
  getRecommendedRecipes,
  getUserStats
} = require("../controllers/recipe.controller");
const verifyToken = require("../middlewares/verifyToken");
const { verifyAdmin } = require("../middlewares/verifyAdmin");


// 1. Recommendation Route (Place this above /:id)
router.get("/recommended", verifyToken, getRecommendedRecipes);

// 2. Standard Recipes Routes
router.get("/", verifyToken, getRecipes);
router.post("/", verifyToken, verifyAdmin, addRecipe);

// 3. ID-based Routes
router.patch("/:id", verifyToken, verifyAdmin, updateRecipe);
router.delete("/:id", verifyToken, verifyAdmin,  deleteRecipe);
router.get("/user-stats", verifyToken, getUserStats);

module.exports = router;