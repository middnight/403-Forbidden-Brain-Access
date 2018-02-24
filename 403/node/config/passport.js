var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var secret = require('../config/secret');
var async = require('async');
var request = require('request');
var User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new FacebookStrategy(secret.facebook, function(req, token, refreshToken, profile, done) {
  User.findOne({ facebook: profile.id }, function(err, user) {
    if (err) return done(err);

    if (user) {
      req.flash('loginMessage', 'Successfully login with facebook');
      return done(null, user);
    } else {

      async.waterfall([
        function(callback) {
          var newUser = new User();
          newUser.email = profile._json.email;
          newUser.facebook = profile.id;
          newUser.tokens.push({ kind: 'facebook', token: token });
          newUser.profile.name = profile.displayName;
          newUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

          newUser.save(function(err) {
            if (err) throw err;
            req.flash('loginMessage', 'Successfully login with facebook');
            callback(err, newUser)
          });
        },

        function(newUser, callback) {
          request({
            url: 'https://us17.api.mailchimp.com/3.0/lists/0bf00a032c/members',
            method: 'POST',
            headers: {
              'Authorization': ' randomUser f9d723169096759ffa5578fc1126d050-us17',
              'Content-Type': 'application/json'
            },
            json: {
              'email_address': newUser.email,
              'status': 'subscribed'
            }
          }, function(err, response, body) {
            if (err) {
              return done(err, newUser);
            } else {
              console.log("Success");
              return done(null, newUser);
            }
          });
        }
      ]);

    }
  });
}));
