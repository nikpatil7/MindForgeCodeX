const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    default: 'Razorpay',
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  courseDetails: {
    courseName: String,
    instructorName: String,
    thumbnail: String,
  },
  userDetails: {
    firstName: String,
    lastName: String,
    email: String,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
paymentSchema.index({ userId: 1, transactionDate: -1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ paymentId: 1 });

module.exports = mongoose.model('Payment', paymentSchema); 