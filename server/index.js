// At the top of server entry file (e.g., server/index.js)
require('dotenv').config({ path: './server/.env' });

const express = require("express");
const app = express();

// const fs = require('fs');
// const path = require('path');

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const contactRoutes = require("./routes/Contact");

const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const tagRoutes = require("./routes/Tags");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const {cloudinaryConnect} = require("./config/cloudinary");

const fileUpload = require("express-fileupload");
// const dotenv = require("dotenv");

// dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();

//middlewares
// app.use(express.json());
// app.use(cookieParser());
//new code
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());


// CORS configuration
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || "http://localhost:3000",
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'timeout'],
// }));

// Handle preflight requests
app.options('*', cors());

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "https://mindforge-app-six.vercel.app",
  "http://localhost:3000", // for local testing
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // needed if you are using cookies or sessions
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['*', 'Authorization']
  })
);

// app.use(
//   fileUpload({
//     useTempFiles:true,
//     tempFileDir:"/tmp",
//   })
// )
//new code

// File upload middleware configuration
// Create tmp directory if it doesn't exist
// const tmpDir = path.join(__dirname, 'tmp');
// if (!fs.existsSync(tmpDir)){
//     fs.mkdirSync(tmpDir);
// }

// Configure file upload after tmp directory creation
// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: tmpDir,
//   createParentPath: true,
//   limits: { 
//     fileSize: 50 * 1024 * 1024 
//   },
//   abortOnLimit: true
// }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 100 MB
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/reach", contactRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/tags", tagRoutes);

//def route
app.get("/",(req,res)=>{
  return res.json({
    success:true,
    message:'Your server is up and running....'
  });
});


app.listen(PORT,()=>{
  console.log(`App is running at ${PORT}`)
});