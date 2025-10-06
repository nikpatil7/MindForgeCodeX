import "./App.css";
import {Route, Routes, useNavigate } from "react-router-dom";
// import Home from "./pages/Home"
import Navbar from "./components/Common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"

// import Login from "./pages/Login"
// import Signup from "./pages/Signup"
// import ForgotPassword from "./pages/ForgotPassword";
// import UpdatePassword from "./pages/UpdatePassword";
// import VerifyEmail from "./pages/VerifyEmail";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile";
// import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error"
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import PurchaseHistory from "./components/core/Dashboard/PurchaseHistory";
import { useDispatch, useSelector } from "react-redux";
 
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
// import Catalog from "./pages/Catalog";
// import CourseDetails from "./pages/CourseDetails";
// import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import { useEffect } from "react";
import { getUserDetails } from "./services/operations/profileAPI";
import MiniMentorWidget from "./components/core/MiniMentorWidget";

import React, { Suspense, lazy } from "react";

// Lazy load pages in groups

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Catalog = lazy(() => import("./pages/Catalog"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const ViewCourse = lazy(() => import("./pages/ViewCourse"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Auth group (login, signup, password reset, email verify)
const AuthPages = {
  Login: lazy(() => import("./pages/Login")),
  Signup: lazy(() => import("./pages/Signup")),
  ForgotPassword: lazy(() => import("./pages/ForgotPassword")),
  UpdatePassword: lazy(() => import("./pages/UpdatePassword")),
  VerifyEmail: lazy(() => import("./pages/VerifyEmail")),
};

// Loading component
const PageLoader = () => (
  <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
    <div className="spinner"></div>
  </div>
);


function App() {
    
  // const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user && !loading) {
      dispatch(getUserDetails(token, navigate));
    }
  }, [token, user, loading, dispatch, navigate]);
//   if (token && !user) {
//   // While user is being fetched
//   return <div className="text-white text-center mt-10">Loading...</div>
// }


  console.log("User: ", user);

    // Preload critical routes in background
  useEffect(() => {
    import("./pages/Dashboard");
    import("./pages/Catalog");
  }, []);
  
  // Show loading while fetching user data
  if (token && !user && loading) {
    return (
      <div className="w-screen min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="spinner mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-screen min-h-screen bg-richblack-900">
      <Navbar />
      <MiniMentorWidget />
      <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route
          path="signup"
          element={
            <OpenRoute>
              <AuthPages.Signup />
            </OpenRoute>
          }
        />

        <Route
          path="login"
          element={
            <OpenRoute>
              <AuthPages.Login />
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <AuthPages.ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <AuthPages.UpdatePassword />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <AuthPages.VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />

          <Route path="dashboard/Settings" element={<Settings />} />

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route
                path="dashboard/purchase-history"
                element={<PurchaseHistory />}
              />
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
      </Suspense>
    </div>
  );
}

export default App;
