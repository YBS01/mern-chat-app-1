const express = require("express");
const {
  allMessages,
  sendMessage,
  updateMessageStatus,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
// router.route("/:messageId/status/:status").put(protect, updateMessageStatus);
router.route("/:messageId/status/:status").put((req, res, io) => {
  updateMessageStatus(req, res, io);
})
// router.route("/:messageId/status").put(protect, updateMessageStatus);
// router.route("/:messageId/status/:status/:token").put(protect, updateMessageStatus);


module.exports = router;
