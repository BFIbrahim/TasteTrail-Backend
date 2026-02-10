const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
    userEmail: { 
        type: String, 
        required: true
    },
    recipeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Recipe", 
        required: true 
    },
    day: { 
        type: String, 
        enum: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Planned", "Cooking", "Cooked"], 
        default: "Planned" 
    },
    date: { 
        type: Date, 
        default: Date.now
    }
}, { timestamps: true });

mealPlanSchema.index({ userEmail: 1, recipeId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model("MealPlan", mealPlanSchema);