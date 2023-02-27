const express = require("express");
const { User, Thoughts } = require("../../models");
const router = express.Router();

// READ All
router.get("/", async (req, res) => {
  try {
    const foundThoughts = await Thoughts.find();
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
    const thought = await Thoughts.findById(id);
    if (!thought) {
      return res.status(404).json({ msg: "no such thought" });
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
router.post("/", async ({ body: { thoughtText, username } }, res) => {
  try {
    const newThought = await Thoughts.create({ thoughtText, username });
    const createUser = await User.findOne({ username });
    if (!createUser) {
      return res.status(404).json({
        msg: "Error: Record does not exist",
      });
    }
    const userThoughtArr = [...createUser.thoughts, newThought];
    await User.findByIdAndUpdate(createUser._id, { thoughts: userThoughtArr });
    res.json({ createUser, msg: "Record was successfully created" });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error: Unable to get records",
      err,
    });
  }
});

// UPDATE
router.put(
  "/:id",
  async ({ params: { id }, body: { thoughtText, username } }, res) => {
    try {
      const thoughtUpdate = await Thoughts.findByIdAndUpdate(
        id,
        { thoughtText, username },
        { new: true }
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
  }
);

// DELETE
router.delete("/:id", async ({ params: { id } }, res) => {
  try {
    const deleteThought = await Thoughts.findByIdAndDelete(id);
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
    const thought = await Thoughts.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({
        msg: "Error: Record does not exist",
      });
    }
    const newReaction = {
      reactionBody: req.body.reactionBody,
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
    const thought = await Thoughts.findByIdAndUpdate(
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
