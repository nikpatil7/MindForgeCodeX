import { useSelector } from "react-redux"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

function Template({ title, description1, description2, image, formType, userType = 'student' }) {
  const { loading } = useSelector((state) => state.auth)

  // Dynamic text based on form type and user role
  const imageCaptions = {
    signup: {
      student: "Start your learning journey today",
      instructor: "Share your knowledge with the world"
    },
    login: {
      student: "Continue your educational growth",
      instructor: "Manage your courses and students"
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-richblack-900 p-4">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-12 py-8 md:flex-row md:gap-8">
          {/* Left Content */}
          <div className="flex w-full max-w-[500px] flex-col gap-6 md:gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-semibold text-richblack-5 md:text-4xl">
                {title}
              </h1>
              <p className="text-lg text-richblack-100">
                <span>{description1}</span>{" "}
                <span className="font-edu-sa font-bold italic text-blue-100">
                  {description2}
                </span>
              </p>
            </div>
            
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>

          {/* Right Image - Modern Card Style */}
          <div className="relative w-full max-w-[550px] overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
            <img
              src={image}
              alt={userType === 'instructor' ? "Instructors" : "Students"}
              className="aspect-[3/2] w-full object-cover"
              loading="lazy"
            />
            <div className="p-4 text-center">
              <p className="font-edu-sa italic text-richblack-700">
                {imageCaptions[formType][userType]}
              </p>
              <p className="mt-1 text-sm text-richblack-500">
                {formType === 'signup' 
                  ? 'Join our community of learners and educators' 
                  : 'Your next lesson awaits'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Template