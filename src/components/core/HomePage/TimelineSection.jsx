import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"

const timeline = [
  {
    Logo: Logo1,
    heading: "Leadership",
    Description: "Fully committed to the success of company",
  },
  {
    Logo: Logo2,
    heading: "Responsibility",
    Description: "Students will always be our top priority",
  },
  {
    Logo: Logo3,
    heading: "Flexibility",
    Description: "The ability to switch is an important skills",
  },
  {
    Logo: Logo4,
    heading: "Solve the problem",
    Description: "Code your way to a solution",
  },
]

const TimelineSection = () => {
  return (
    <div className="mt-16 sm:mt-24 lg:mt-32 px-4 sm:px-0">
      <div className='flex flex-col lg:flex-row gap-10 lg:gap-15 items-center'>

        {/* Timeline Items */}
        <div className='w-full lg:w-[45%] flex flex-col gap-5 lg:gap-8'>
          {
            timeline.map((element, index) => {
              return (
                <div className='flex flex-row gap-4 sm:gap-6 items-start' key={index}>
                  <div className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] bg-white p-1 sm:p-2 flex items-center justify-center shadow-md rounded-md'>
                    <img src={element.Logo} alt={`${element.heading} logo`} className='w-full h-full object-contain'/>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <h2 className='font-semibold text-base sm:text-[18px] leading-tight'>{element.heading}</h2>
                    <p className='text-sm sm:text-base text-richblack-300'>{element.Description}</p>
                  </div>
                </div>
              )
            })
          }
        </div>

        {/* Timeline Image */}
        <div className='relative w-full lg:w-auto shadow-blue-200'>
          <img 
            src={timelineImage}
            alt="Timeline"
            className='shadow-white object-cover w-full h-auto max-w-[600px] mx-auto'
          />

          <div className='absolute bg-caribbeangreen-700 flex flex-col sm:flex-row text-white uppercase py-4 sm:py-7
                        left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] sm:w-auto'>
            <div className='flex flex-row gap-3 sm:gap-5 items-center border-b sm:border-b-0 sm:border-r border-caribbeangreen-300 px-4 sm:px-7 pb-3 sm:pb-0'>
              <p className='text-2xl sm:text-3xl font-bold'>10</p>
              <p className='text-caribbeangreen-300 text-xs sm:text-sm'>Years of Experience</p>
            </div>

            <div className='flex gap-3 sm:gap-5 items-center px-4 sm:px-7 pt-3 sm:pt-0'>
              <p className='text-2xl sm:text-3xl font-bold'>250</p>
              <p className='text-caribbeangreen-300 text-xs sm:text-sm'>Type of Courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineSection