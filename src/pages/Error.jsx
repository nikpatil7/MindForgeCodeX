import React from 'react'
import { Link } from 'react-router-dom'
import { BiError } from 'react-icons/bi'

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-richblack-900">
      <BiError className="text-6xl text-yellow-400 mb-4" />
      <h1 className="text-4xl font-bold text-white mb-2">404 - Not Found</h1>
      <p className="text-lg text-richblack-100 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-yellow-400 text-richblack-900 rounded-md font-semibold hover:bg-yellow-300 transition"
      >
        Go Home
      </Link>
    </div>
  )
}

export default Error
