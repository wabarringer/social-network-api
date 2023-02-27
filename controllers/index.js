const router = require("express").Router();
const routes = require("./api");

router.use("/api", routes);

router.use("*", (req, res) => {
  res.status(404).send("Error: incorrect route");
});

module.exports = router;
