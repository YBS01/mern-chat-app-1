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
  const { chatId, itemNum, estTime, content, category, location, notes } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    itemNum: itemNum,
    estTime: estTime,
    category: category,
    location: location,
    notes: notes,
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

  if (io) {
      // Emit the socket event to notify other clients about the status change
      io.emit("cue status update", { messageId, status });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const updateItemNum = asyncHandler(async (req, res, io) => {
  const { itemNum } = req.params;
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Update the itemNum
    message.itemNum = itemNum; // Update with your specific logic

    // Save the updated message
    await message.save();

    // Check if io is defined before using it
    if (io) {
      // Emit the socket event to notify other clients about the itemNum change
      io.emit("itemNum update", { messageId, itemNum });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateEstTime = asyncHandler(async (req, res, io) => {
  const { estTime } = req.params;
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Update the estimated time
    message.estTime = estTime; // Update with your specific logic

    // Save the updated message
    await message.save();

    // Check if io is defined before using it
    if (io) {
      // Emit the socket event to notify other clients about the estimated time change
      io.emit("estTime update", { messageId, estTime });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const updateContent = asyncHandler(async (req, res, io) => {
  const { content } = req.params;
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Update the content
    message.content = content; // Update with your specific logic

    // Save the updated message
    await message.save();

    // Check if io is defined before using it
    if (io) {
      // Emit the socket event to notify other clients about the content change
      io.emit("content update", { messageId, content });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const updateCategory = asyncHandler(async (req, res, io) => {
  const { category } = req.params;
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Update the category
    message.category = category; // Update with your specific logic

    // Save the updated message
    await message.save();

    // Check if io is defined before using it
    if (io) {
      // Emit the socket event to notify other clients about the category change
      io.emit("category update", { messageId, category });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



const updateLocation = asyncHandler(async (req, res, io) => {
  const { location } = req.params;
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Update the location
    message.location = location; // Update with your specific logic

    // Save the updated message
    await message.save();

    // Check if io is defined before using it
    if (io) {
      // Emit the socket event to notify other clients about the location change
      io.emit("location update", { messageId, location });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



const updateNotes = asyncHandler(async (req, res, io) => {
  const { notes } = req.params;
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Update the notes
    message.notes = notes; // Update with your specific logic

    // Save the updated message
    await message.save();

    // Check if io is defined before using it
    if (io) {
      // Emit the socket event to notify other clients about the notes change
      io.emit("notes update", { messageId, notes });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const getMessageStatus = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  // Find the message by ID
  const message = await Message.findById(messageId);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  // Return the status of the message
  res.json({ status: message.status });
});



module.exports = { allMessages, sendMessage, updateMessageStatus, updateItemNum, updateEstTime, updateContent, updateCategory, updateLocation, updateNotes, getMessageStatus };
