const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const SignMailer = require('../mailer/sign_in_mailer');
const env = require('./enviroment')

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_Secret,
        callbackURL: env.google_callback_URL,
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }).exec(function(err, user) {
            
            if (err) { console.log('error in google strategy-passport', err); return; }
            // console.log(profile);
            if (user) {
                
                let myPromise = new Promise(function(myResolve, myReject) {
                    try {SignMailer.newsign(user);
                        myResolve("success")
                    }catch(e){
                        myReject('error')
                        console.log('err',e);
                        
                    }
                    
                        // when error
                    });
                    myPromise.then(function(msg){
                        console.log(msg)
                    }).catch(function(msg){
                        console.log(msg)})
                // if found,set this user as req.user
                return done(null, user);
            } else {
                //if not found create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    photo: profile.photos[0].value
                }, function(err, user) {
                    if (err) { console.log('error in creating user google strategy-passport', err); return; }
                    console.log("********** User with photo **********", user);
                    return done(null, user);
                })
            }
        })
    }

))