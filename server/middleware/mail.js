const mailer = require("nodemailer");


const port = process.env.PORT || 3000;

/**
 * @description : Send a mail to user
 * @param {token} : token which will help user to reset password
 * @param {callback} : Callback function to reset password
 */
exports.sendMail = (token, body, callback) => {
    var transporter = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        tls: { rejectUnauthorized: false }
    });

    let mailOptions = {
        from: process.env.USERMAIL,
        to: body.email,
        subject: 'testing node-mailer',
        text: "http://localhost:" + port + "/resetPassword/" + token
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (!err) {
            callback(null, data);
        } else {
            callback(err);
        }
    });
}