const nodemailer = require('nodemailer');

const sendResetPasswordMail = async (mailTo, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const mail = {
    from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_EMAIL}`,
    to: mailTo,
    subject: subject,
    text: message
  };

  await transporter.sendMail(mail);
};

module.exports = sendResetPasswordMail;
