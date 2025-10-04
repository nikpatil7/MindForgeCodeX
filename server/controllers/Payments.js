const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const Payment = require("../models/Payment");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
// const { default: mongoose } = require("mongoose");
const crypto = require("crypto")
const mongoose = require("mongoose")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")



// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    const paymentData = {
      razorpay_order_id,
      razorpay_payment_id,
      amount: 0 // We'll need to get this from the order
    }
    
    // Get the order details to get the amount
    try {
      const order = await instance.orders.fetch(razorpay_order_id)
      paymentData.amount = order.amount
    } catch (error) {
      console.log("Error fetching order details:", error)
    }
    
    await enrollStudents(courses, userId, res, paymentData)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res, paymentData = null) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideos: [],
      })
      
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      
      // Save payment record if payment data is provided
      if (paymentData) {
        // Get instructor details
        let instructorName = "Unknown Instructor"
        if (enrolledCourse.instructor) {
          if (typeof enrolledCourse.instructor === 'object') {
            instructorName = `${enrolledCourse.instructor.firstName || ''} ${enrolledCourse.instructor.lastName || ''}`.trim()
          } else {
            // If instructor is just an ID, we'll populate it later
            instructorName = "Instructor"
          }
        }
        
        const paymentRecord = await Payment.create({
          userId: userId,
          courseId: courseId,
          orderId: paymentData.razorpay_order_id,
          paymentId: paymentData.razorpay_payment_id,
          amount: paymentData.amount / 100, // Convert from paise to rupees
          currency: 'INR',
          status: 'Completed',
          paymentMethod: 'Razorpay',
          transactionDate: new Date(),
          courseDetails: {
            courseName: enrolledCourse.courseName,
            instructorName: instructorName,
            thumbnail: enrolledCourse.thumbnail,
          },
          userDetails: {
            firstName: enrolledStudent.firstName,
            lastName: enrolledStudent.lastName,
            email: enrolledStudent.email,
          },
        })
        console.log("Payment record saved: ", paymentRecord)
      }
      
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

      console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}




// Get user's purchase history
exports.getPurchaseHistory = async (req, res) => {
  const userId = req.user.id

  try {
    const payments = await Payment.find({ userId })
      .populate({
        path: 'courseId',
        select: 'courseName thumbnail instructor',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      })
      .sort({ transactionDate: -1 })
      .limit(50) // Limit to last 50 transactions

    const formattedPayments = payments.map(payment => {
      // Use populated course data if available, otherwise fall back to stored data
      const courseDetails = payment.courseId ? {
        courseName: payment.courseId.courseName || payment.courseDetails?.courseName,
        instructorName: payment.courseId.instructor ? 
          `${payment.courseId.instructor.firstName} ${payment.courseId.instructor.lastName}` : 
          payment.courseDetails?.instructorName,
        thumbnail: payment.courseId.thumbnail || payment.courseDetails?.thumbnail,
      } : payment.courseDetails

      return {
        _id: payment._id,
        courseId: payment.courseId?._id || payment.courseId,
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        transactionDate: payment.transactionDate,
        courseDetails: courseDetails,
        userDetails: payment.userDetails,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      }
    })

    return res.status(200).json({
      success: true,
      data: formattedPayments,
      message: "Purchase history fetched successfully"
    })
  } catch (error) {
    console.error("Error fetching purchase history:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchase history",
      error: error.message
    })
  }
}
