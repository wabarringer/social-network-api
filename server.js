const express = require("express");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const allRoutes = require("./controllers");
app.use("/", allRoutes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`);
  });
});
