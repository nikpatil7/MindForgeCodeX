const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { uploadVideoToCloudinary } = require("../utils/imageUploader");


//create sub section

exports.createSubSection = async (req, res) => {
  try{

    //data fetch from request body
    const {sectionId, title, timeDuration, description} = req.body;

    //extract file/video
    const video = req.files.videoFile;

    //validate data
    if(!sectionId || !title || !timeDuration || !description || !video){
      return res.status(404).json({success:false, message:"Please provide all the details"});
    }

    //upload file/video to cloudinary
    // const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
    const uploadDetails = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);

    //create sub section
    const SubSectionDetails = await SubSection.create({
			title: title,
			timeDuration: timeDuration,
			description: description,
			videoUrl: uploadDetails.secure_url,
		});

    //update section with sub section ObjectId
    const updatedSectionDetails = await Section.findByIdAndUpdate({_id:sectionId}, {
      $push: {subSection: SubSectionDetails._id}
    }, {new:true}).populate("subSection");

    //HW : use populate to replace sections/subsections both in updatedSectionDetails

    //response 
    return res.status(201).json({success:true, message:"SubSection created", data:updatedSectionDetails});
  }
  catch(error){
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({success:false,
      message:"Unable to create SubSection", error:error.message});
  }

}

//TODO: update sub section with populate and also delete sub section

//update sub section
exports.updateSubSection = async (req, res) => {
  try{
    //fetch data
    const {title, timeDuration, description, subSectionId} = req.body;

    //validate data
    if(!title || !timeDuration || !description || !subSectionId){
      return res.status(400).json({success:false, message:"Please provide all the details"});
    }

    //update sub section
    const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId, {
      title,
      timeDuration,
      description
    }, {new:true});

    //response
    return res.status(200).json({success:true, message:"SubSection updated", data:updatedSubSection});
  }
  catch(error){
    console.log(error);
    res.status(500).json({success:false, message:"Unable to update SubSection", error:error.message});
  }
}

//TODO : delete sub section
exports.deleteSubSection = async (req, res) => {
  try{

    //get subSectionId - assuming it is passed in the request body or in the request params

    const {subSectionId, sectionId} = req.body;

    //use findByIdAndDelete
    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
    console.log(deletedSubSection);
    //remove sub section from section
    await Section.findByIdAndUpdate({_id:sectionId}, {
      $pull: {subSection: deletedSubSection._id}
    }, {new:true});
    
    //return response
    return res.status(200).json({success:true, message:"SubSection deleted"});

  }
  catch(error){
    console.log(error);
    res.status(500).json({success:false,
      message:"Unable to delete SubSection", error:error.message});
  }
}
