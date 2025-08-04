const { contactUsEmail } = require("../mail/templates/contactFormRes");
const { adminContactAlert } = require("../mail/templates/adminContactAlert");
const mailSender = require("../utils/mailSender");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;

  try {
    // Send confirmation to user
    await mailSender(
      email,
      "Thanks for contacting us - MindForge",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );

    // Send alert to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    // console.log("Sending admin email to:", adminEmail);
    await mailSender(
      adminEmail,
      `New Contact Form Query from ${firstname} ${lastname}`,
      adminContactAlert(email, firstname, lastname, message, phoneNo, countrycode)
    );

    return res.json({
      success: true,
      message: "Your message has been sent. You'll receive a confirmation email shortly.",
    });
  } catch (error) {
    console.log("Error", error);
    return res.json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
