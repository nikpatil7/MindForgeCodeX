const mailSender = require("../utils/mailSender")

// Contact form submission
exports.contactUs = async (req, res) => {
  const { firstname, lastname, email, phoneNo, message, countrycode } = req.body

  // Validation
  if (!firstname || !email || !phoneNo || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields"
    })
  }

  try {
    // Email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstname} ${lastname || ''}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${countrycode} ${phoneNo}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr>
      <p><em>This message was sent from the MindForge contact form.</em></p>
    `

    // Send email to admin
    await mailSender(
      process.env.ADMIN_EMAIL || "admin@mindforge.com",
      "New Contact Form Submission - MindForge",
      emailContent
    )

    // Send confirmation email to user
    const userEmailContent = `
      <h2>Thank you for contacting MindForge!</h2>
      <p>Dear ${firstname},</p>
      <p>We have received your message and will get back to you within 24-48 hours.</p>
      <p><strong>Your message:</strong></p>
      <p>${message}</p>
      <hr>
      <p>Best regards,<br>The MindForge Team</p>
    `

    await mailSender(
      email,
      "Thank you for contacting MindForge",
      userEmailContent
    )

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon!"
    })

  } catch (error) {
    console.error("Contact form error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later."
    })
  }
} 