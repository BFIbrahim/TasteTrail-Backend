const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/admin.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/admin-stats", verifyToken, getAdminStats);

module.exports = router;