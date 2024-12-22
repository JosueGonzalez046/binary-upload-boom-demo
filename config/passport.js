const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");
const passport = require("passport");
module.exports = function (passport) {
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return done(null, false, { msg: `Email ${email} not found.` });
        }

        if (!user.password) {
          return done(null, false, {
            msg:
              "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
          });
        }

        // Compare the password
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { msg: "Invalid email or password." });
        }

        return done(null, user); // Successful authentication
      } catch (err) {
        return done(err); // Handle errors
      }
    }
  )
);



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
}