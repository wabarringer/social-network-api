const express = require("express");
const router = express.Router();

const routes = require("./api");
router.use("/api", routes);

router.use("/", (req, res) => {
  res.send("Error: incorrect route");
});

module.exports = router;
