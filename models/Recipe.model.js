const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: String, required: true },
});

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    cookingTime: { type: String, required: true },
    calories: { type: Number, required: true },
    cuisine: { type: String, required: true },
    instructions: { type: String, required: true },
    category: { type: String, required: true }, // <-- changed
    ingredients: [ingredientSchema],
    image: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });


module.exports = mongoose.model("Recipe", recipeSchema);
