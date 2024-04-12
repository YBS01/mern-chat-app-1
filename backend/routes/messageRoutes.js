const express = require("express");
const {
  allMessages,
  sendMessage,
  updateMessageStatus,
  updateItemNum,
  updateEstTime,
  updateContent,
  updateCategory,
  updateLocation,
  updateNotes,
  getMessageStatus
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route for retrieving all messages in a chat
router.route("/:chatId").get(protect, allMessages);

// Route for sending a new message
router.route("/").post(protect, sendMessage);

// Route for updating message status
router.route("/:messageId/status/:status").put(protect, (req, res) => {
  updateMessageStatus(req, res, req.app.get("io"));
});

// Routes for updating itemNum, estTime, content, category, location, notes
router.route("/:messageId/itemNum/:itemNum").put(protect, (req, res) => {
  updateItemNum(req, res, req.app.get("io"));
});

router.route("/:messageId/estTime/:estTime").put(protect, (req, res) => {
  updateEstTime(req, res, req.app.get("io"));
});

router.route("/:messageId/content/:content").put(protect, (req, res) => {
  updateContent(req, res, req.app.get("io"));
});

router.route("/:messageId/category/:category").put(protect, (req, res) => {
  updateCategory(req, res, req.app.get("io"));
});

router.route("/:messageId/location/:location").put(protect, (req, res) => {
  updateLocation(req, res, req.app.get("io"));
});

router.route("/:messageId/notes/:notes").put(protect, (req, res) => {
  updateNotes(req, res, req.app.get("io"));
});


router.route("/:messageId/status").get(protect, getMessageStatus)

module.exports = router;
