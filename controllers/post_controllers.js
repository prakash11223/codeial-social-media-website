const Post = require('../models/post');
const comment = require("../models/comment");
const Like = require('../models/like')
module.exports.create = async function(req, res) {
    // console.log(req.body)
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id

        });
        if (req.xhr) {
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }
        req.flash("success", "post is Posted");
        return res.redirect('back');
    } catch (err) {
        console.log('Error', err);
        return
    }
}

module.exports.destory = async function(req, res) {
    try {
        let post = await Post.findById(req.params.id);
        //.id means converting the object id into strong
        if (post.user == req.user.id) {
            //::delete the associated likes for posts and all its comments likes too
            //doubt
            // let comment_like = await Like.findById(post.comment);
            // console.log('commentlike', comment_like);
            // await Like.deleteMany({ likeable: post.comments._id, onModel: 'Comment' });
            await Like.deleteMany({ likeable: post._id, onModel: 'Post' }); //ye post ki likes delete kr 
            // await Like.deleteMany({ _id: { $in: post.comments } }); //post

            // console.log('commentlike after', comment_like);
            // comment_like.;
            var n = post.comments.length;
            var commentid = post.comments
            for (let i = 0; i < n; i++) {
                await Like.deleteMany({ likeable: commentid[i], onModel: 'Comment' });
            }
            post.remove();
            await comment.deleteMany({ post: req.params.id }); //
            // await Like.deleteMany({ _id: { $in: post.comments.likes } });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            req.flash("success", "post is deleted");
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error', err);
        return
    }
}