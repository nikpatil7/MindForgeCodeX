import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-6"
    >
      {/* Email Field */}
      <label htmlFor="login-email" className="block w-full">
        <span className="mb-1 block text-sm font-medium text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </span>
        <input
          required
          id="login-email"
          type="email"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="
            w-full
            rounded-md
            bg-richblack-800
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
          "
        />
      </label>
      {/* Password Field */}
      <label htmlFor="login-password" className="relative block w-full">
        <span className="mb-1 block text-sm font-medium text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </span>
        <input
          required
          id="login-password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="
            w-full
            rounded-md
            bg-richblack-800
            px-4
            py-3
            pr-12
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
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100 hover:underline">
            Forgot Password?
          </p>
        </Link>
      </label>
      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 w-full rounded-md bg-yellow-50 py-3 px-4 font-semibold text-richblack-900 transition hover:bg-yellow-200"
      >
        Sign In
      </button>
    </form>
  )
}

export default LoginForm
