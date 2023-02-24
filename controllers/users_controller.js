const User = require('../models/user');
const fs = require('fs');
const path = require('path');
module.exports.profile = async function(req, res) {
    // console.log(req.url)
    // res.send('<h1>user fetch</h1>');
    try {
        let user = await User.findById(req.params.id);
        console.log(user);
        return res.render('user_profile', {
            title: 'user Profile',
            profile_user: user
        });

    } catch (err) {
        console.log('Error', err);
    }
}
module.exports.update = async function(req, res) {
    try {
        if (req.user.id == req.params.id) {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err) {
                if (err) { console.log('******Multer ERROR:', err) }

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {
                    if (user.avatar) {
                        if (fs.existsSync(path.join(__dirname, '..', user.avatar))) {
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }
                    }


                    //this is saving the path of the upload file into the avatar field in the user 
                    user.avatar = User.avatarPath + "/" + req.file.filename;
                    req.flash("success", "updated");
                }
                user.save();

                return res.redirect('back');
            });

        } else {
            req.flash("error", "Unauthorized");
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.log('Error', err);
    }
}

console.log('user controller');

//render the singin page
module.exports.signIn = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Codeial | SignIn"
    })
}

//render the singup page
module.exports.signUp = function(req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_Up', {
        title: "Codeial | SignUp"
    })
}

//getting the sig up data
module.exports.create = async function(req, res) {
        try {
            if (req.body.password != req.body.confirm_password) {
                // return res.send(alert('write same password in confirm password'));
                req.flash('error', 'write same password in confirm password')
                return res.redirect('back');
            }

            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                await User.create(req.body);
                req.flash('success', 'signup successfully')
                return res.redirect('/users/sign-in')
            } else {
                return res.redirect('back');
            }
        } catch (err) {
            console.log('Error', err);
        }
    }
    //sig in session
module.exports.createSession = function(req, res) {
    req.flash('success', 'logged in successfully');
    return res.redirect('/');
}
module.exports.destroySession = function(req, res) {
    req.logout();
    req.flash('success', 'You have logged out');


    return res.redirect('/');
}