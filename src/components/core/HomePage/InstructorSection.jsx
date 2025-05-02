import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from "../HomePage/Button"
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='mt-16 sm:mt-24 lg:mt-32 px-4 sm:px-6 lg:px-8'>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">

        {/* Instructor Image */}
        <div className="w-full lg:w-[50%] max-w-[500px] lg:max-w-none mx-auto">
          <img
            src={Instructor}
            alt="Instructor teaching online"
            className="shadow-white w-full h-auto object-contain"
          />
        </div>

        {/* Content Section */}
        <div className='w-full lg:w-[50%] flex flex-col gap-6 sm:gap-8 lg:gap-10'>
            <div className='text-3xl sm:text-4xl font-semibold w-full lg:w-[80%] text-center lg:text-left'>
                Become an
                <HighlightText text={"Instructor"} />
            </div>

            <p className='font-medium text-sm sm:text-base lg:text-[16px] w-full lg:w-[80%] text-richblack-300 text-center lg:text-left'>
              Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
            </p>

            <div className='w-fit mx-auto lg:mx-0'>
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