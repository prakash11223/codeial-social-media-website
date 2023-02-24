const nodeMailer = require('../config/nodemailer');

//another way to exporting the function
exports.newsign = (user) => {
    console.log('inside newcomment mailer', user);
    let htmlstring = nodeMailer.renderTempelate({ user: user }, "/signin/new_sign.ejs"); //we send data and path
    nodeMailer.transporter.sendMail({
        from: 'prakash@codeial.com',
        to: user.email,
        subject: "user sign-in",
        html: htmlstring
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mails', err);
            return;
        }
        console.log('Message sent', info);
        return;
    });
}