const mongoose = require("mongoose");
const Category = require("./models/Category");
const Course = require("./models/Course");
const User = require("./models/User");
const Profile = require("./models/Profile");
const Section = require("./models/Section");
const SubSection = require("./models/Subsection");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Sample Categories
const sampleCategories = [
  {
    name: "Web Development",
    description: "Learn modern web development technologies and frameworks"
  },
  {
    name: "Data Science",
    description: "Master data analysis, machine learning, and AI technologies"
  },
  {
    name: "Mobile Development",
    description: "Build mobile applications for iOS and Android platforms"
  },
  {
    name: "Cybersecurity",
    description: "Learn security concepts and ethical hacking techniques"
  },
  {
    name: "DevOps",
    description: "Master deployment, automation, and cloud technologies"
  }
];

// Sample Users (Instructors)
const sampleInstructors = [
  {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@mindforge.com",
    password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    accountType: "Instructor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@mindforge.com",
    password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    accountType: "Instructor",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
  },
  {
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@mindforge.com",
    password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    accountType: "Instructor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  }
];

// Sample Students
const sampleStudents = [
  {
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma.wilson@student.com",
    password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    accountType: "Student",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
  },
  {
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@student.com",
    password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    accountType: "Student",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
  }
];

// Sample Courses
const sampleCourses = [
  {
    courseName: "Complete Web Development Bootcamp",
    courseDescription: "Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to build full-stack web applications",
    whatYouWillLearn: [
      "Build responsive websites with HTML5 and CSS3",
      "Master JavaScript ES6+ and modern frameworks",
      "Create dynamic web applications with React",
      "Develop backend APIs with Node.js and Express",
      "Work with databases using MongoDB",
      "Deploy applications to the cloud"
    ],
    price: 2999,
    tag: ["Web Development", "JavaScript", "React", "Node.js"],
    category: "Web Development",
    status: "Published",
    instructions: [
      "Basic computer knowledge required",
      "No prior programming experience needed",
      "Dedicate 2-3 hours daily for best results",
      "Complete all assignments and projects"
    ],
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop"
  },
  {
    courseName: "Data Science & Machine Learning Masterclass",
    courseDescription: "Master data analysis, visualization, and machine learning algorithms with Python",
    whatYouWillLearn: [
      "Data manipulation with Pandas and NumPy",
      "Data visualization with Matplotlib and Seaborn",
      "Statistical analysis and hypothesis testing",
      "Machine learning algorithms and models",
      "Deep learning with TensorFlow and Keras",
      "Real-world data science projects"
    ],
    price: 3999,
    tag: ["Data Science", "Python", "Machine Learning", "AI"],
    category: "Data Science",
    status: "Published",
    instructions: [
      "Basic Python knowledge recommended",
      "Understanding of statistics helpful",
      "Work on real datasets and projects",
      "Practice with Kaggle competitions"
    ],
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
  },
  {
    courseName: "Mobile App Development with React Native",
    courseDescription: "Build cross-platform mobile applications using React Native and modern development tools",
    whatYouWillLearn: [
      "React Native fundamentals and components",
      "Navigation and state management",
      "API integration and data handling",
      "Native device features integration",
      "App store deployment process",
      "Performance optimization techniques"
    ],
    price: 2499,
    tag: ["Mobile Development", "React Native", "JavaScript", "App Development"],
    category: "Mobile Development",
    status: "Published",
    instructions: [
      "Basic JavaScript knowledge required",
      "Familiarity with React helpful",
      "Test on both iOS and Android devices",
      "Follow mobile design guidelines"
    ],
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop"
  }
];

// Sample Sections and SubSections
const sampleSections = [
  {
    sectionName: "Introduction to Web Development",
    subSections: [
      {
        title: "Welcome to the Course",
        timeDuration: 300,
        description: "Course overview and setup instructions",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
      },
      {
        title: "Setting Up Your Development Environment",
        timeDuration: 600,
        description: "Install and configure necessary tools",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
      }
    ]
  },
  {
    sectionName: "HTML Fundamentals",
    subSections: [
      {
        title: "HTML Structure and Elements",
        timeDuration: 900,
        description: "Learn basic HTML tags and document structure",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
      },
      {
        title: "Forms and Input Elements",
        timeDuration: 750,
        description: "Create interactive forms and user inputs",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
      }
    ]
  }
];

async function createSampleData() {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Course.deleteMany({});
    await Section.deleteMany({});
    await SubSection.deleteMany({});

    console.log("Cleared existing data");

    // Create categories
    const categories = await Category.insertMany(sampleCategories);
    console.log("Created categories");

    // Create instructor profiles
    const instructorProfiles = await Profile.insertMany([
      {
        dateOfBirth: "1985-03-15",
        about: "Senior Web Developer with 10+ years of experience in modern web technologies",
        contactNumber: "+1-555-0101",
        gender: "Male"
      },
      {
        dateOfBirth: "1990-07-22",
        about: "Data Scientist and Machine Learning expert with PhD in Computer Science",
        contactNumber: "+1-555-0102",
        gender: "Female"
      },
      {
        dateOfBirth: "1988-11-08",
        about: "Mobile App Developer specializing in React Native and iOS development",
        contactNumber: "+1-555-0103",
        gender: "Male"
      }
    ]);

    // Create student profiles
    const studentProfiles = await Profile.insertMany([
      {
        dateOfBirth: "1995-04-12",
        about: "Aspiring web developer learning modern technologies",
        contactNumber: "+1-555-0201",
        gender: "Female"
      },
      {
        dateOfBirth: "1992-09-30",
        about: "Software engineer transitioning to data science",
        contactNumber: "+1-555-0202",
        gender: "Male"
      }
    ]);

    // Create instructors with profiles
    const instructors = await User.insertMany(
      sampleInstructors.map((instructor, index) => ({
        ...instructor,
        additionalDetails: instructorProfiles[index]._id
      }))
    );

    // Create students with profiles
    const students = await User.insertMany(
      sampleStudents.map((student, index) => ({
        ...student,
        additionalDetails: studentProfiles[index]._id
      }))
    );

    console.log("Created users and profiles");

    // Create courses with sections and subsections
    for (let i = 0; i < sampleCourses.length; i++) {
      const course = sampleCourses[i];
      const category = categories.find(cat => cat.name === course.category);
      const instructor = instructors[i];

      // Create sections and subsections
      const sections = [];
      for (const sectionData of sampleSections) {
        const subSections = [];
        for (const subSectionData of sectionData.subSections) {
          const subSection = await SubSection.create({
            title: subSectionData.title,
            timeDuration: subSectionData.timeDuration,
            description: subSectionData.description,
            videoUrl: subSectionData.videoUrl
          });
          subSections.push(subSection._id);
        }

        const section = await Section.create({
          sectionName: sectionData.sectionName,
          subSection: subSections
        });
        sections.push(section._id);
      }

      // Create course
      await Course.create({
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        whatYouWillLearn: course.whatYouWillLearn,
        price: course.price,
        tag: course.tag,
        category: category._id,
        instructor: instructor._id,
        status: course.status,
        instructions: course.instructions,
        thumbnail: course.thumbnail,
        courseContent: sections,
        studentsEnrolled: [students[0]._id, students[1]._id]
      });
    }

    console.log("Created courses with sections and subsections");
    console.log("Sample data created successfully!");

    // Log created data
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${instructors.length} instructors`);
    console.log(`Created ${students.length} students`);
    console.log(`Created ${sampleCourses.length} courses`);

  } catch (error) {
    console.error("Error creating sample data:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
createSampleData(); 