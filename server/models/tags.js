const mongoose = require('mongoose');
const Course = require('./Course');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description:{
    type: String,
    required: true,
    trim: true,
  },
  Course  : [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  }],

});

module.exports = mongoose.model('Tag', tagSchema);