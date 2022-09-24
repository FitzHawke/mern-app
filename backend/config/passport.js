const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

let options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function (email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, { message: `Email ${email} not found.` });
        }

        bcrypt.compare(password, user.password, function (err, result) {
          if (!result) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });
      });
    }
  )
);

passport.use(
  new JwtStrategy(options, function (jwtPayload, done) {
    User.findById(jwtPayload.id, function (err, user) {
      if (err) {
        return done(err, false);
      }

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    });
  })
);
