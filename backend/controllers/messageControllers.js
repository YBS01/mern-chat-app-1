const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");



//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Update Message Status
//@route           PUT /api/Message/:messageId/status/:status
//@access          Protected
const updateMessageStatus = asyncHandler(async (req, res, io) => {
  const { status } = req.params;
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Update the message status
    message.status = status; // Update with your specific logic

    // Save the updated message
    await message.save();

    // Emit the socket event to notify other clients about the status change
    // io.emit("cue status update", { messageId, status });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = { allMessages, sendMessage, updateMessageStatus };
