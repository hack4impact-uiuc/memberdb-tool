const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const Member = require('../models/member');

// Defines the default level a user gets assigned with upon first sign-in
const DEFAULT_LEVEL = process.env.DEFAULT_LEVEL || Member.levelEnum.TBD;

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
        return cb(null, user);
      } else {
        const newUser = await new Member({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          oauthID: profile.id,
          email: profile.emails[0].value,
          level: DEFAULT_LEVEL,
        }).save();

        cb(null, newUser);
      }
    },
  ),
);
