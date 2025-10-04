const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

exports.auth = async (req, res, next) => {
  try {
    // Get token from multiple sources
    const token = 
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", ""); // Added optional chaining

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is missing',
      });
    }

    // Verify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decode);

      // Fetch complete user from database
      const userId = decode.user?.id || decode.id;
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      // Attach full user object to request
      req.user = user;
      next();

    } catch (error) {
      console.log("Token verification error:", error);
      return res.status(401).json({ 
        success: false, 
        message: error.name === 'TokenExpiredError' 
          ? 'Token expired' 
          : 'Invalid token' 
      });
    }

  } catch (error) {
    console.log("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
    });
  }
}



//isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if(req.user.accountType !== 'Student'){
          return res.status(401).json({ success: false, message: 'This is protected route for students only' });
        }
          next();
    
    }
    catch(error){
        return res.status(500).json({ success: false, message: 'User role cannot be verified, please try again' });
    }
}

//isInstuctor
exports.isInstructor = async (req, res, next) => {
  try {
      if(req.user.accountType !== 'Instructor'){
        return res.status(401).json({ success: false, message: 'This is protected route for Instructor only' });
      }
        next();
  
  }
  catch(error){
      return res.status(500).json({ success: false, message: 'User role cannot be verified, please try again' });
  }
}

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
      if(req.user.accountType !== 'Admin'){
        return res.status(401).json({ success: false, message: 'This is protected route for Admin only' });
      }
        next();
  
  }
  catch(error){
      return res.status(500).json({ success: false, message: 'User role cannot be verified, please try again' });
  }
}