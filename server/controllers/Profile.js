const Profile = require("../models/Profile");
const User = require("../models/User");
// const Course = require("../models/Course");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const mongoose = require('mongoose');

exports.updateProfile = async (req, res) => { 
  try{

    //get data
    const {dateOfBirth="",about="",contactNumber,gender}= req.body;

    //get userId
    const id = req.user.id;

    //validate data
    if(!contactNumber || !gender || !id){
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //find profile
    const userDetails = await User.findById(id);

    // const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(userDetails.additionalDetails);

    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about= about;
    profileDetails.gender= gender;
    profileDetails.contactNumber = contactNumber;

     // Save the updated profile
     await profileDetails.save();
    
    //response
    return res.status(200).json({
      success: true,
      message:"Profile Updated Successfully",
      profileDetails,
    });


  }
  catch(error){
    return res.status(500).json({
      success:false,
      error:error.message,
    })
  }
}

//delete account
// explore: how can we schedule the deletion operation

exports.deleteAccount = async(req, res)=>{
  try{
    // TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
    
    //get id
     
    const id = req.user.id;
    console.log("Printing id : ", id);
     
    //validation
    const user = await User.findById({ _id: id });

    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found",

      })
    }

    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete profile
      await Profile.findByIdAndDelete(
        {_id: user.additionalDetails},
        {session}
      );



      
      // // Unenroll user from all courses
      // await Course.updateMany(
      //   {_id: {$in: userDetails.courses}},
      //   {$pull: {studentsEnrolled: id}},
      //   {session}
      // );

      // await Course.updateMany(
      //   { studentsEnrolled: id }, // Find courses where the user is enrolled
      //   { $pull: { studentsEnrolled: id } }, // Remove the user from the studentsEnrolled array
      //   { new: true } // Optional: Return the updated document
      // );




    // //delete profile

    // await Profile.findByIdAndDelete({_id: user.userDetails});

    //TODO : unenroll user form all enrolled courses

    // //delete user
    // await User.findByIdAndDelete({_id: id});

    // Delete user
    await User.findByIdAndDelete({_id: id}, {session});

    // res.status(200).json({
		// 	success: true,
		// 	message: "User deleted successfully",
		// });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();


    //return response]
    return res.status(200).json({
      success:true,
      message: "User Deleted successfully",
    });
  }
  catch (error) {
    // Rollback transaction if anything fails
    await session.abortTransaction();
    session.endSession();
    throw error;
  }


  }
  catch(error){
    console.log(error);

    return res.status(500).json({
      success:false,
      message: "User cannot be Deleted Successfully ",
      error:error.message,
    })

  }
};

exports.getAllUserDetails = async (req,res) =>{
  try{
    //get id
    const id= req.user.id;

    //validation and get user details 
    const userDetails =await User.findById(id).populate("additionalDetails").exec();
    console.log(userDetails);
    //return response

    return res.status(200).json({
      success: true,
      message: "User data fetched succesfully",
      data: userDetails,
    });

  }
  catch(error){
    return res.status(500).json({
      success:false,
      message: error.message,
    });
  }
};

//updateDisplayPicture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

// note: tried below code while testing updateprofile pic
// exports.updateDisplayPicture = async (req, res) => {
//   try {
//     // 1. Check if file exists
//     if (!req.files || !req.files.displayPicture) {
//       return res.status(400).json({
//         success: false,
//         message: "No image file provided"
//       });
//     }

//     // 2. Verify user authentication and ID
//     if (!req.user?.id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: User not authenticated"
//       });
//     }

//     // 3. Upload to Cloudinary
//     const image = await uploadImageToCloudinary(
//       req.files.displayPicture,
//       process.env.FOLDER_NAME,
//       1000,
//       1000
//     );

//     // 4. Update user profile picture
//     const updatedProfile = await User.findByIdAndUpdate(
//       req.user.id,  // Directly pass the ID string
//       { image: image.secure_url },
//       { new: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Profile picture updated successfully",
//       data: {
//         imageUrl: image.secure_url,
//         user: updatedProfile
//       }
//     });

//   } catch (error) {
//     console.error("Error updating display picture:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message.includes("Cast to ObjectId") 
//         ? "Invalid user ID format" 
//         : "Internal server error"
//     });
//   }
// };

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec()
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};