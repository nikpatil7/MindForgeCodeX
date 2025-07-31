// import React from 'react'
// import { Swiper, SwiperSlide } from "swiper/react"
// import "swiper/css"
// import "swiper/css/pagination"
// import { Pagination, Autoplay } from 'swiper/modules'
// import { RatingStars } from '../../Common/RatingStars'

// const reviews = [
//   {
//     id: 1,
//     name: "Sarah Johnson",
//     role: "Web Developer",
//     rating: 4.8,
//     review: "MindForge transformed my coding journey. The hands-on projects and expert instructors helped me land my dream job as a web developer. Highly recommended!",
//     avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
//   },
//   {
//     id: 2,
//     name: "Michael Chen",
//     role: "Software Engineer",
//     rating: 4.9,
//     review: "The quality of courses here is exceptional. I learned more in 6 months than I did in 2 years of self-study. The community support is amazing too.",
//     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
//   },
//   {
//     id: 3,
//     name: "Emily Rodriguez",
//     role: "Frontend Developer",
//     rating: 4.7,
//     review: "As a complete beginner, I was worried about learning to code. MindForge made it so accessible and fun. Now I'm building websites for clients!",
//     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
//   },
//   {
//     id: 4,
//     name: "David Kim",
//     role: "Full Stack Developer",
//     rating: 4.8,
//     review: "The instructors are industry professionals who really know their stuff. The projects are practical and helped me build a strong portfolio.",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
//   },
//   {
//     id: 5,
//     name: "Lisa Thompson",
//     role: "UI/UX Designer",
//     rating: 4.6,
//     review: "I wanted to learn coding to complement my design skills. MindForge's courses are perfectly structured for designers who want to code.",
//     avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
//   }
// ]

// const ReviewSlider = () => {
//   return (
//     <div className="w-full max-w-6xl mx-auto px-4 py-8">
//       <Swiper
//         slidesPerView={1}
//         spaceBetween={30}
//         loop={true}
//         autoplay={{
//           delay: 5000,
//           disableOnInteraction: false,
//         }}
//         pagination={{
//           clickable: true,
//           dynamicBullets: true,
//         }}
//         modules={[Pagination, Autoplay]}
//         breakpoints={{
//           640: {
//             slidesPerView: 2,
//           },
//           1024: {
//             slidesPerView: 3,
//           },
//         }}
//         className="review-swiper"
//       >
//         {reviews.map((review) => (
//           <SwiperSlide key={review.id}>
//             <div className="bg-richblack-800 rounded-lg p-6 h-full flex flex-col">
//               {/* Rating */}
//               <div className="flex items-center gap-2 mb-4">
//                 <RatingStars Review_Count={review.rating} Star_Size={16} />
//                 <span className="text-yellow-100 text-sm font-medium">
//                   {review.rating}
//                 </span>
//               </div>
              
//               {/* Review Text */}
//               <p className="text-richblack-200 text-sm leading-relaxed flex-grow mb-6">
//                 "{review.review}"
//               </p>
              
//               {/* Author Info */}
//               <div className="flex items-center gap-3 mt-auto">
//                 <img
//                   src={review.avatar}
//                   alt={review.name}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//                 <div>
//                   <h4 className="text-richblack-5 font-semibold text-sm">
//                     {review.name}
//                   </h4>
//                   <p className="text-richblack-300 text-xs">
//                     {review.role}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   )
// }

// export default ReviewSlider 
import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination, Autoplay } from "swiper/modules"
import { RatingStars } from "../../Common/RatingStars"
import { apiConnector } from "../../../services/apiConnector"
import { ratingsEndpoints } from "../../../services/apis"

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
        if (data?.success) setReviews(data?.data)
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      }
    })()
  }, [])

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10">
      <Swiper
        loop={reviews.length > 3}
        slidesPerView={Math.min(reviews.length, 3)}
        spaceBetween={30}
        // slidesPerView={1}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Pagination, Autoplay]}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="bg-richblack-800 border border-richblack-700 rounded-2xl shadow-md p-6 h-full flex flex-col gap-4 hover:scale-[1.015] transition-transform duration-300">
              
              {/* Top: Avatar, Name, Designation */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    review?.user?.image
                      ? review.user.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                  }
                  alt="Reviewer"
                  className="w-12 h-12 rounded-full object-cover border border-richblack-700"
                />
                <div>
                  <h4 className="text-richblack-5 text-sm font-semibold">
                    {review?.user?.firstName || "Anonymous"} {review?.user?.lastName || ""}
                  </h4>
                  <p className="text-richblack-400 text-xs">
                    {review?.course?.courseName || "Learner"}
                  </p>
                </div>
              </div>

              {/* Middle: Review Text */}
              <p className="text-richblack-200 text-sm leading-relaxed italic">
                "{review?.review || "No comment provided."}"
              </p>

              {/* Bottom: Stars + Rating */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-richblack-600">
                <div className="flex items-center gap-2 mt-2">
                  <RatingStars Review_Count={review.rating} Star_Size={18} />
                  <span className="text-yellow-100 text-sm font-semibold">{review.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default ReviewSlider
