const { Schema, model } = require("mongoose");
const { Reaction } = require("./Reaction");

const thought = new Schema(
  {
    thought: { type: String },
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

const Thought = model("thought", thought);

module.exports = Thought;
