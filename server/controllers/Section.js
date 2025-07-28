const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require("../models/Subsection")

exports.createSection = async (req, res) => {
  try {
    // Data fetch with destructuring
    const { sectionName, courseId } = req.body;

    // Data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: sectionName and courseId"
      });
    }

    // Create section
    const newSection = await Section.create({
      sectionName,
      courseId
    });

    // Update course with section ObjectId and populate all necessary data
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: newSection._id }
      },
      { new: true }
    )
    .populate({
      path: "courseContent",
      populate: [{
        path: "subSection",
        
      }]
    })
    .populate("instructor")
    .populate("category")
    .exec();

    if (!updatedCourseDetails) {
      throw new Error("Failed to update course with new section");
    }

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: updatedCourseDetails
    });

  } catch (error) {
    // Enhanced error logging
    console.error("Error in createSection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create section",
      error: error.message
    });
  }
}

exports.updateSection = async (req, res) => {
  try{
    //fetch data
     const { sectionName, sectionId, courseId } = req.body;

    console.log(sectionName," ", sectionId);

    //validate data
    if(!sectionName || !sectionId){
      return res.status(400).json({success:false, message:"Please provide all the details"});
    }

    //update section
    await Section.findByIdAndUpdate(sectionId, {
      sectionName
    }, {new:true});

    // Fetch updated course
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection"
        }
      })
      .exec();

      console.log(updatedCourse)

    //response
     return res.status(200).json({
      success: true,
      message: "Section updated",
      data: updatedCourse
    });
  }
  catch(error){
    console.error("Error updating section:", error);
    res.status(500).json({success:false,
      message:"Unable to update Section", error:error.message});
  }
};

//delete section

// DELETE a section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    // Remove section from the course
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });

    // Find the section
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Delete associated subsections
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    // Delete the section itself
    await Section.findByIdAndDelete(sectionId);

    // Return the updated course
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


//new code
// const Section = require("../models/Section");
// const Course = require("../models/Course");
// const SubSection = require("../models/SubSection");

// // Create a new section
// exports.createSection = async (req, res) => {
//   try {
//     const { sectionName, courseId } = req.body;

//     if (!sectionName || !courseId) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required properties",
//       });
//     }

//     const newSection = await Section.create({ sectionName });

//     const updatedCourse = await Course.findByIdAndUpdate(
//       courseId,
//       {
//         $push: { courseContent: newSection._id },
//       },
//       { new: true }
//     )
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec();

//     return res.status(201).json({
//       success: true,
//       message: "Section created successfully",
//       updatedCourse,
//     });
//   } catch (error) {
//     console.error("Error creating section:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// // Update a section
// exports.updateSection = async (req, res) => {
//   try {
//     const { sectionName, sectionId, courseId } = req.body;

//     if (!sectionName || !sectionId || !courseId) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     const updatedSection = await Section.findByIdAndUpdate(
//       sectionId,
//       { sectionName },
//       { new: true }
//     );

//     const course = await Course.findById(courseId)
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec();

//     return res.status(200).json({
//       success: true,
//       message: "Section updated successfully",
//       updatedSection,
//       course,
//     });
//   } catch (error) {
//     console.error("Error updating section:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// // Delete a section
// exports.deleteSection = async (req, res) => {
//   try {
//     const { sectionId, courseId } = req.body;

//     if (!sectionId || !courseId) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     const section = await Section.findById(sectionId);
//     if (!section) {
//       return res.status(404).json({
//         success: false,
//         message: "Section not found",
//       });
//     }

//     // Delete all subSections of the section
//     await SubSection.deleteMany({ _id: { $in: section.subSection } });

//     // Delete the section
//     await Section.findByIdAndDelete(sectionId);

//     // Remove section from the course
//     const course = await Course.findByIdAndUpdate(
//       courseId,
//       { $pull: { courseContent: sectionId } },
//       { new: true }
//     )
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec();

//     return res.status(200).json({
//       success: true,
//       message: "Section deleted successfully",
//       course,
//     });
//   } catch (error) {
//     console.error("Error deleting section:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

