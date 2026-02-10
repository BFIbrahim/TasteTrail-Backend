const Recipe = require("../models/Recipe.model");

const addRecipe = async (req, res) => {
  try {
    const {
      title,
      cookingTime,
      calories,
      cuisine,
      instructions,
      category,
      ingredients,
      image,
    } = req.body;

    if (!title || !cookingTime || !calories || !cuisine || !instructions || !category || !ingredients || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRecipe = await Recipe.create({
      title,
      cookingTime,
      calories,
      cuisine,
      instructions,
      category,
      ingredients,
      image,
    });

    res.status(201).json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ 
      message: "Recipe updated successfully", 
      recipe: updatedRecipe 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addRecipe, getRecipes, updateRecipe, deleteRecipe };
