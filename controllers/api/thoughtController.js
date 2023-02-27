const express = require("express");
const { User, Thoughts } = require("../../models");
const router = express.Router();

// READ all
router.get("/", async (req, res) => {
  try {
    const thoughts = await Thoughts.find();
    res.json(thoughts);
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
    const thought = await Thoughts.findOne({
      _id: req.params.id,
    });
    if (!thought) {
      res.status(404).json({
        msg: "Error: Record does not exist",
      });
    } else {
      res.json(thought);
    }
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get record",
      err,
    });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const newThought = await Thoughts.create({
      thoughtText: req.body.thoughtText,
      username: req.body.username,
    });
    if (newThought) {
      const findOneUser = await User.findOne({
        username: req.body.username,
      });
      if (!findOneUser) {
        return res.status(404).json({
          msg: "Error: Record does not exist",
        });
      }
      let userThoughtArr = findOneUser.thoughts;
      userThoughtArr.push(newThought);
      res.json(findOneUser);
    } else {
      return res.status(500).json({
        msg: "Error: Unable to create record",
      });
    }
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get record",
      err,
    });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const thoughUpdate = await Thoughts.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          thoughtText: req.body.thoughtText,
          username: req.body.username,
        },
      }
    );
    if (!thoughUpdate) {
      res.status(404).json({
        msg: "Error: Record does not exist",
      });
    } else {
      res.json(thoughUpdate);
    }
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get record",
      err,
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleteThought = await Thoughts.findByIdAndDelete(req.params.id);
    if (!deleteThought) {
      res.status(404).json({
        msg: "Error: Record does not exist",
      });
    } else {
      res.json(deleteThought);
    }
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get record",
      err,
    });
  }
});

// CREATE reaction
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const foundThought = await Thoughts.findById(req.params.thoughtId);
    if (!foundThought) {
      res.status(404).json({ msg: "Error: Record does not exist" });
    } else {
      let reactionArr = foundThought.reactions;
      let newReaction = {
        reactionBody: req.body.reactionBody,
        username: req.body.username,
      };
      await reactionArr.push(newReaction);
      res.json(foundThought);
    }
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Unable to get record", err });
  }
});

// DELETE reaction
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const foundThought = await Thoughts.findByIdAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId } } }
    );

    res.json(foundThought);
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Unable to get record", err });
  }
});

module.exports = router;
