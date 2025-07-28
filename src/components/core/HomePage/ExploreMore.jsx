import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsName = [
  "Free Courses",
  "New to Programming",
  "Most Popular",
  "Specialized Skills",
  "Career Tracks", 
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0]?.courses || []);
  const [currentCard, setCurrentCard] = useState(HomePageExplore[0]?.courses?.[0]?.heading || '');

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    
    if (result.length > 0 && result[0].courses && result[0].courses.length > 0) {
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0].heading);
    } else {
      // Fallback to first available courses if the selected tab has no courses
      setCourses(HomePageExplore[0].courses);
      setCurrentCard(HomePageExplore[0].courses[0].heading);
    }
  }

  return (
    <div className="mt-16 sm:mt-24">
      {/* Heading */}
      <div className="text-3xl sm:text-4xl font-semibold text-center mb-4">
        Unlock the
        <HighlightText text={"Power of Code"} />
      </div>

      {/* Subheading */}
      <p className="text-center text-richblack-300 text-sm sm:text-base mt-3 mb-8">
        Learn to Build Anything You Can Imagine
      </p>

      {/* Responsive Tabs */}
      <div className="flex flex-wrap justify-center sm:justify-start rounded-full bg-richblack-800 mb-5 border-richblack-100 mt-5 px-1 py-1">
  {tabsName.map((element, index) => {
    return (
      <div
        className={`text-[14px] sm:text-[16px] flex items-center gap-2 ${
          currentTab === element
            ? "bg-richblack-900 text-richblack-5 font-medium"
            : "text-richblack-200"
        } rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-4 sm:px-7 py-2 m-1`}
        key={index}
        onClick={() => setMyCards(element)}
      >
        {element}
      </div>
    );
  })}
</div> {/* todo: do work on tabs they are not responsive,,, also third tab is not clickable fix code issue logic for courses onclick function */}


      {/* Cards Section - Modified without horizontal scroll */}
      <div className="w-full mt-10">
        {courses.length > 0 ? (
          <>
            {/* Mobile: Stacked cards */}
            <div className="lg:hidden flex flex-col items-center gap-6 px-4 mb-10">
              {courses.map((element, index) => (
                <div key={index} className="w-full max-w-[360px]">
                  <CourseCard
                    cardData={element}
                    currentCard={currentCard}
                    setCurrentCard={setCurrentCard}
                  />
                </div>
              ))}
            </div>

            {/* Desktop: Original horizontal layout */}
            <div className="hidden lg:block h-[150px]">
              <div className="absolute flex flex-row gap-8 justify-between w-full px-4 mt-5  right-0 left-0 mr-auto ml-auto">
                {courses.map((element, index) => (
                  <CourseCard
                    key={index}
                    cardData={element}
                    currentCard={currentCard}
                    setCurrentCard={setCurrentCard}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-richblack-300 py-8">
            <p>No courses available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExploreMore;