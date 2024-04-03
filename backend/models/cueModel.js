const mongoose = require("mongoose");

const cueSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    sheet: { type: mongoose.Schema.Types.ObjectId, ref: "Sheet" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["standby", "live", "completed", "pending"],
      default: "pending"},
  },
  { timestamps: true }
);

const Cue = mongoose.model("Cue", cueSchema);
module.exports = Cue;
