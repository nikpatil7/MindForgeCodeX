const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

// Sample data
const sampleCategories = [
  { name: "Web Development", description: "Learn modern web development technologies" },
  { name: "Data Science", description: "Master data analysis and machine learning" },
  { name: "Mobile Development", description: "Build mobile applications for iOS and Android" },
  { name: "DevOps & Cloud", description: "Learn deployment and cloud technologies" },
  { name: "Cybersecurity", description: "Master security concepts and ethical hacking" },
];

const sampleTags = [
  { name: "JavaScript", description: "Modern JavaScript programming" },
  { name: "React", description: "React.js framework" },
  { name: "Node.js", description: "Server-side JavaScript" },
  { name: "Python", description: "Python programming language" },
  { name: "Machine Learning", description: "AI and ML concepts" },
  { name: "AWS", description: "Amazon Web Services" },
  { name: "Docker", description: "Containerization technology" },
  { name: "Cybersecurity", description: "Security and ethical hacking" },
];

const sampleInstructors = [
  {
    firstName: "Swapnil",
    lastName: "Jadhav",
    email: "swapnil.jadhav@mindforge.com",
    password: "Instructor123!",
    accountType: "Instructor",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Swapnil Jadhav",
    bio: "Full-stack developer with 8+ years of experience in React, Node.js, and cloud technologies."
  },
  {
    firstName: "Rucha",
    lastName: "Deshpande",
    email: "rucha.deshpande@mindforge.com",
    password: "Instructor123!",
    accountType: "Instructor",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Rucha Deshpande",
    bio: "Data scientist and ML engineer specializing in Python, TensorFlow, and big data analytics."
  },
  {
    firstName: "Omkar",
    lastName: "Patil",
    email: "omkar.patil@mindforge.com",
    password: "Instructor123!",
    accountType: "Instructor",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Omkar Patil",
    bio: "Mobile app developer expert in React Native, Flutter, and iOS development."
  },
  {
    firstName: "Sneha",
    lastName: "Bhosale",
    email: "sneha.bhosale@mindforge.com",
    password: "Instructor123!",
    accountType: "Instructor",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Sneha Bhosale",
    bio: "DevOps engineer and cloud architect with expertise in AWS, Docker, and Kubernetes."
  },
  {
    firstName: "Nilesh",
    lastName: "Shinde",
    email: "nilesh.shinde@mindforge.com",
    password: "Instructor123!",
    accountType: "Instructor",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Nilesh Shinde",
    bio: "Cybersecurity expert and ethical hacker with certifications in CISSP and CEH."
  }
];

const sampleStudents = [
  {
    firstName: "Amruta",
    lastName: "Phadke",
    email: "amruta.phadke@student.com",
    password: "Student123!",
    accountType: "Student",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Amruta Phadke"
  },
  {
    firstName: "Rahul",
    lastName: "Sawant",
    email: "rahul.sawant@student.com",
    password: "Student123!",
    accountType: "Student",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Rahul Sawant"
  },
  {
    firstName: "Vaishnavi",
    lastName:"Kulkarni",
    email:  "vaishnavi.kulkarni@student.com",
    password: "Student123!",
    accountType: "Student",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Vaishnavi Kulkarni"
  },
  {
    firstName: "Sanket",
    lastName: "More",
    email: "sanket.more@student.com",
    password: "Student123!",
    accountType: "Student",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Sanket More"
  },
  {
    firstName: "Pooja",
    lastName: "Gokhale",
    email: "pooja.gokhale@student.com",
    password: "Student123!",
    accountType: "Student",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Pooja Gokhale"
  }
];

const sampleCourses = [
  {
    courseName: "Complete React.js Masterclass 2024",
    courseDescription: "Learn React.js from scratch to advanced concepts with real-world projects. Master hooks, context, Redux, and modern React patterns.",
    price: 2999,
    tag: ["JavaScript", "React"],
    category: "Web Development",
    instructor: "Swapnil Jadhav",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
    whatYouWillLearn: "React fundamentals, Hooks, Context API, Redux, TypeScript integration, Testing, Deployment",
    instructions: ["Basic JavaScript knowledge", "HTML and CSS fundamentals", "A computer with internet connection"],
    status: "Published"
  },
  {
    courseName: "Python for Data Science & Machine Learning",
    courseDescription: "Master Python programming for data science, machine learning, and AI. Learn pandas, numpy, scikit-learn, and deep learning.",
    price: 3999,
    tag: ["Python", "Machine Learning"],
    category: "Data Science",
    instructor: "Rucha Deshpande",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500",
    whatYouWillLearn: "Python programming, Data analysis, Machine learning algorithms, Deep learning, Data visualization",
    instructions: ["Basic programming concepts", "High school mathematics", "Curiosity to learn"],
    status: "Published"
  },
  {
    courseName: "React Native Mobile App Development",
    courseDescription: "Build cross-platform mobile applications using React Native. Learn to create iOS and Android apps with one codebase.",
    price: 3499,
    tag: ["JavaScript", "React"],
    category: "Mobile Development",
    instructor: "Omkar Patil",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
    whatYouWillLearn: "React Native basics, Navigation, State management, Native modules, App deployment",
    instructions: ["React.js fundamentals", "JavaScript ES6+", "Mobile development interest"],
    status: "Published"
  },
  {
    courseName: "AWS Cloud Practitioner & Solutions Architect",
    courseDescription: "Master AWS cloud services and prepare for AWS certifications. Learn cloud architecture, deployment, and best practices.",
    price: 4499,
    tag: ["AWS", "Docker"],
    category: "DevOps & Cloud",
    instructor: "Sneha Bhosale",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500",
    whatYouWillLearn: "AWS services, Cloud architecture, Docker containers, CI/CD pipelines, Security best practices",
    instructions: ["Basic IT knowledge", "Understanding of networking", "Cloud computing interest"],
    status: "Published"
  },
  {
    courseName: "Ethical Hacking & Cybersecurity Fundamentals",
    courseDescription: "Learn ethical hacking, penetration testing, and cybersecurity fundamentals. Master security tools and techniques.",
    price: 4999,
    tag: ["Cybersecurity"],
    category: "Cybersecurity",
    instructor: "Nilesh Shinde",
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500",
    whatYouWillLearn: "Network security, Penetration testing, Security tools, Vulnerability assessment, Incident response",
    instructions: ["Basic computer knowledge", "Networking fundamentals", "Ethical mindset"],
    status: "Published"
  }
];

// Generate sample data
const generateSampleData = async () => {
  try {
    console.log('🚀 Starting enhanced sample data generation...');

    // 1. Create categories
    console.log('📂 Creating categories...');
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // 2. Create tags
    console.log('🏷️ Creating tags...');
    const createdTags = await Tag.insertMany(sampleTags);
    console.log(`✅ Created ${createdTags.length} tags`);

    // 3. Create instructor profiles
    console.log('👨‍🏫 Creating instructor profiles...');
    const instructorProfiles = await Profile.insertMany(
      sampleInstructors.map(instructor => ({
        gender: "Male",
        dateOfBirth: "1990-01-01",
        about: instructor.bio,
        contactNumber: "+91-9876543210",
      }))
    );

    // 4. Create instructors
    console.log('👨‍🏫 Creating instructors...');
    const hashedPassword = await bcrypt.hash("Instructor123!", 10);
    const instructors = await User.insertMany(
      sampleInstructors.map((instructor, index) => ({
        ...instructor,
        password: hashedPassword,
        additionalDetails: instructorProfiles[index]._id,
        courses: [],
        courseProgress: [],
      }))
    );
    console.log(`✅ Created ${instructors.length} instructors`);

    // 5. Create student profiles
    console.log('👨‍🎓 Creating student profiles...');
    const studentProfiles = await Profile.insertMany(
      sampleStudents.map(student => ({
        gender: "Male",
        dateOfBirth: "2000-01-01",
        about: "Passionate learner interested in technology and programming.",
        contactNumber: "+91-9876543210",
      }))
    );

    // 6. Create students
    console.log('👨‍🎓 Creating students...');
    const studentHashedPassword = await bcrypt.hash("Student123!", 10);
    const students = await User.insertMany(
      sampleStudents.map((student, index) => ({
        ...student,
        password: studentHashedPassword,
        additionalDetails: studentProfiles[index]._id,
        courses: [],
        courseProgress: [],
      }))
    );
    console.log(`✅ Created ${students.length} students`);

    // 7. Create courses with sections and subsections
    console.log('📚 Creating courses...');
    const createdCourses = [];
    
    for (let i = 0; i < sampleCourses.length; i++) {
      const courseData = sampleCourses[i];
      const instructor = instructors.find(inst => 
        `${inst.firstName} ${inst.lastName}` === courseData.instructor
      );
      const category = createdCategories.find(cat => cat.name === courseData.category);
      const tags = createdTags.filter(tag => courseData.tag.includes(tag.name));

      // Create course
      const course = await Course.create({
        courseName: courseData.courseName,
        courseDescription: courseData.courseDescription,
        instructor: instructor._id,
        whatYouWillLearn: courseData.whatYouWillLearn,
        price: courseData.price,
        tag: tags.map(tag => tag.name),
        category: category._id,
        thumbnail: courseData.thumbnail,
        instructions: courseData.instructions,
        status: courseData.status,
        studentsEnrolled: [],
      });

      // Create sections and subsections
      const sections = [];
      for (let j = 1; j <= 4; j++) {
        const section = await Section.create({
          sectionName: `Section ${j}: ${getSectionName(courseData.courseName, j)}`,
          courseId: course._id,
        });

        const subsections = [];
        for (let k = 1; k <= 3; k++) {
          const subsection = await SubSection.create({
            title: `Lecture ${j}.${k}: ${getSubsectionTitle(courseData.courseName, j, k)}`,
            timeDuration: `${Math.floor(Math.random() * 20) + 10} minutes`,
            description: `Detailed explanation of ${getSubsectionTitle(courseData.courseName, j, k)}`,
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          });
          subsections.push(subsection._id);
        }

        section.subSection = subsections;
        await section.save();
        sections.push(section._id);
      }

      course.courseContent = sections;
      await course.save();
      createdCourses.push(course);

      // Update instructor's courses
      instructor.courses.push(course._id);
      await instructor.save();

      // Update category's courses
      category.courses.push(course._id);
      await category.save();
    }
    console.log(`✅ Created ${createdCourses.length} courses with sections and subsections`);

    // 8. Create sample enrollments and payments
    console.log('💰 Creating sample enrollments and payments...');
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const enrolledCourses = createdCourses.slice(0, Math.floor(Math.random() * 3) + 1); // 1-3 courses per student

      for (const course of enrolledCourses) {
        // Enroll student in course
        course.studentsEnrolled.push(student._id);
        await course.save();

        student.courses.push(course._id);
        await student.save();

        // Create course progress
        const courseProgress = await CourseProgress.create({
          courseId: course._id,
          userId: student._id,
          completedVideos: [],
        });

        student.courseProgress.push(courseProgress._id);
        await student.save();

        // Create payment record
        await Payment.create({
          userId: student._id,
          courseId: course._id,
          orderId: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: course.price,
          currency: 'INR',
          status: 'Completed',
          paymentMethod: 'Razorpay',
          transactionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
          courseDetails: {
            courseName: course.courseName,
            instructorName: `${instructors.find(inst => inst._id.equals(course.instructor)).firstName} ${instructors.find(inst => inst._id.equals(course.instructor)).lastName}`,
            thumbnail: course.thumbnail,
          },
          userDetails: {
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
          },
        });

        // Create sample ratings
        if (Math.random() > 0.3) { // 70% chance of rating
          await RatingAndReview.create({
            user: student._id,
            course: course._id,
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            review: getSampleReview(course.courseName),
          });
        }
      }
    }
    console.log('✅ Created sample enrollments, payments, and ratings');

    console.log('\n🎉 Enhanced sample data generation completed!');
    console.log('\n📊 Summary:');
    console.log(`   👨‍🏫 Instructors: ${instructors.length}`);
    console.log(`   👨‍🎓 Students: ${students.length}`);
    console.log(`   📚 Courses: ${createdCourses.length}`);
    console.log(`   📂 Categories: ${createdCategories.length}`);
    console.log(`   🏷️ Tags: ${createdTags.length}`);
    console.log(`   💰 Payments: ${await Payment.countDocuments()}`);
    console.log(`   ⭐ Ratings: ${await RatingAndReview.countDocuments()}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Instructors:');
    sampleInstructors.forEach(inst => {
      console.log(`     ${inst.email} / Instructor123!`);
    });
    console.log('   Students:');
    sampleStudents.forEach(student => {
      console.log(`     ${student.email} / Student123!`);
    });

  } catch (error) {
    console.error('❌ Error generating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected');
  }
};

// Helper functions
const getSectionName = (courseName, sectionNum) => {
  const sections = {
    "Complete React.js Masterclass 2024": [
      "React Fundamentals",
      "Hooks and State Management", 
      "Advanced React Patterns",
      "Project: Build a Full-Stack App"
    ],
    "Python for Data Science & Machine Learning": [
      "Python Basics",
      "Data Analysis with Pandas",
      "Machine Learning Fundamentals", 
      "Deep Learning Projects"
    ],
    "React Native Mobile App Development": [
      "React Native Basics",
      "Navigation and State",
      "Native Modules & APIs",
      "App Store Deployment"
    ],
    "AWS Cloud Practitioner & Solutions Architect": [
      "AWS Fundamentals",
      "Compute & Storage Services",
      "Security & Networking",
      "Architecture Best Practices"
    ],
    "Ethical Hacking & Cybersecurity Fundamentals": [
      "Security Fundamentals",
      "Network Security",
      "Penetration Testing",
      "Security Tools & Techniques"
    ]
  };
  return sections[courseName]?.[sectionNum - 1] || `Section ${sectionNum}`;
};

const getSubsectionTitle = (courseName, sectionNum, subsectionNum) => {
  const titles = [
    "Introduction and Setup",
    "Core Concepts",
    "Practical Examples",
    "Advanced Techniques",
    "Best Practices",
    "Troubleshooting",
    "Real-world Applications",
    "Performance Optimization",
    "Security Considerations",
    "Deployment Strategies"
  ];
  return titles[Math.floor(Math.random() * titles.length)];
};

const getSampleReview = (courseName) => {
  const reviews = [
    "Excellent course! Very comprehensive and well-structured.",
    "Great instructor, clear explanations, and practical examples.",
    "Highly recommended for anyone wanting to learn this technology.",
    "The course exceeded my expectations. Very practical and hands-on.",
    "Perfect balance of theory and practice. Loved the projects!",
    "Instructor explains complex concepts in a simple way.",
    "Great course material and excellent support from the instructor.",
    "Worth every penny! Learned a lot from this course.",
    "Very well organized content with real-world applications.",
    "Fantastic course for beginners and intermediate learners."
  ];
  return reviews[Math.floor(Math.random() * reviews.length)];
};

// Run generation
if (require.main === module) {
  connectDB().then(() => {
    generateSampleData();
  });
}

module.exports = { generateSampleData }; 