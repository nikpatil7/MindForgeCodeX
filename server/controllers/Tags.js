const Tag = require("../models/Tag");

exports.createTag = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;

    //validate data
    if (!name || !description) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide a name and description",
        });
    }

    //create entry in DB
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    return res.status(201).json({ success: true, message: "Tag created" });
    
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong while creating the tag",
      });
  }
};

// get all tags

exports.showAllTags = async (req, res) => {
  try{
    const allTags = await Tag.find({},{name:true, description:true}); 
    res.status(200).json({success:true, data:allTags, message:"All tags fetched"});
  }
  catch{
    console.log(error);
    res.status(500).json({success:false, message:error.message});
  }
}
