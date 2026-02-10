const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { 
    addToPlan, 
    getWeeklyPlan, 
    updateMealStatus, 
    deleteFromPlan,
    getMealStats 
} = require("../controllers/mealPlanner.controller");

router.use(verifyToken);
router.get("/", getWeeklyPlan);
router.get("/stats", getMealStats);
router.post("/", addToPlan);
router.patch("/:id", updateMealStatus);
router.delete("/:id", deleteFromPlan);

module.exports = router;