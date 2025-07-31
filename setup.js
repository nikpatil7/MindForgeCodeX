const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MindForge Codex...\n');

// Check if .env files exist
const serverEnvPath = path.join(__dirname, 'server', '.env');
const clientEnvPath = path.join(__dirname, '.env');

if (!fs.existsSync(serverEnvPath)) {
  console.log('📝 Creating server .env file...');
  const serverEnvContent = `# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mindforgecodex

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=mindforgecodex

# Razorpay Configuration
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
`;
  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log('✅ Server .env file created!');
} else {
  console.log('✅ Server .env file already exists');
}

if (!fs.existsSync(clientEnvPath)) {
  console.log('📝 Creating client .env file...');
  const clientEnvContent = `REACT_APP_BASE_URL=http://localhost:4000
`;
  fs.writeFileSync(clientEnvPath, clientEnvContent);
  console.log('✅ Client .env file created!');
} else {
  console.log('✅ Client .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Update the .env files with your actual configuration values');
console.log('2. Install dependencies: npm install && cd server && npm install');
console.log('3. Start MongoDB (local or use MongoDB Atlas)');
console.log('4. Run sample data: cd server && npm run seed');
console.log('5. Start the application: npm run dev');
console.log('\n�� Happy coding!'); 