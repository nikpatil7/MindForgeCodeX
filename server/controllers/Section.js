const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req, res) => {
  try{
    //data fetch
    const {sectionName, courseId} = req.body;

    //data validation
    if(!sectionName || !courseId){
      return res.status(400).json({success:false, message:"Please provide all the details"});
    }

    //create section
    const newSection = await Section.create({
      sectionName,
      courseId
    });

    //update course with section ObjectId
    const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, {
      $push: {courseContent: newSection._id}
    }, {new:true}
  )
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();

    // .populate({
    //   path:"courseContent",
    //   model:"Section",
    //   populate:{
    //     path:"subSections",
    //     model:"SubSection"
    //   }
    // })


    //todo : use populate to replace sections/subsections both in updateCourseDetails

    //response
    return res.status(201).json({success:true,message:"Section created",updatedCourseDetails});

  }
  catch(error){
    console.log(error);
    res.status(500).json({success:false,
      message:"Unable to create Section", error:error.message});
  }
}

exports.updateSection = async (req, res) => {
  try{
    //fetch data
    const {sectionName, sectionId} = req.body;

    console.log(sectionName," ", sectionId);

    //validate data
    if(!sectionName || !sectionId){
      return res.status(400).json({success:false, message:"Please provide all the details"});
    }

    //update section
    const updatedSection = await Section.findByIdAndUpdate(sectionId, {
      sectionName
    }, {new:true});

    //response
    return res.status(200).json({success:true, message:"Section updated", updatedSection});
  }
  catch(error){
    console.error("Error updating section:", error);
    res.status(500).json({success:false,
      message:"Unable to update Section", error:error.message});
  }
};

//delete section

exports.deleteSection = async (req, res) => {
  try{

    //get sectionId - assuming it is passed in the request body or in the request params

    const {sectionId, courseId} = req.body;

    //use findByIdAndDelete
    await Section.findByIdAndDelete(sectionId);
    //TODO : do we need to delete the section from the courseSchema as well?

    await Course.findByIdAndUpdate({_id: courseId},{
      $pull: {courseContent: sectionId}
    }, {new:true});

    //return response
    return res.status(200).json({success:true, message:"Section deleted"});

  }
  catch(error){
    console.error("Error deleting section:", error);
    res.status(500).json({success:false,
      message:"Unable to delete Section", error:error.message});
  }
}