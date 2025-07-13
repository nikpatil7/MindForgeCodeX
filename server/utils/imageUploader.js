const cloudinary = require('cloudinary').v2;
// const fs = require('fs');
// const path = require('path');
// const { promisify } = require('util');


exports.uploadImageToCloudinary = async (file, folder, height, quality) => {

  const options = {folder};
  if(height){ options.height = height;}
  if(quality) {options.quality = quality;}
  options.response_type = "auto";

  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.uploadVideoToCloudinary = async (file, folder) => {
  const options = { folder, resource_type: "video" };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
