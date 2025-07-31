import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import CountryCode from "../../../data/countrycode.json"
import { apiConnector } from "../../../services/apiConnector"
import { contactusEndpoint } from "../../../services/apis"

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  const submitContactForm = async (data) => {
    try {
      setLoading(true)
      const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data)
      
      if (response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message || "Failed to send message")
      }
      setLoading(false)
    } catch (error) {
      console.log("ERROR MESSAGE: ", error.message)
      toast.error("Failed to send message. Please try again.")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      })
    }
  }, [reset, isSubmitSuccessful])

  return (
    <form
      className="w-full max-w-2xl mx-auto bg-richblack-800 rounded-xl shadow-lg p-8 flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}
    >
      <h2 className="text-2xl font-bold text-richblack-5 mb-2">Contact Us</h2>
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* first name */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="text-richblack-25 font-semibold">
            First Name <span className="text-pink-200">*</span>
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter first name"
            className="rounded-md bg-richblack-900 px-4 py-3 text-richblack-5 placeholder:text-richblack-400 border border-richblack-700 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition duration-200 ease-in-out shadow-sm"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your name.
            </span>
          )}
        </div>
        {/* last name */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="text-richblack-25 font-semibold">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter last name"
            className="rounded-md bg-richblack-900 px-4 py-3 text-richblack-5 placeholder:text-richblack-400 border border-richblack-700 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition duration-200 ease-in-out shadow-sm"
            {...register("lastname")}
          />
        </div>
      </div>
      {/* email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-richblack-25 font-semibold">
          Email Address <span className="text-pink-200">*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className="rounded-md bg-richblack-900 px-4 py-3 text-richblack-5 placeholder:text-richblack-400 border border-richblack-700 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition duration-200 ease-in-out shadow-sm"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Email address.
          </span>
        )}
      </div>
      {/* phone number */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="text-richblack-25 font-semibold">
          Phone Number <span className="text-pink-200">*</span>
        </label>
        <div className="flex gap-3">
          <select
            name="countrycode"
            id="countrycode"
            className="rounded-md bg-richblack-900 px-2 py-3 text-richblack-5 border border-richblack-700 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition duration-200 ease-in-out shadow-sm w-[90px]"
            {...register("countrycode", { required: true })}
          >
            {CountryCode.map((ele, index) => (
              <option key={index} value={ele.code}>
                {ele.code} - {ele.country}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="phonenumber"
            id="phonenumber"
            placeholder="12345 67890"
            className="flex-1 rounded-md bg-richblack-900 px-4 py-3 text-richblack-5 placeholder:text-richblack-400 border border-richblack-700 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition duration-200 ease-in-out shadow-sm"
            {...register("phoneNo", {
              required: {
                value: true,
                message: "Please enter your Phone Number.",
              },
              maxLength: { value: 12, message: "Invalid Phone Number" },
              minLength: { value: 10, message: "Invalid Phone Number" },
            })}
          />
        </div>
        {errors.phoneNo && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            {errors.phoneNo.message}
          </span>
        )}
      </div>
      {/* message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-richblack-25 font-semibold">
          Message <span className="text-pink-200">*</span>
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          className="rounded-md bg-richblack-900 px-4 py-3 text-richblack-5 placeholder:text-richblack-400 border border-richblack-700 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition duration-200 ease-in-out shadow-sm resize-none"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Message.
          </span>
        )}
      </div>
      {/* submit button */}
      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[15px] font-bold text-richblack-900 shadow-md transition-all duration-200 hover:scale-95 hover:shadow-none disabled:bg-richblack-500`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}

export default ContactUsForm
