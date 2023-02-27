const mongoose = require("mongoose");

function checkEmail(email) {
  let regexEmailChecker = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return regexEmailChecker.test(email);
}

const reaction = new mongoose.Schema(
  {
    reactionId: {
      type: String,
      default: new mongoose.Types.ObjectId().toString(),
    },
    reactionBody: { type: String, required: true, maxLength: 280 },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
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
      virtuals: true,
    },
  }
);

thought.virtual("formattedTime").get(function () {
  return this.createdAt.toLocaleString();
});

reaction.virtual("formattedTime").get(function () {
  return this.createdAt.toLocaleString();
});

const user = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [checkEmail, "Please enter a valid email address."],
  },
  thoughts: [thought],
});

// Mongoose.model not a constructor???
const User = new mongoose.model("User", user);
const Thought = new mongoose.model("Thought", thought);
const Reaction = new mongoose.moedel("Reaction", reaction);

module.exports = { User, Thought, Reaction };
