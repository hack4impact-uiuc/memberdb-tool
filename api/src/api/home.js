const express = require('express');
const router = express.Router();
const { errorWrap } = require('../middleware');
const { requireRegistered } = require('../middleware/auth');

const Home = require('../models/home');

router.get(
  '/',
  errorWrap(async (req, res) => {
    const home = await Home.findOne();
    res.status(200).json({
      message: `Successfully returned home text`,
      success: true,
      result: home.text,
    });
  }),
);

router.get(
  '/registeredOnly',
  [requireRegistered],
  errorWrap(async (req, res) => {
    const home = await Home.findOne();
    res.status(200).json({
      message: `Successfully returned home text`,
      success: true,
      result: home.text,
    });
  }),
);

module.exports = router;
