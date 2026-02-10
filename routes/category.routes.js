const express = require("express");
const router = express.Router();
const { addCategory, getAllCategories, deleteCategory } = require("../controllers/category.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post("/", verifyToken, addCategory);
router.get("/", verifyToken, getAllCategories);
router.delete("/:id", verifyToken, deleteCategory);

module.exports = router;
