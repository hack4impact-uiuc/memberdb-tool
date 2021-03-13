const express = require('express');
const router = express.Router();

router.use('/home', require('./home'));
router.use('/auth', require('./auth'));
router.use('/members', require('./members'));
router.use('/notes', require('./notes'));

module.exports = router;
