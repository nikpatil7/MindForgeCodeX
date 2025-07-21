const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
  },
  courseDescription: {
    type: String,
    min: 6,
    max: 1024,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
    }
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RatingAndReview',
    }
  ],
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  // tag:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:'Tag',
  // },
  tag: {
		type: [String],
		required: true,
	},
  category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    }
  ],
  instructions: {
		type: [String]
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
   createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
