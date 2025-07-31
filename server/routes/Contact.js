const express = require("express")
const router = express.Router()
const { contactUs } = require("../controllers/Contact")

// Contact form submission
router.post("/contact", contactUs)

module.exports = router
