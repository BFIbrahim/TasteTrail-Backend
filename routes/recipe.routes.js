const express = require("express");
const router = express.Router();
const { 
  addRecipe, 
  getRecipes, 
  updateRecipe, 
  deleteRecipe 
} = require("../controllers/recipe.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getRecipes);
router.post("/", verifyToken, addRecipe);

router.patch("/:id", verifyToken, updateRecipe);
router.delete("/:id", verifyToken, deleteRecipe);

module.exports = router;