const express = require("express");
const router = express.Router();

const thoughtRoutes = require("./thoughtController");
router.use("/thoughts", thoughtRoutes);

const userRoutes = require("./userController");
router.use("/users", userRoutes);

module.exports = router;
