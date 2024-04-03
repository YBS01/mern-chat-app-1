const express = require("express");
const {
  allCues,
  sendCue,
} = require("../controllers/cueController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allCues);
router.route("/").post(protect, sendCue);

module.exports = router;
