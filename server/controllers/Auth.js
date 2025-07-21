const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");

require("dotenv").config();

//signup
exports.signup = async (req, res) => {
  try {
    //Destructure fields from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate the data
    if (
      !firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword ||
			!otp
    ) {
      return res
        .status(403)
        .json({ success: false, message: "All fields are required" });
    }

    // 2 password match karlo
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false,message:
					"Password and Confirm Password do not match. Please try again.",});
    }

    //check user already exists or not
    const existingUser = await User.findOne({
      email: email,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists", });
    }

    //find most recent otp
    const recentOTP = await OTP.find({ email})
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("recentOTP: ", recentOTP);

    //check if otp is valid or not
    if (!recentOTP || recentOTP.length === 0) {
      // OTP not found for the email
      return res.status(400).json({ success: false, message: "OTP not found" });
    } 
    else if ( otp !== recentOTP[0].otp) {
      // Invalid otp
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
		// Set approval status
    const approved = accountType === "Instructor" ? false : true;

    //create a new user in the database
    const ProfileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetails: ProfileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

     // Remove sensitive data before response
    newUser.password = undefined;

    //return response
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
     console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
       message: "User registration failed",
      error: error.message
    });
  }
};

// Login controller for authenticating users
exports.login = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;

    //validation of data
    if (!email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Please Fill up All the Required Fields`,
        });
    }
    //check if user exists or not
    const user = await User.findOne({ email: email }).populate(
      "additionalDetails"
    ).exec();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered, Please signup",
      });
    }

    //generate JWT token , after password match
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        user: {
          id: user._id,
          email: user.email,
          accountType: user.accountType,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Save token to user document in database
      user.token = token;
      user.password = undefined;

      //create a cookie and send response
      const Options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, Options).status(200).json({
				success: true,
				token,
				user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType,
      image: user.image,
      additionalDetails: user.additionalDetails,
				
			},
      message: `User Logged In Successfully`
    });
      
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Login Failure Please Try Again",
    });
  }

  
};

//send otp
exports.sendOTP = async (req, res) => {
  try {
    // fecth email from request body
    const { email } = req.body;

    //check if user exists
    const checkUserPresent = await User.findOne({ email });

    //if user already exists
    if (checkUserPresent) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }
    //generate otp

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated: ", otp);

    //check unique otp or not
    const result = await OTP.findOne({ otp: otp });
    console.log("Result", result);

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      
    }

    const otpPayload = {
      email,
      otp,
    };

    //create an entry for otp in the database
    const otpBody = await OTP.create(otpPayload);
    console.log("otpBody: ", otpBody);

    //send otp to the user
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: otp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword } = req.body;

    // validate data
        if(!oldPassword || !newPassword ){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		// if (newPassword !== confirmPassword) {
		// 	return res.status(400).json({
		// 		success: false,
		// 		message: "The password and confirm password does not match",
		// 	});
		// }

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
        "Password for your account has been updated",
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};

