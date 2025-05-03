import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import Footer from "../components/Common/Footer";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Section 1 */}
      <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
        {/* Become a Instructor Button */}
        <Link to={"/signup"}>
          <div className="group mt-8 sm:mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex flex-row items-center gap-2 rounded-full px-6 sm:px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p className="text-sm sm:text-base">Become an Instructor</p>
              <FaArrowRight className="text-xs sm:text-sm" />
            </div>
          </div>
        </Link>

        {/* Heading */}
        <div className="text-center text-2xl sm:text-3xl lg:text-4xl font-semibold mt-5 sm:mt-7 px-2 sm:px-0">
          Empower your future with <HighlightText text={"Coding Skills"} />
        </div>
        
        {/* Sub Heading */}
        <div className="mt-3 sm:mt-4 w-full sm:w-[90%] text-center text-sm sm:text-base lg:text-lg font-bold text-richblack-300 px-2 sm:px-0">
          Master in-demand tech skills with our online coding courses. Through
          hands-on projects, expert mentorship, and real-world applications, we
          help beginners and professionals alike build career-ready expertise at
          their own pace. Transform your potential into marketable skills.
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 mt-6 sm:mt-8 w-full sm:w-auto justify-center">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        {/* Video */}
        <div className="mx-3 my-8 sm:my-12 shadow-[5px_-5px_30px_-5px] sm:shadow-[10px_-5px_50px_-5px] shadow-blue-200 w-full max-w-4xl">
          <video 
            className="shadow-[10px_10px_rgba(255,255,255)] sm:shadow-[20px_20px_rgba(255,255,255)] w-full" 
            muted 
            loop 
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* Code Sections */}
        <div className="w-full space-y-12 sm:space-y-16 lg:space-y-20">
          <CodeBlocks
            position={"flex-col lg:flex-row"}
            heading={
              <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center lg:text-left">
                Unlock your 
                <HighlightText text={"coding potential"} /> with our
                online courses.
              </div>
            }
            subheading={
              <p className="text-sm sm:text-base text-center lg:text-left text-richblack-300 mt-2 sm:mt-4">
                Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.
              </p>
            }
            ctabtn1={{
              btnText: "try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>My First Webpage</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Welcome to Coding!</h1>\n  <p>Start your web development journey today.</p>\n</body>\n</html>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={<div className="codeblock1 absolute inset-0 w-full h-full"></div>}
          />

          <CodeBlocks
            position={"flex-col lg:flex-row-reverse"}
            heading={
              <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center lg:text-left w-full lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              <p className="text-sm sm:text-base text-center lg:text-left text-richblack-300 mt-2 sm:mt-4">
                Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson.
              </p>
            }
            ctabtn1={{
              btnText: "try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head>\n  <title>Example</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1><a href="/">Header</a></h1>\n  <nav><a href="one/">One</a></nav>\n</body>\n</html>`}
            codeColor={"text-blue-25"}
            backgroundGradient={<div className="codeblock2 absolute inset-0 w-full h-full"></div>}
          />
        </div>
        
        {/* Explore Section */}
        <ExploreMore />
      </div>

      {/* Section 2 */}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[200px] sm:h-[250px] lg:h-[320px]">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto">
            <div className="h-[50px] sm:h-[100px] lg:h-[150px]"></div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 text-white">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2 sm:gap-3">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>

              <CTAButton active={false} linkto={"/signup"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
          <div className="flex flex-col lg:flex-row gap-5 mb-10 mt-[50px] sm:mt-[70px] lg:mt-20 lg:gap-0 w-full">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold lg:w-[45%] text-center lg:text-left">
              Get the Skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className="flex flex-col gap-6 lg:gap-10 lg:w-[40%] items-center lg:items-start">
              <div className="text-sm sm:text-base text-center lg:text-left">
                The modern MindForge is the dictates its own terms. Today, to be
                a competitive specialist requires more than professional skills.
              </div>

              <CTAButton active={true} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton>
            </div>
          </div>

          {/* Timeline Section */}
          <TimelineSection />

          {/* Learning Language Section */}
          <LearningLanguageSection />
        </div>
      </div>

      {/* Section 3 */}
      <div className="relative w-11/12 mx-auto my-12 sm:my-20 flex max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Become a instructor section */}
        <InstructorSection />

        {/* Reviews from Other Learner */}
        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-semibold mt-8 sm:mt-10">
          Reviews from Other Learners
        </h2>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;