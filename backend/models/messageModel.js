const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    itemNum: { type: Number },
    estTime: { type: String },
    content: { type: String, trim: true },
    category: { type: String },
    location: { type: String },
    status: {
      type: String,
      enum: ["standby", "live", "completed", "pending"],
      default: "pending",
    },
    notes: { type: String },
    
    
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
