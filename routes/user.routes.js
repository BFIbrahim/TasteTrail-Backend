const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { verifyAdmin } = require("../middlewares/verifyAdmin");
const { 
    getCurrentUser, 
    getAllUsers, 
    makeAdmin, 
    deleteUser 
} = require("../controllers/user.controller");

router.get("/me", verifyToken, getCurrentUser);
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.patch("/admin/:id", verifyToken, verifyAdmin, makeAdmin);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

module.exports = router;