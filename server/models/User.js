// const { TokenExpiredError } = require('jsonwebtoken');
const mongoose = require('mongoose');
// const { resetPasswordToken } = require('../controllers/ResetPassword');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 6,
      max: 255,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      min: 6,
      max: 255,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    image: {
      type: String,
      required: true,
    },
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseProgress",
      },
    ],
  },
  { timestamps: true } //timestamps for when the document is created and last modified
);

module.exports = mongoose.model('user', userSchema);