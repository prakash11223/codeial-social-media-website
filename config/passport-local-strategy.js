const passport = require('passport');
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy;
// authentication using Passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, function(req, email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            console.log(user);
            if (err) {
                req.flash('error', err);
                return done(err)
            }
            if (!user || user.password != password) {
                req.flash('error', 'Invalid username/password');
                return done(null, false);
            }
            return done(null, user);
        });
    }

));
//serializing the user to decide which key is to kept in the cookies
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if (err) {
            console.log('Error in finding user--> Passport');
            return done(err);
        }
        return done(null, user);
    });
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next) {
    //if the user is signed in pass request to next function(controller function)
    if (req.isAuthenticated()) {
        return next();
    }

    //if the user is not signed in
    return res.redirect('/users/sign-in');
};
passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        //req user contains the current signed in users from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user
            // res.locals.Post = req.body;
            // console.log(res.locals);
    }
    next();
};

module.exports = passport;