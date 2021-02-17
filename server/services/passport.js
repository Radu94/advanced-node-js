const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var GoogleStrategyMock = require('passport-mock-googleoauth2');
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('User');

let AppropriateStrategy;
let options;
let verifyCallback;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("The id is:", id);
  User.findById(id).then(user => {
    done(null, user);
  });
});


if (process.env.NODE_ENV !== 'test') {
  console.log("ENTERED");
  AppropriateStrategy = new GoogleStrategy(
    {
      callbackURL: '/auth/google/callback',
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = await new User({
          googleId: profile.id,
          displayName: profile.displayName
        }).save();
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
  verifyCallback = (user, done) => {
    return done(null, user);
  };
  passport.use('google', AppropriateStrategy);
}
else {
  console.log("test strategy")
  AppropriateStrategy = GoogleStrategyMock;
  options = {
    id: "601d28388b04a7e977faaafe",
    displayName: "TEST_DISPLAYNAME",
  };
  verifyCallback = (user, done) => {
    return done(null, user);
  };
  passport.use('google', new AppropriateStrategy(options, verifyCallback));
}

// passport.use(
//   new GoogleStrategy(
//     {
//       callbackURL: '/auth/google/callback',
//       clientID: keys.googleClientID,
//       clientSecret: keys.googleClientSecret,
//       proxy: true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ googleId: profile.id });
//         if (existingUser) {
//           return done(null, existingUser);
//         }
//         const user = await new User({
//           googleId: profile.id,
//           displayName: profile.displayName
//         }).save();
//         done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );
