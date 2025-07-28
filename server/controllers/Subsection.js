// const SubSection = require('../models/SubSection');
// const Section = require('../models/Section');
// // const { uploadImageToCloudinary } = require("../utils/imageUploader");
// const { uploadVideoToCloudinary } = require("../utils/imageUploader");


// //create sub section

// exports.createSubSection = async (req, res) => {
//   try{

//     //data fetch from request body
//     const {sectionId, title, timeDuration, description} = req.body;

//     //extract file/video
//     const video = req.files?.videoFile;

//     //validate data
//     if(!sectionId || !title || !timeDuration || !description || !video){
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields"
//       });
//     }

//     //upload file/video to cloudinary
//     // const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
//     const uploadDetails = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);

//     if (!uploadDetails) {
//       throw new Error("Failed to upload video");
//     }

//     // Create subsection
//     const SubSectionDetails = await SubSection.create({
//       title,
//       timeDuration,
//       description,
//       videoUrl: uploadDetails.secure_url
//     });


//     // Update section with populated data
//     const updatedSectionDetails = await Section.findByIdAndUpdate(
//       { _id: sectionId },
//       {
//         $push: { subSection: SubSectionDetails._id }
//       },
//       { new: true }
//     )
//     .populate({
//       path: "subSection",
//       select: "title description timeDuration videoUrl"
//     })
//     .exec();

//     //todo : use populate to replace sections/subsections both in updatedSectionDetails

//      if (!updatedSectionDetails) {
//       throw new Error("Failed to update section with subsection");
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Subsection created successfully",
//       data: updatedSectionDetails
//     });
//   }
//   catch(error){
//     console.error("Error creating new sub-section:", error);
//     return res.status(500).json({success:false,
//       message:"Unable to create SubSection", error:error.message});
//   }

// }

// //TODO: update sub section with populate and also delete sub section

// //update sub section
// exports.updateSubSection = async (req, res) => {
//   try{
//     //fetch data
//     const {title, timeDuration, description, subSectionId} = req.body;

//     //validate data
//     if(!title || !timeDuration || !description || !subSectionId){
//       return res.status(400).json({success:false, message:"Please provide all the details"});
//     }

//     //update sub section
//     const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId, {
//       title,
//       timeDuration,
//       description
//     }, {new:true});

//     //response
//     return res.status(200).json({success:true, message:"SubSection updated", data:updatedSubSection});
//   }
//   catch(error){
//     console.log(error);
//     res.status(500).json({success:false, message:"Unable to update SubSection", error:error.message});
//   }
// }

// //TODO : delete sub section
// exports.deleteSubSection = async (req, res) => {
//   try{

//     //get subSectionId - assuming it is passed in the request body or in the request params

//     const {subSectionId, sectionId} = req.body;

//     //use findByIdAndDelete
//     const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
//     console.log(deletedSubSection);
//     //remove sub section from section
//     await Section.findByIdAndUpdate({_id:sectionId}, {
//       $pull: {subSection: deletedSubSection._id}
//     }, {new:true});
    
//     //return response
//     return res.status(200).json({success:true, message:"SubSection deleted"});

//   }
//   catch(error){
//     console.log(error);
//     res.status(500).json({success:false,
//       message:"Unable to delete SubSection", error:error.message});
//   }
// }


//new code
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
// const { uploadVideoToCloudinary } = require("../utils/imageUploader");
const { uploadImageToCloudinary } = require("../utils/imageUploader")


// exports.createSubSection = async (req, res) => {
//   try {
//     // Data fetch from request body
//     const { sectionId, title, timeDuration, description } = req.body;
//     const video = req.files?.videoFile;

//     // Validate data
//     if (!sectionId || !title || !timeDuration || !description || !video) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields"
//       });
//     }

//     // Upload video to cloudinary
//     const uploadDetails = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);
//     if (!uploadDetails) {
//       throw new Error("Failed to upload video");
//     }

//     // Create subsection
//     const SubSectionDetails = await SubSection.create({
//       title,
//       timeDuration,
//       description,
//       videoUrl: uploadDetails.secure_url
//     });

//     // Update section with populated data
//     const updatedSectionDetails = await Section.findByIdAndUpdate(
//       { _id: sectionId },
//       {
//         $push: { subSection: SubSectionDetails._id }
//       },
//       { new: true }
//     )
//     .populate({
//       path: "subSection",
//       select: "title description timeDuration videoUrl"
//     })
//     .exec();

//     if (!updatedSectionDetails) {
//       throw new Error("Failed to update section with subsection");
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Subsection created successfully",
//       data: updatedSectionDetails
//     });

//   } catch (error) {
//     console.error("Error creating subsection:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create subsection",
//       error: error.message
//     });
//   }
// }
exports.createSubSection = async (req, res) => {
  try {
    // Data fetch from request body
    const { sectionId, title, description} = req.body;
    
    const video = req.files.videoFile;
    

    // Check if video file exists
    if (!req.files || !req.files.videoFile) {
      return res.status(400).json({
        success: false,
        message: "Video file is required"
      });
    }

    // const video = req.files.videoFile;

    // Validate all required fields
    if (!sectionId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: sectionId, title, description"
      });
    }

    // Check if section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found"
      });
    }

    // Upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    )

    console.log(uploadDetails)

    // Create subsection
    const SubSectionDetails = await SubSection.create({
       title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // Update section with populated data
    const updatedSectionDetails = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: { subSection: SubSectionDetails._id }
      },
      { new: true }
    )
    .populate("subSection")

    return res.status(201).json({
      success: true,
      message: "Subsection created successfully",
      data: updatedSectionDetails
    });

  } catch (error) {
    console.error("Error creating subsection:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create subsection"
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { title, description, subSectionId, sectionId } = req.body;
    const videoFile = req.files?.videoFile;

    // Validate input
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing section or subsection ID"
      });
    }

    // Prepare update data
    const updateData = {
      ...(title && { title }),
      
      ...(description && { description })
    };

    // Handle video upload if present
    if (videoFile) {
      const uploadDetails = await uploadImageToCloudinary(videoFile, process.env.FOLDER_NAME);
      updateData.videoUrl = uploadDetails.secure_url;
      updateData.timeDuration = `${uploadDetails.duration}`
    }

    // Update subsection
     await SubSection.findByIdAndUpdate(
      subSectionId,
      updateData,
      { new: true }
    );

    // Get updated section with populated data
    const updatedSection = await Section.findById(sectionId).populate("subSection");

    console.log("updated section", updatedSection)



    return res.status(200).json({
      success: true,
      message: "Subsection updated successfully",
      data: updatedSection
    });

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing section or subsection ID"
      });
    }

    // Delete subsection
    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found"
      });
    }

    // Update section and get populated data
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: { subSection: subSectionId }
      },
      { new: true }
    )
    .populate(
      "subSection")
    

    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
      data: updatedSection
    });

  } catch (error) {
    console.error("Error deleting subsection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete subsection",
      error: error.message
    });
  }
}