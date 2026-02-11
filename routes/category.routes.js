const express = require("express");
const router = express.Router();
const { addCategory, getAllCategories, deleteCategory } = require("../controllers/category.controller");
const verifyToken = require("../middlewares/verifyToken");
const { verifyAdmin } = require("../middlewares/verifyAdmin");

router.post("/", verifyToken, verifyAdmin, addCategory);
router.get("/", verifyToken, verifyAdmin,  getAllCategories);
router.delete("/:id", verifyToken, verifyAdmin,  deleteCategory);

module.exports = router;
