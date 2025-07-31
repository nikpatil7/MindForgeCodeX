import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';
import { FaChartPie } from 'react-icons/fa';

export default function Instructor() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const [loading, setLoading] = useState(false)
    const [instructorData, setInstructorData] = useState(null)
    const [courses, setCourses] = useState([])
  
    useEffect(() => {
      ;(async () => {
        setLoading(true)
        const instructorApiData = await getInstructorData(token)
        const result = await fetchInstructorCourses(token)
        console.log(instructorApiData)
        if (instructorApiData.length) setInstructorData(instructorApiData)
        if (result) {
          setCourses(result)
        }
        setLoading(false)
      })()
    }, [token])
  
    const totalAmount = instructorData?.reduce(
      (acc, curr) => acc + curr.totalAmountGenerated,
      0
    )
  
    const totalStudents = instructorData?.reduce(
      (acc, curr) => acc + curr.totalStudentsEnrolled,
      0
    )
  
    return (
      <div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-richblack-5">
            Hi {user?.firstName} 👋
          </h1>
          <p className="font-medium text-richblack-200">
            Let's start something new
          </p>
        </div>
        {loading ? (
          <div className="spinner"></div>
        ) : courses.length > 0 ? (
          <div>
            <div className="my-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Render chart / graph */}
              {totalAmount > 0 || totalStudents > 0 ? (
                <div className="lg:col-span-2">
                  <InstructorChart courses={instructorData} />
                </div>
              ) : (
                <div className="lg:col-span-2 flex-1 rounded-xl bg-richblack-800 p-6 shadow-lg border border-richblack-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                      <FaChartPie className="text-xl text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-richblack-5">Analytics</h3>
                      <p className="text-sm text-richblack-300">Course performance insights</p>
                    </div>
                  </div>
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-richblack-700 flex items-center justify-center">
                        <FaChartPie className="text-2xl text-richblack-400" />
                      </div>
                      <p className="text-lg font-medium text-richblack-300">
                        No data available yet
                      </p>
                      <p className="text-sm text-richblack-400">
                        Create courses to see analytics
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Total Statistics */}
              <div className="flex flex-col rounded-xl bg-richblack-800 p-6 shadow-lg border border-richblack-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                    <FaChartPie className="text-xl text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-richblack-5">Statistics</h3>
                    <p className="text-sm text-richblack-300">Overview of your performance</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="rounded-lg bg-richblack-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-richblack-300">Total Courses</p>
                        <p className="text-2xl font-bold text-richblack-5">
                          {courses.length}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <span className="text-blue-500 text-lg font-bold">{courses.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-richblack-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-richblack-300">Total Students</p>
                        <p className="text-2xl font-bold text-richblack-5">
                          {totalStudents}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <span className="text-green-500 text-lg font-bold">{totalStudents}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-richblack-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-richblack-300">Total Income</p>
                        <p className="text-2xl font-bold text-richblack-5">
                          ₹{totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <span className="text-yellow-500 text-lg font-bold">₹</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-richblack-800 p-6 shadow-lg border border-richblack-700">
              {/* Render 3 courses */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                    <FaChartPie className="text-xl text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-richblack-5">Your Courses</h3>
                    <p className="text-sm text-richblack-300">Recent course performance</p>
                  </div>
                </div>
                <Link to="/dashboard/my-courses">
                  <button className="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-richblack-900 hover:bg-yellow-400 transition-colors">
                    View All
                  </button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.slice(0, 3).map((course) => (
                  <div key={course._id} className="group rounded-lg bg-richblack-700 p-4 hover:bg-richblack-600 transition-colors">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/60 to-transparent"></div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-richblack-5 line-clamp-2">
                        {course.courseName}
                      </h4>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-green-500 font-medium">
                            {course.studentsEnrolled?.length || 0} students
                          </span>
                        </div>
                        <span className="text-yellow-500 font-bold">
                          ₹{course.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
            <p className="text-center text-2xl font-bold text-richblack-5">
              You have not created any courses yet
            </p>
            <Link to="/dashboard/add-course">
              <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
                Create a course
              </p>
            </Link>
          </div>
        )}
      </div>
    )
  }