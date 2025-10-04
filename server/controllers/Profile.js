const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require('../models/CourseProgress');
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const {convertSecondsToDuration} = require("../utils/secToDuration");
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
    
    console.log("User details:", userDetails)
    console.log("User courses:", userDetails?.courses)

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      })
    }

    // Calculate duration and progress for each course
    const coursesWithDurationAndProgress = await Promise.all(
      userDetails.courses.map(async (course) => {
        try {
          // Calculate total duration
          let totalDurationInSeconds = 0
          if (course.courseContent && Array.isArray(course.courseContent)) {
            course.courseContent.forEach((content) => {
              if (content.subSection && Array.isArray(content.subSection)) {
                content.subSection.forEach((subSection) => {
                  const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0
                  totalDurationInSeconds += timeDurationInSeconds
                })
              }
            })
          }
          const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

          // Get course progress
          const courseProgress = await CourseProgress.findOne({
            courseId: course._id,
            userId: userId,
          })

          // Calculate progress percentage
          let progressPercentage = 0
          if (courseProgress && courseProgress.completedVideos) {
            const totalVideos = course.courseContent.reduce((total, section) => {
              return total + (section.subSection ? section.subSection.length : 0)
            }, 0)
            progressPercentage = totalVideos > 0 ? Math.round((courseProgress.completedVideos.length / totalVideos) * 100) : 0
          }

          return {
            ...course.toObject(),
            totalDuration,
            progressPercentage,
          }
        } catch (error) {
          console.error(`Error processing course ${course._id}:`, error)
          return {
            ...course.toObject(),
            totalDuration: "N/A",
            progressPercentage: 0,
          }
        }
      })
    )

    return res.status(200).json({
      success: true,
      data: coursesWithDurationAndProgress,
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