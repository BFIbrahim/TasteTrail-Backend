const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    recipeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Recipe", 
        required: true 
    },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userImage: { type: String },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comment: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["pending", "approved"], 
        default: "pending" 
    }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);