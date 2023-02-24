const Comment = require('../models/comment');
const Post = require('../models/post');
const CommentsMailer = require('../mailer/Comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            await post.comments.push(comment);
            await post.save();
            // Similar for comments to fetch the user's id!
            comment = await comment.populate('user', 'name email').execPopulate();
            console.log("comment******", comment);
            // CommentsMailer.newcomment(comment);
            // let job = queueMicrotask.create('emails', comment).save(function(err) {
            //     if (err) {
            //         console.log('err in creating a queue');
            //     }

            //     console.log(job.id)
            // });not worked
            let job = queue.create('emails', comment).save(function(err) {
                if (err) {
                    console.log('err in creating a queue');
                }

                console.log("job eneque", job.id)
            });
            if (req.xhr) {


                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }

            res.redirect('/');

        }

    } catch (err) {
        console.log('Error', err);
    }

}

module.exports.destroy = async function(req, res) {
    try {
        let comment = await Comment.findById(req.params.id);
        console.log("inside comment", comment);
        let postId = await comment.post;
        // console.log(postId)
        let post = await Post.findById(postId);
        if (comment.user == req.user.id || post.user == req.user.id) {
            comment.remove();
            let post = await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

            //::destroy the associated likes for this comment
            await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });
            // send the comment id which was deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }
            req.flash("success", "comment is deleted");
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error', err);
        return
    }

}