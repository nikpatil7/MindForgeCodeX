import React from 'react'
import CTAButton from '../HomePage/Button'
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'

const CodeBlocks = ({
  position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor 
}) => {
  return (
    <div className={`flex ${position} flex-col lg:flex-row my-10 sm:my-16 lg:my-20 justify-between gap-8 lg:gap-10`}>
      
      {/* Section 1 - Content */}
      <div className="w-full lg:w-[50%] flex flex-col gap-4 sm:gap-6 lg:gap-8">
        {heading}

        <div className="text-richblack-300 font-bold text-sm sm:text-base">
          {subheading}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 mt-4 sm:mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 items-center justify-center sm:justify-start w-full sm:w-auto">
              {ctabtn1.btnText}
              <FaArrowRight className="text-xs sm:text-sm" />
            </div>
          </CTAButton>

          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            <div className="text-center sm:text-left w-full sm:w-auto">
              {ctabtn2.btnText}
            </div>
          </CTAButton>
        </div>
      </div>

      {/* Section 2 - Code Block */}
      <div className="w-full lg:w-[50%] h-fit code-border flex flex-row text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative py-4">
        {backgroundGradient}

        {/* Line Numbers */}
        <div className="text-center flex flex-col w-[10%] select-none text-richblack-400 font-inter font-bold">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
            <p key={num}>{num}</p>
          ))}
        </div>

        {/* Code Content */}
        <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
          <TypeAnimation
            sequence={[codeblock, 2000, ""]}
            repeat={Infinity}
            cursor={true}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeBlocks