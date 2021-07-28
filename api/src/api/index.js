const express = require('express');
const router = express.Router();

router.use('/home', require('./home'));
router.use('/auth', require('./auth'));
router.use('/members', require('./members'));
router.use('/projects', require('./projects'));
router.use('/notes', require('./notes'));
router.use('/chapters', require('./chapters'));

module.exports = router;
