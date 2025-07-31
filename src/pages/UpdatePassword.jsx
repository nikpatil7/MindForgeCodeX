import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { resetPassword } from "../services/operations/authAPI"

const UpdatePassword = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { loading } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    const token = location.pathname.split("/").at(-1)
    dispatch(resetPassword(password, confirmPassword, token, navigate))
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
      {loading ? (
        <div className="flex justify-center items-center h-16" aria-busy="true">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </div>
      ) : (
        <div className="max-w-[500px] w-full rounded-lg bg-richblack-800 shadow-lg p-6 lg:p-10">
          <h1 className="text-2xl font-bold text-richblack-5 mb-2">
            Choose new password
          </h1>
          <p className="mb-6 text-base text-richblack-100">
            Almost done. Enter your new password and you're all set.
          </p>
          <form onSubmit={handleOnSubmit} className="space-y-5">
            <label className="block relative">
              <span className="mb-1 block text-sm font-medium text-richblack-5">
                New Password <sup className="text-pink-200">*</sup>
              </span>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                className="
                  w-full
                  rounded-md
                  bg-richblack-900
                  px-4
                  py-3
                  text-richblack-5
                  placeholder:text-richblack-400
                  border
                  border-richblack-700
                  focus:border-yellow-300
                  focus:ring-2
                  focus:ring-yellow-200
                  outline-none
                  transition
                  duration-200
                  ease-in-out
                  shadow-sm
                  pr-12
                "
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-[44px] z-10 cursor-pointer"
                tabIndex={0}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={22} fill="#AFB2BF" />
                )}
              </span>
            </label>
            <label className="block relative">
              <span className="mb-1 block text-sm font-medium text-richblack-5">
                Confirm New Password <sup className="text-pink-200">*</sup>
              </span>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="
                  w-full
                  rounded-md
                  bg-richblack-900
                  px-4
                  py-3
                  text-richblack-5
                  placeholder:text-richblack-400
                  border
                  border-richblack-700
                  focus:border-yellow-300
                  focus:ring-2
                  focus:ring-yellow-200
                  outline-none
                  transition
                  duration-200
                  ease-in-out
                  shadow-sm
                  pr-12
                "
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-[44px] z-10 cursor-pointer"
                tabIndex={0}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={22} fill="#AFB2BF" />
                )}
              </span>
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-yellow-50 py-3 px-4 font-semibold text-richblack-900 transition hover:bg-yellow-200"
            >
              Reset Password
            </button>
          </form>
          <div className="mt-8 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5 hover:underline">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdatePassword
