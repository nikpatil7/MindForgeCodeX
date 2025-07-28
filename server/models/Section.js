 const mongoose = require('mongoose');


const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  subSection: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubSection',
  }],
});

module.exports = mongoose.model('Section', sectionSchema);