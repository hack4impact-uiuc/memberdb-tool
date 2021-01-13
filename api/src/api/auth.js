const express = require('express');
const router = express.Router();
const passport = require('passport');

// Defines the callback endpoint which will be passed to LAH's redirect URI
// via Google OAuth's state parameter
const CALLBACK_ENDPOINT = '/api/auth/callback';

router.get('/user', (req, res) => {
  res.json({
    result: req.user || null,
    success: true,
  });
});

router.get('/login', (req, res, next) => {
  // Get URLs to redirect to on success and failure
  const { successRedirect = '/', failureRedirect = '/login' } = req.query;
  // Construct the "callback" url by concatenating the current base URL (host) with the callback URL
  // We do all this to use one single callback URL so it works with Vercel deploying on multiple
  // domains. See LAH's api/auth/login.js for more details on how this works
  const callbackUrl = `${req.protocol}://${req.get(
    'host',
  )}${CALLBACK_ENDPOINT}`;
  // State object that will be passed to OAuth and back to our callback
  const state = {
    callbackUrl,
    successRedirect,
    failureRedirect,
  };

  const auth = passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: Buffer.from(JSON.stringify(state)).toString('base64'),
  });
  auth(req, res, next);
});

router.get('/redirectURI', (req, res) => {
  try {
    // If we are here, this endpoint is likely being run on the MAIN deployment
    const { state } = req.query;
    // Grab the branch deployment (lah-branch-deploy.hack4impact.now.sh) for example
    const { callbackUrl } = JSON.parse(Buffer.from(state, 'base64').toString());
    if (typeof callbackUrl === 'string') {
      // Reconstruct the URL and redirect
      const callbackURL = `${callbackUrl}?${req._parsedUrl.query}`;
      return res.redirect(callbackURL);
    }
    // There was no base
    return res.redirect(CALLBACK_ENDPOINT);
  } catch (e) {
    return res.status(400).json({
      message: 'Something went wrong with the URL redirection',
      success: false,
    });
  }
});

router.get(
  '/callback',
  (req, res, next) => {
    const { state } = req.query;
    const { successRedirect, failureRedirect } = JSON.parse(
      Buffer.from(state, 'base64').toString(),
    );

    const auth = passport.authenticate('google', {
      successRedirect,
      failureRedirect,
    });
    auth(req, res, next);
  },
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(LOGIN_SUCCESS_REDIRECT);
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
