const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Function to create a new course
exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;
    //fetch data
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      Price,
      tag,
      category,
      //status,
      instructions,
    } = req.body;

    // const instructions = JSON.parse(req.body.instructions); // If instructions are sent as a stringified JSON

    let status = req.body.status; //as we are assigning status each time do not keep it const 

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validate data
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !Price ||
      !tag ||
      !thumbnail ||
      !category
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }

    //check instructor

    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });
    console.log(instructorDetails);

    //TODO: verify that userId and InstructorDetails._id are same or different

    if (!instructorDetails) {
      return res
        .status(400)
        .json({ success: false, message:"Only instructors can create courses" });
    }

    // //check given tag is valid or not
    // const tagDetails = await Tag.findById(tag);
    // console.log(tagDetails);

    // if (!tagDetails) {
    //   return res.status(404).json({ success: false, message: "Tag not found" });
    // }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
     console.log(categoryDetails);

    //upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    // console.log(thumbnailImage);

    //create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      Price,
      // tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
      tag: tag,
      category: categoryDetails._id,
      status: status,
      instructions: instructions,
    });

    //update instructor details , add new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // update the tag schema, add new course to the tag schema
    // await Tag.findByIdAndUpdate(
    //   { _id: tagDetails._id },
    //   { $push: { courses: newCourse._id } },
    //   { new: true }
    // );

    // Add the new course to the Categories
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          Course: newCourse._id,
        },
      },
      { new: true }
    );

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message.includes("duplicate key") 
        ? "Course with this name already exists" 
        : "Failed to create course",

      error: error.message,
    });
  }
};

// get all courses

exports.getAllCourses = async (req, res) => {
  try {
    //TODO: change below statement incrementally
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        Price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReview: true,
        studentsEnrolled: true,
        courseDescription: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
      message: "All courses fetched",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch course data",
      error: error.message,
    });
  }
};

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
    //get id
    const { courseId } = req.body;
    
    //find course details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

      //validation
      if(!courseDetails) {
        return res.status(400).json({
            success:false,
            message:`Could not find the course with ${courseId}`,
        });
    }

    // was passed as a stringified JSON array (JSON.stringify([...])) instead of a proper array.
     // Parse instructions if stored as a stringified JSON
     if (typeof courseDetails.instructions === "string") {
      courseDetails.instructions = JSON.parse(courseDetails.instructions);
    }

    //return response
    return res.status(200).json({
        success:true,
        message:"Course Details fetched successfully",
        data:courseDetails,
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message,
    });
  }
};
