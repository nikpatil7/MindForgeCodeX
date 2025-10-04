import React from 'react'

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData.heading;
  
  return (
    <button
    className={`w-full max-w-[360px] p-6 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
      isActive
        ? 'bg-white shadow-[12px_12px_0px] shadow-yellow-50 hover:bg-richblack-5 hover:shadow-[14px_14px_0px] hover:shadow-yellow-100 transform hover:-translate-y-1'
        : 'bg-richblack-800 hover:bg-richblack-700 border border-richblack-600 hover:border-yellow-400/30 hover:shadow-lg hover:shadow-yellow-400/10'
    }`}
      onClick={() => setCurrentCard(cardData.heading)}
      aria-current={isActive ? "true" : "false"}
    >
      <div className="flex flex-col gap-4 h-full">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h3 className={`text-xl font-bold ${
            isActive ? 'text-richblack-900' : 'text-richblack-5'
          }`}>
            {cardData.heading}
          </h3>
          <p className={`text-sm ${
            isActive ? 'text-richblack-700' : 'text-richblack-300'
          }`}>
            {cardData.description}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="mt-auto flex gap-3 px-3 py-1">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? 'bg-yellow-100 text-richblack-900'
              : 'bg-richblack-700 text-yellow-100'
          }`}>
            
            {cardData.level}
          </span>

          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? 'bg-yellow-100 text-richblack-900'
              : 'bg-richblack-700 text-blue-100'
          }`}>
            {cardData.lessionNumber} Lessons
          </span>
          
        </div>
      </div>
    </button>
  );
};





export default CourseCard

