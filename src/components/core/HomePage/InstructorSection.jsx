import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from "../HomePage/Button"
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='mt-16 sm:mt-24 lg:mt-32 px-4 sm:px-6 lg:px-8'>
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
        
        {/* Image Section - First in DOM but appears second on mobile due to flex-col */}
        <div className="w-full lg:w-[50%] max-w-[500px] lg:max-w-none mx-auto order-2 lg:order-1">
          <img
            src={Instructor}
            alt="Instructor teaching online"
            className="shadow-white w-full h-auto object-cover aspect-[3/4] sm:aspect-auto"
          />
          
          {/* Button - Only visible on mobile */}
          <div className='lg:hidden w-full mt-6 text-center'>
            <CTAButton active={true} linkto={"/signup"}>
              <div className='flex flex-row gap-2 items-center justify-center'>
                Start Teaching Today
                <FaArrowRight className="text-xs sm:text-sm" />
              </div>
            </CTAButton>
          </div>
        </div>

        {/* Content Section - Second in DOM but appears first on mobile due to flex-col */}
        <div className='w-full lg:w-[50%] flex flex-col gap-6 sm:gap-8 lg:gap-10 order-1 lg:order-2'>
            <div className='text-3xl sm:text-4xl font-semibold w-full lg:w-[80%] text-center lg:text-left'>
                Become an
                <HighlightText text={"Instructor"} />
            </div>

            <p className='font-medium text-sm sm:text-base lg:text-[16px] w-full lg:w-[80%] text-richblack-300 text-center lg:text-left'>
              Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
            </p>

            {/* Button - Hidden on mobile, visible on larger screens */}
            <div className='hidden lg:block w-fit mx-auto lg:mx-0'>
                <CTAButton active={true} linkto={"/signup"}>
                    <div className='flex flex-row gap-2 items-center'>
                        Start Teaching Today
                        <FaArrowRight className="text-xs sm:text-sm" />
                    </div>
                </CTAButton>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection