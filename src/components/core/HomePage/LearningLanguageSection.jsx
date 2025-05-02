import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "../HomePage/Button"

const LearningLanguageSection = () => {
  return (
    <div className='mt-16 sm:mt-[100px] lg:mt-[130px] mb-16 sm:mb-24 lg:mb-32 px-4 sm:px-0'>
      <div className='flex flex-col gap-3 sm:gap-5 items-center'>
        
        <div className='text-2xl sm:text-3xl lg:text-4xl font-semibold text-center px-2 sm:px-0'>
          Your Swiss Knife for 
          <HighlightText text={"learning any language"}/>
        </div>

        <div className='text-center text-richblack-600 mx-auto text-sm sm:text-base font-medium w-full sm:w-[90%] lg:w-[70%] px-2 sm:px-0'>
          Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className='flex flex-col lg:flex-row items-center justify-center mt-5 lg:mt-8 gap-4 sm:gap-0'>
          <div className='relative lg:-mr-32 order-1 lg:order-none'>
            <img 
              src={know_your_progress}
              alt="KnowYourProgressImage"
              className='object-contain w-full max-w-[280px] sm:max-w-none'
            />
          </div>
          <div className='relative order-3 lg:order-none'>
            <img 
              src={compare_with_others}
              alt="CompareWithOthersImage"
              className='object-contain w-full max-w-[280px] sm:max-w-none'
            />
          </div>
          <div className='relative lg:-ml-32 order-2 lg:order-none'>
            <img 
              src={plan_your_lesson}
              alt="PlanYourLessonImage"
              className='object-contain w-full max-w-[280px] sm:max-w-none'
            />
          </div>
        </div>

        <div className='w-fit mt-6 sm:mt-8'>
          <CTAButton active={true} linkto={"/signup"}>
            <div>
              Learn more
            </div>
          </CTAButton>
        </div>

      </div>
    </div>
  )
}

export default LearningLanguageSection