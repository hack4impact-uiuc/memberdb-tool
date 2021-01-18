const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const Member = require('../models/member');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  // Find in DB and return user
  Member.findById(id, (err, user) => {
    if (err) {
      console.error('err');
      done(err);
    }
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_CALLBACK_URI,
    },
    async (accessToken, refreshToken, profile, cb) => {
      // find the user in the database based on their oauth id
      const user = await Member.findOne({ oauthID: profile.id });

      if (user) {
        // user exists
        cb(null, user);
      } else {
        // try to find a user with the same email
        const unlinkedUser = await Member.findOne({
          email: profile.emails[0].value,
          oauthID: null,
        });

        if (!unlinkedUser) {
          // no unlinked user with matching email found
          // don't link and reject authentication
          cb(null, false);
        } else {
          // user with matching email found
          // link user to oauthID and fill in name
          unlinkedUser.oauthID = profile.id;
          if (!unlinkedUser.firstName) {
            unlinkedUser.firstName = profile.name.givenName;
          }
          if (!unlinkedUser.lastName) {
            unlinkedUser.lastName = profile.name.familyName;
          }
          unlinkedUser.save();

          cb(null, unlinkedUser);
        }
      }
    },
  ),
);
