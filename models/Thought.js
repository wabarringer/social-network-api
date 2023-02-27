const { Schema, model } = require("mongoose");

const thought = new Schema(
  {
    thought: { type: String },
    createdAt: { type: Date, default: Date.now },
    meta: { reactions: Number },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thought.virtual("formattedTime").get(function () {
  return this.createdAt.toLocaleString();
});

const Thought = model("thought", thought);

module.exports = Thought;
