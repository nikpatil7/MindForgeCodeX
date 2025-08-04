const nodeMailer = require('nodemailer');
// const { toast } = require('react-hot-toast');


const mailSender = async (email, title, body) => {
  try{

    // if (!email) {
    //   toast.error("❌ No recipient email provided!");
    //   throw new Error("Recipient email is missing.");
    // }

    let transporter = nodeMailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    })

    let info = await transporter.sendMail({
      from:`"MindForge" <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    })
    console.log(info);
    return info;
  }
  catch(error){
     console.log("Error in sending email", error);
    throw error;
  }
};

module.exports = mailSender;