const express = require('express');

const router = express.Router();
const { home, auth } = require('../api');

router.use('/api/home', home);
router.use('/api/auth', auth);

module.exports = router;
