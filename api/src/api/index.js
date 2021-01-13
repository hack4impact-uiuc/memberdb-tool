const express = require("express");
const router = express.Router();

router.use("/home", require('./home'));
router.use("/members", require('./members'));

module.exports = router;