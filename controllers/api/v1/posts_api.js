const Post = require('../../../models/post');
const comment = require('../../../models/comment');

module.exports.index = async function(req, res) {
    let posts = await Post.find({}) //1st wait for this
        .sort("-createdAt")
        .populate('user')
        .populate({
            path: "comments",
            populate: {
                path: "user"
            }
        });
    return res.json(200, {
        message: "List of posts",
        post: posts
    })
}

module.exports.destory = async function(req, res) {
    try {
        let post = await Post.findById(req.params.id);
        //.id means converting the object id into strong
        if (post.user == req.user.id) {
            post.remove();
            await comment.deleteMany({ post: req.params.id });

            return res.json(200, {
                message: "Post and associated comments deleted successfully"
            });
        } else {
            return res.json(401, {
                message: 'you can not delete the post'
            });
        }
    } catch (err) {
        console.log('Error', err);
        return res.json(500, {
            message: "Internal server error"
        });
    }
}