const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = async function(req, res) { //first tell async
    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts:  posts
    //     });
    // });

    // populate the user of each post
    try {
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                },
                populate: {
                    path: 'likes'
                }
            }).populate('comments')
            .populate('likes');

        let users = await User.find({}); //2nd wait for this
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
    } catch (err) {
        console.log('Error', err);
        return;
    }
    // Post.find({}).populate('user').exec(function(err, posts) {
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // })
}

// module.exports.actionName = function(req, res){}

//using then
// Post.find({}).populate('çomments').then(function());
// using promises
//let posts=Post.find({}).populate('çomments').exec();
// Post.then()