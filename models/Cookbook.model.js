const mongoose = require("mongoose");

const cookbookSchema = new mongoose.Schema({
    recipeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Recipe", 
        required: true 
    },
    userEmail: { type: String, required: true },
    addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

cookbookSchema.index({ recipeId: 1, userEmail: 1 }, { unique: true });

module.exports = mongoose.model("Cookbook", cookbookSchema);