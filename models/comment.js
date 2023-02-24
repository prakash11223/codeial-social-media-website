const mongoose = require('mongoose');

const commentScheme = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    //comment belongs to a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }]
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentScheme);
module.exports = Comment;