const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/user', (req, res) => {
  res.json({
    result: req.user || null,
    success: true,
  });
});

router.get(
  '/login',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  },
);

router.post('/logout', (req, res) => {
  req.logout();
  res.json({
    message: 'Logged out',
    success: true,
  });
});

module.exports = router;
