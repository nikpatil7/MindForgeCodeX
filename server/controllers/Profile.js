const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
// const CourseProgress = require('../models/CourseProgress');
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const mongoose = require('mongoose');

exports.updateProfile = async (req, res) => { 
  try{

    //get data
    const {dateOfBirth="",about="",contactNumber, gender, firstName, lastName}= req.body;

    //get userId
    const id = req.user.id;

    //validate data
    if(!contactNumber || !gender || !id ||  !firstName || !lastName){
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //   // Update User model for names
    // await User.findByIdAndUpdate(id, { firstName, lastName });

    // //find profile
    // const userDetails = await User.findById(id);

    // // const profileId = userDetails.additionalDetails;
    // const profileDetails = await Profile.findById(userDetails.additionalDetails);

    // //update profile
    // profileDetails.dateOfBirth = dateOfBirth;
    // profileDetails.about= about;
    // profileDetails.gender= gender;
    // profileDetails.contactNumber = contactNumber;

    //  // Save the updated profile
    //  await profileDetails.save();

    //   // Fetch updated user with names for response
    // const updatedUser = await User.findById(id).populate("additionalDetails");
    
    // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        // const profileDetails = await Profile.findById(profileId);

        const user = await Profile.findByIdAndUpdate(profileId, {
            dateOfBirth,
            gender,
            about,
            contactNumber
          },{new: true})
          // await user.save()

          // Find the updated user details
        const updatedUserDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()

         console.log("Updated User Details:", updatedUserDetails);

    //response
    return res.status(200).json({
      success: true,
      message:"Profile Updated Successfully",
       profileDetails: updatedUserDetails,
    });


  }
  catch(error){
    return res.status(500).json({
      success:false,
       message: "Error updating profile",
      error:error.message,
    })
  }
}

// delete account
// explore: how can we schedule the deletion operation

// exports.deleteAccount = async(req, res)=>{
//   try{
//     // TODO: Find More on Job Schedule
// 		// const job = schedule.scheduleJob("10 * * * * *", function () {
// 		// 	console.log("The answer to life, the universe, and everything!");
// 		// });
// 		// console.log(job);
    
//     //get id
     
//     const id = req.user.id;
//     console.log("Printing id : ", id);
     
//     //validation
//     const user = await User.findById({ _id: id });

//     if(!user){
//       return res.status(404).json({
//         success: false,
//         message: "User not found",

//       })
//     }

//     // Start a transaction
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Delete profile
//       await Profile.findByIdAndDelete(
//         {_id: user.additionalDetails},
//         {session}
//       );



      
//       // // Unenroll user from all courses
//       // await Course.updateMany(
//       //   {_id: {$in: userDetails.courses}},
//       //   {$pull: {studentsEnrolled: id}},
//       //   {session}
//       // );

//       // await Course.updateMany(
//       //   { studentsEnrolled: id }, // Find courses where the user is enrolled
//       //   { $pull: { studentsEnrolled: id } }, // Remove the user from the studentsEnrolled array
//       //   { new: true } // Optional: Return the updated document
//       // );




//     // //delete profile

//     // await Profile.findByIdAndDelete({_id: user.userDetails});

//     //TODO : unenroll user form all enrolled courses

//     // //delete user
//     // await User.findByIdAndDelete({_id: id});

//     // Delete user
//     await User.findByIdAndDelete({_id: id}, {session});

//     // res.status(200).json({
// 		// 	success: true,
// 		// 	message: "User deleted successfully",
// 		// });

//     // Commit transaction
//     await session.commitTransaction();
//     session.endSession();


//     //return response]
//     return res.status(200).json({
//       success:true,
//       message: "User Deleted successfully",
//     });
//   }
//   catch (error) {
//     // Rollback transaction if anything fails
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }


//   }
//   catch(error){
//     console.log(error);

//     return res.status(500).json({
//       success:false,
//       message: "User cannot be Deleted Successfully ",
//       error:error.message,
//     })

//   }
// };



// exports.deleteProfile = async (req, res) => {
//     try{
//         // get user id
//         const id = req.user.id;
//         const userDetails = await User.findById({_id: id})
//         .populate({
//           path: "courses",
//           populate:{
//             path: "instructor",
//             path: "category",
//           },
//         }).exec()
        
//         // validate
//         if(!userDetails){
//           console.log("UserDetails: ", userDetails)
//             return res.status(400).json({
//                 success: false,
//                 message: 'All fields are required'
//             })
//         }

//       console.log(userDetails)

//         //delete profile
//         const deletedProfile = await Profile.findByIdAndDelete({_id: new mongoose.Types.ObjectId(userDetails.additionalDetails)});

//         // TODO HW: unenroll student from all enrolled courses
//         for (const courseId of userDetails.courses) {
//             await Course.findByIdAndUpdate(
//               courseId,
//               { $pull: { studentsEnrolled: id } },
//               { new: true }
//             )
//         }

//         // delete user
//         const deletedUser = await User.findByIdAndDelete({_id: id});

//         // return response
//         return res.status(200).json({
//             success: true,
//             message: 'Account deleted successfully',
//             deletedProfile,
//             deletedUser
//         })

//     }catch(error){
//       console.error(error)
//         return res.status(500).json({
//             success: false,
//             message: 'Something went wrong cannot delete account'
//         })
//     }
// }



exports.deleteAccount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;

    // Fetch the user with related course and profile data
    const user = await User.findById(userId)
      .populate({
        path: "courses",
        populate: { path: "instructor category" },
      })
      .session(session); // Use the session

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Unenroll user from all enrolled courses
    if (user.courses && user.courses.length > 0) {
      await Course.updateMany(
        { _id: { $in: user.courses.map(course => course._id) } },
        { $pull: { studentsEnrolled: userId } },
        { session }
      );
    }

    // Delete associated profile if exists
    if (user.additionalDetails) {
      await Profile.findByIdAndDelete(user.additionalDetails, { session });
    }

    // Delete the user
    await User.findByIdAndDelete(userId, { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    // Rollback transaction on failure
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting account:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};



exports.getAllUserDetails = async (req,res) =>{
  try{
    //get id
    const id= req.user.id;

    //validation and get user details 
    const userDetails =await User.findById(id).populate("additionalDetails").exec();

     // validate
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: 'Cannot get userDetails'
            })
        }

    console.log("User all info: ", userDetails);
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
    console.log("Getting enrolled courses for user:", userId)
    
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
            path: "courses",
            populate: {
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            },
          })
          .exec()
      // .populate("courses")
      // .exec()
    
    console.log("User details:", userDetails)
    console.log("User courses:", userDetails?.courses)
    
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    console.log("Error in getEnrolledCourses:", error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

// instructor dashboard
exports.instructorDashboard = async (req, res) => {
    try {
      // const courseDetails = await Course.find({ instructor: req.existingUser.id })
      const courseDetails = await Course.find({ instructor: req.user.id })

  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }