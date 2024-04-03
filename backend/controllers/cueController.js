const asyncHandler = require("express-async-handler");
const Cue = require("../models/cueModel");
const User = require("../models/userModel");
const Sheet = require("../models/sheetModel");

//@description     Get all Cues
//@route           GET /api/Cue/:chatId
//@access          Protected
const allCues = asyncHandler(async (req, res) => {
  try {
    const cues = await Cue.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(cues);
  } catch (error) {
    res.status(400);
    throw new Error(error.cue);
  }
});

//@description     Create New Cue
//@route           POST /api/Cue/
//@access          Protected
const sendCue = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newCue = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var cue = await Cue.create(newCue);

    cue = await cue.populate("sender", "name pic").execPopulate();
    cue = await cue.populate("chat").execPopulate();
    cue = await User.populate(cue, {
      path: "chat.users",
      select: "name pic email",
    });

    await Sheet.findByIdAndUpdate(req.body.chatId, { latestCue: cue });

    res.json(cue);
  } catch (error) {
    res.status(400);
    throw new Error(error.cue);
  }
});

module.exports = { allCues, sendCue };
