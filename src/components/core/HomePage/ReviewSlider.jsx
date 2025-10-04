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
