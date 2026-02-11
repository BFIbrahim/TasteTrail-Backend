const Recipe = require("../models/Recipe.model");
const Cookbook = require("../models/Cookbook.model");
const MealPlan = require("../models/MealPlan.model");

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

const getRecommendedRecipes = async (req, res) => {
  try {
    const userId = req.user?.id; // Assumes your verifyToken sets req.user
    const limit = 18;
    let finalRecipes = [];

    // --- STEP 1: PERSONALIZED (Based on Cookbook History) ---
    if (userId) {
      const userCookbook = await Cookbook.find({ userId }).populate("recipeId");

      // Extract unique categories from their cookbook
      const favoriteCategories = [...new Set(userCookbook.map(item => item.recipeId?.category))].filter(Boolean);

      if (favoriteCategories.length > 0) {
        finalRecipes = await Recipe.find({
          category: { $in: favoriteCategories },
          // Don't recommend what they already have in the cookbook
          _id: { $nin: userCookbook.map(item => item.recipeId?._id) }
        }).limit(limit).lean();
      }
    }

    // --- STEP 2: FALLBACK - TRENDING (High Rating Gap Filler) ---
    if (finalRecipes.length < 12) {
      const currentIds = finalRecipes.map(r => r._id);
      const trending = await Recipe.find({
        rating: { $gte: 4.5 },
        _id: { $nin: currentIds }
      })
        .limit(limit - finalRecipes.length)
        .lean();

      finalRecipes = [...finalRecipes, ...trending];
    }

    // --- STEP 3: FALLBACK - RANDOM (Reaching 18) ---
    if (finalRecipes.length < limit) {
      const currentIds = finalRecipes.map(r => r._id);
      const random = await Recipe.aggregate([
        { $match: { _id: { $nin: currentIds } } },
        { $sample: { size: limit - finalRecipes.length } }
      ]);

      finalRecipes = [...finalRecipes, ...random];
    }

    res.status(200).json(finalRecipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // --- 1. REAL CALORIE DATA (From MealPlan) ---
    const caloriesData = await MealPlan.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%a", date: "$date" } }, // Mon, Tue...
          calories: { $sum: "$totalCalories" },
          sortDate: { $first: "$date" }
        }
      },
      { $sort: { sortDate: 1 } },
      { $project: { day: "$_id", calories: 1, _id: 0 } }
    ]);

    // --- 2. REAL MEAL DISTRIBUTION ---
    const mealDistribution = await MealPlan.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$mealType", // Breakfast, Lunch, etc.
          value: { $count: {} }
        }
      },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    res.status(200).json({
      caloriesData: caloriesData.length ? caloriesData : [{ day: 'No Data', calories: 0 }],
      mealDistribution: mealDistribution.length ? mealDistribution : [{ name: 'Empty', value: 1 }]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addRecipe, getRecipes, updateRecipe, deleteRecipe, getRecommendedRecipes, getUserStats };
