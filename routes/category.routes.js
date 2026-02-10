const express = require("express");
const router = express.Router();
const { addCategory, getAllCategories } = require("../controllers/category.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post("/", verifyToken, addCategory);
router.get("/", verifyToken, getAllCategories);

module.exports = router;
