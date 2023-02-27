const express = require("express");
const { User } = require("../../models");
const router = express.Router();

// READ all
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// READ one
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) {
      res.status(404).json({
        msg: "Error: Record does not exist",
      });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
    });
    res.json(newUser);
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const userUpdate = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { username: req.body.username, email: req.body.email } }
    );
    if (!userUpdate) {
      res.status(404).json({
        msg: "Error: Record does not exist",
      });
    } else {
      res.json(userUpdate);
    }
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);

    if (!deleteUser) {
      res.status(404).json({
        msg: "Error: Record does not exist",
      });
    } else {
      res.json(deleteUser);
    }
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

module.exports = router;
