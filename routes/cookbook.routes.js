const express = require("express");
const router = express.Router();
const { addToCookbook, getMyCookbook, removeFromCookbook } = require("../controllers/cookbook.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post("/", verifyToken, addToCookbook);
router.get("/:email", verifyToken, getMyCookbook);
router.delete("/:id", verifyToken, removeFromCookbook);

module.exports = router;