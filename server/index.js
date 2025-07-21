// At the top of server entry file (e.g., server/index.js)
require('dotenv').config({ path: './server/.env' });

const express = require("express");
const app = express();

const fs = require('fs');
const path = require('path');

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");

const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

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



// app.use(
//   cors({
//     origin:"http://localhost:3000",
//     credentials:true,
//   })
// ) original code

//claude code

// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'timeout'],
}));


// app.use(
//   fileUpload({
//     useTempFiles:true,
//     tempFileDir:"/tmp",
//   })
// )
//new code

// File upload middleware configuration
// Create tmp directory if it doesn't exist
const tmpDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tmpDir)){
    fs.mkdirSync(tmpDir);
}

// Configure file upload after tmp directory creation
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: tmpDir,
  createParentPath: true,
  limits: { 
    fileSize: 50 * 1024 * 1024 
  },
  abortOnLimit: true
}));

//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment",paymentRoutes);

//def route
app.get("/",(req,res)=>{
  return res.json({
    success:true,
    message:'Your server is up and running....'
  });
});

//new code
// Global error handler
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//     // error: process.env.NODE_ENV === 'development' ? err : {}
//   });
// });


app.listen(PORT,()=>{
  console.log(`App is running at ${PORT}`)
});