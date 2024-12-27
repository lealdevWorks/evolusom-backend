const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    text: { type: String, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
