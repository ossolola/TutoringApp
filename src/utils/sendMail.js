const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: process.env.SENDING_SERVICE,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

exports.sendEmail = async (options) => {
    try {
        return await transporter.sendMail({
            from: ` TutoringApp <${process.env.MAIL_USERNAME}>`,
            to: options.email,
            subject: options.subject,
            html: options.message
        });
    } catch (error) {
        console.log(error)
    }
};