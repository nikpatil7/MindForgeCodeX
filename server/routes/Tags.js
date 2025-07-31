const express = require("express")
const router = express.Router()

const {
  createTag,
  showAllTags,
} = require("../controllers/Tags")

const { auth, isAdmin } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Tag routes
// ********************************************************************************************************

// Create a new tag (Admin only)
router.post("/createTag", auth, isAdmin, createTag)

// Get all tags
router.get("/showAllTags", showAllTags)

module.exports = router 