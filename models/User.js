const mongoose = require("mongoose");
const { Thought } = require("./Thought");

function validateEmail(email) {
  let re = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return re.test(email);
}

const userSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, "Please enter a valid email address."],
    },
    thoughts: [
      {
        // thought undefined
        // TODO: Figure out how to reference
        type: [thought],
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
