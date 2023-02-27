const express = require("express");
const { User } = require("../../models");
const router = express.Router();

// READ all with pagination
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}).skip(skip).limit(limit);
    const count = await User.countDocuments();
    res.json({
      totalUsers: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      users,
    });
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
    res.json({
      newUser,
      msg: "Record was successfully created",
    });
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
      res.json({
        userUpdate,
        msg: "Record was successfully updated",
      });
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
      res.json({
        deleteUser,
        msg: "Record was successfully deleted",
      });
    }
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// Add Friend
router.post("/:userId/friends", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        msg: "Error: Record does not exist",
      });
    }

    user.friends.push(req.body.friendId);
    const savedUser = await user.save();

    res.json({
      savedUser,
      msg: "Record was successfully created",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// DELETE Friend
router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const deleteFriend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );
    if (!deleteFriend) {
      return res.status(404).json({
        msg: "Error: Record does not exist",
      });
    }
    res.json({
      deleteFriend,
      msg: "Record was successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

module.exports = router;
