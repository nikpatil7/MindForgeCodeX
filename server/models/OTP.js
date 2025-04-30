const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires:  60 * 5,
    required: true,
  },
});

//a function to send emails
async function sendVerificationEmail(email, otp) {
  try{
    const mailResponse = await mailSender(email, "Verification email from MindForge",emailTemplate(otp)
  );
    console.log("Email sent successfully", mailResponse.response);
  }
  catch(error){
    console.log("Error in sending email", error);
    throw error;
  }
}

// pre save hook to send email with OTP (middleware) 
// OTPSchema.pre('save', async function(next) {
//   try{
//     await sendVerificationEmail(this.email, this.otp);
//     next();
//   }
//   catch(error){
//     next(error);
//   }
// });

OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

module.exports = mongoose.model('OTP', OTPSchema);
