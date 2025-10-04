const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
// const { uploadVideoToCloudinary } = require("../utils/imageUploader");
const { uploadImageToCloudinary } = require("../utils/imageUploader")



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

    return res.status(200).json({
      success: true,
      message: "Subsection updated successfully",
      data: updatedSection
    });

  } catch (error) {
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
    return res.status(500).json({
      success: false,
      message: "Failed to delete subsection",
      error: error.message
    });
  }
}