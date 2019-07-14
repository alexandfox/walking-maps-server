const userModel     = require('../models/user-model');
const passport      = require('passport');
const InstagramStrategy = require('passport-instagram').Strategy;

const bcrypt        = require('bcryptjs');

var INSTAGRAM_CLIENT_ID = "--insert-instagram-client-id-here--"
var INSTAGRAM_CLIENT_SECRET = "--insert-instagram-client-secret-here--";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new InstagramStrategy({
    clientID: INSTAGRAM_CLIENT_ID,
    clientSecret: INSTAGRAM_CLIENT_SECRET,
    callbackURL: "/api/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    userModel.findOne({ instagramId: profile.id }, (err, user) => {
      return done(err, user);
    });
  }
));


