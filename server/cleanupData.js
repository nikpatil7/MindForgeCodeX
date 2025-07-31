const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Profile = require('./models/Profile');
const Course = require('./models/Course');
const Section = require('./models/Section');
const SubSection = require('./models/Subsection');
const Category = require('./models/Category');
const RatingAndReview = require('./models/RatingAndReview');
const CourseProgress = require('./models/CourseProgress');
const Payment = require('./models/Payment');
const Tag = require('./models/tags');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Cleanup function
const cleanupData = async () => {
  try {
    console.log('Starting data cleanup...');
    
    // Delete all data in reverse order of dependencies
    console.log('Deleting payments...');
    await Payment.deleteMany({});
    
    console.log('Deleting course progress...');
    await CourseProgress.deleteMany({});
    
    console.log('Deleting ratings and reviews...');
    await RatingAndReview.deleteMany({});
    
    console.log('Deleting subsections...');
    await SubSection.deleteMany({});
    
    console.log('Deleting sections...');
    await Section.deleteMany({});
    
    console.log('Deleting courses...');
    await Course.deleteMany({});
    
    console.log('Deleting categories...');
    await Category.deleteMany({});
    
    console.log('Deleting tags...');
    await Tag.deleteMany({});
    
    console.log('Deleting profiles...');
    await Profile.deleteMany({});
    
    console.log('Deleting users...');
    await User.deleteMany({});
    
    console.log('✅ Data cleanup completed successfully!');
    console.log('📝 All test data has been removed.');
    console.log('🚀 Ready for fresh sample data generation.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected');
  }
};

// Run cleanup
if (require.main === module) {
  connectDB().then(() => {
    cleanupData();
  });
}

module.exports = { cleanupData }; 