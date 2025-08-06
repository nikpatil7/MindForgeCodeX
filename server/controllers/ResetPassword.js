const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


//resetpassword token
exports.resetPasswordToken = async (req, res) =>  {
    try {
      //get email from request body
    // const { email } = req.body;
      const email = req.body.email;

      // Validate email input
    if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      //check if user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(401)
          .json({
            success: false,
            message: `This Email: ${email} is not Registered With Us. Enter a Valid Email `,
          });
      }

      //generate token
      const token = crypto.randomBytes(32).toString("hex");
    //   const token = crypto.randomUUID();

      //update user by adding token and expiration time
      const updatedDetails = await User.findOneAndUpdate(
        { email: email },
        {
          token: token,
          resetPasswordExpires: Date.now() + 3600000,
        },
        { new: true }
      );
      console.log("DETAILS", updatedDetails);

      //create url
      // const url = `https://localhost:3000/update-password/${token}`;
      const url = `https://${process.env.CORS_ORIGIN}/update-password/${token}`;

    //   const url = `${req.protocol}://${req.get(
    //     "host"
    //   )}/reset-password/${token}`;

      // Email content
//       const emailContent = `
//     <h2>Password Reset Request</h2>
//     <p>You requested a password reset. Click the link below to proceed:</p>
//     <a href="${url}">Reset Password</a>
//     <p>This link will expire in 1 hour.</p>
//   `;
      
  console.log('Sending to:', email); // Add this before mailSender call
      //send email containing the url
      await mailSender(
        email,
        "Password Reset",
        `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );
      //return response
      return res.json({
        success: true,
        message: 'Password reset email sent successfully',
      });
    } 
      catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Something went wrong while sending the reset email',
         error: error.message,
         });
    }
};

//resetpassword 
exports.resetPassword = async (req, res) => {
    try {
        //get token and password from request body
        const { token, password, confirmPassword} = req.body;

        if (confirmPassword !== password){
            return res.status(400).json({ success: false,message: "Password and Confirm Password Does not Match",     
            });
        }

        //get user details
        const userDetails = await User.findOne({ token:
        token });
        //if no entry - invalid token
        if (!userDetails) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        //if token is expired
        if(!(userDetails.resetPasswordExpires > Date.now()))  {
            return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
            });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //update the password
        await User.findOneAndUpdate
        ({ token: token },
            {
                password: hashedPassword,
            },
            { new: true }
        );

        //return response
        return res.json({ success: true, message: 'Password reset successfully' });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Something went wrong while resetting the password' });
    }
}
