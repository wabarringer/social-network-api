const mongoose = require("mongoose");
const { isEmail } = require("validator");

const baseSchemaOptions = {
  toJSON: {
    getters: true,
  },
};

const reaction = new mongoose.Schema(
  {
    reactionId: {
      type: mongoose.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    reactionBody: { type: String, required: true, maxLength: 280 },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  baseSchemaOptions
);

const thought = new mongoose.Schema(
  {
    thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    reactions: [reaction],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

thought.virtual("formattedTime").get(function () {
  return this.createdAt.toLocaleString();
});

const user = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "Please enter a valid email address."],
    },
    thoughts: [thought],
  },
  baseSchemaOptions
);

const User = mongoose.model("User", user);
const Thought = mongoose.model("Thought", thought);
const Reaction = mongoose.model("Reaction", reaction);

module.exports = { User, Thought, Reaction };
