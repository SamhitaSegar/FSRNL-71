import transporter from "../config/nodemailer.config.js";

/**
 *
 */

const sendMail = async (to, sub, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    sub,
    html,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};

export default sendMail;
