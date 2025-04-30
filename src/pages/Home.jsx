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
import ExploreMore from "../components/core/HomePage/ExploreMore"


const Home = () => {
  return (
    <div>

      {/* Section 1 */}
      <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between ">
        {/* Become a Instructor Button */}
        <Link to={"/signup"}>
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Heading */}
        <div className="text-center text-4xl font-semibold mt-7 ">
          Empower your future with <HighlightText text={"Coding Skills"} />
        </div>
        {/* Sub Heading */}
        <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
          Master in-demand tech skills with our online coding courses. Through
          hands-on projects, expert mentorship, and real-world applications, we
          help beginners and professionals alike build career-ready expertise at
          their own pace. Transform your potential into marketable skills.
        </div>

        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        {/* Video */}
        <div className="mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video  className="shadow-[20px_20px_rgba(255,255,255)]" muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>


        {/* code section 1 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock your 
                <HighlightText text={"coding potential"} /> with our
                online courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
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
            codeblock={`<!DOCTYPE html>
              <html lang="en">
              <head>
                <title>My First Webpage</title>
                <link rel="stylesheet" href="styles.css">
              </head>
              <body>
                <h1>Welcome to Coding!</h1>
                <p>Start your web development journey today.</p>
              </body>
              </html>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
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
            codeblock={`<!DOCTYPE html>
                <html>
                <head>
                  <title>Example</title>
                  <link rel="stylesheet" href="styles.css">
                </head>
                <body>
                  <h1><a href="/">Header</a></h1>
                  <nav><a href="one/">One</a></nav>
                </body>
                </html>`}
            codeColor={"text-blue-25"}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>

        <ExploreMore />

      </div>

      {/* Section 2 */}
      <div className="bg-pure-greys-5 text-richblack-700 ">
        <div className="homepage_bg h-[320px]">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto">
          <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white  lg:mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-3">
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

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7 ">
          <div className="flex flex-row gap-5 mb-10 mt-[95px] justify-between lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%]">
              Get the Skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className="flex flex-col   gap-10 lg:w-[40%] items-start">
              <div className="text-[16px]">
                The modern MindForge is the dictates its own terms. Today, to be
                a competitive specialist requires more than professional skills.
              </div>

              <CTAButton active={true} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton>
            </div>
          </div>

          {/* Timeline Section - Section 2 */}
          <TimelineSection />

          {/* Learning Language Section - Section 3 */}
          <LearningLanguageSection />

        </div>
      </div>

      {/*Section 3 */}
      <div className="relative w-11/12 mx-auto my-20 flex max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white">
      {/* Become a instructor section */}
        <InstructorSection />

        {/* Reviews from Other Learner */}
        <h2 className="text-center text-4xl font-semobold mt-10">
          review from Other Learners
        </h2>
        
      </div>
      
      {/* footer: todo */}

      <Footer />


    </div>
  );
};

export default Home;
