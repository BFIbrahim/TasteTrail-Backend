const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { getCurrentUser } = require("../controllers/user.controller");

router.get("/me", verifyToken, getCurrentUser);

module.exports = router;
