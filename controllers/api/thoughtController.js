const express = require("express");
const { User, Thought } = require("../../models");
const router = express.Router();

// READ All
router.get("/", async (req, res) => {
  try {
    const foundThoughts = await Thought.find();
    res.json(foundThoughts);
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// READ One
router.get("/:id", async ({ params: { id } }, res) => {
  try {
    const thought = await Thought.findById(id);
    if (!thought) {
      return res.status(404).json({
        msg: "Error: Record does not exist",
        err,
      });
    }
    res.json(thought);
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
    const newThought = await Thought.create({
      thoughtText: req.body.thoughtText,
      username: req.body.username,
    });
    if (newThought) {
      const username = await User.findOne({
        username: req.body.username,
      });
      if (!username) {
        return res
          .status(404)
          .json({ msg: "Error: Record does not exist", err });
      }
      let userThoughtArr = username.thoughts;
      userThoughtArr.push(newThought);
      res.json({ username, msg: "Record was successfully created" });
    }
  } catch (err) {
    res.status(500).json({ msg: "an error occurred", err });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const thoughtUpdate = await Thought.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          thoughtText: req.body.thoughtText,
          new: false,
        },
      }
    );
    if (!thoughtUpdate) {
      return res.status(404).json({
        msg: "Error: Record does not exist",
      });
    }
    res.json({ thoughtUpdate, msg: "Record was successfully updated" });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// DELETE
router.delete("/:id", async ({ params: { id } }, res) => {
  try {
    const deleteThought = await Thought.findByIdAndDelete(id);
    if (!deleteThought) {
      return res.status(404).json({
        msg: "Error: Record does not exist",
      });
    }
    res.json({ deleteThought, msg: "Record was successfully deleted" });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// CREATE Reaction
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({
        msg: "Error: Record does not exist",
      });
    }
    const newReaction = {
      reaction: req.body.reaction,
      username: req.body.username,
    };

    thought.reactions.push(newReaction);
    const savedThought = await thought.save();

    res.json({ savedThought, msg: "Record was successfully created" });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// DELETE Reaction
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true }
    );
    if (!thought) {
      return res.status(404).json({
        msg: "Error: Record does not exist",
      });
    }

    res.json({ thought, msg: "Record was successfully deleted" });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

module.exports = router;
