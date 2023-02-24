const nodeMailer = require('../config/nodemailer');

//another way to exporting the function
exports.newcomment = (comment) => {
    // console.log('inside newcomment mailer', comment);
    let htmlstring = nodeMailer.renderTempelate({ comment: comment }, "/comments/new_comment.ejs"); //we send data and path
    nodeMailer.transporter.sendMail({
        from: 'prakash@codeial.com',
        to: comment.user.email,
        subject: "New comment Published",
        html: htmlstring
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mails', err);
            return;
        }
        // console.log('Message sent', info);
        return;
    });
}