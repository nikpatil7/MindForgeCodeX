import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../Common/IconBtn";

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitPasswordForm = async (data) => {
    try {
      await changePassword(token, data);
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitPasswordForm)}
      className="w-full max-w-3xl mx-auto bg-richblack-800 rounded-md border border-richblack-700 p-6 md:p-8 flex flex-col gap-y-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
      <div className="flex flex-col gap-5 md:flex-row">
        {/* Old Password */}
        <div className="relative flex flex-col gap-2 md:w-1/2">
          <label htmlFor="oldPassword" className="mb-1 text-sm font-medium text-richblack-5">
            Current Password <sup className="text-pink-200">*</sup>
          </label>
          <input
            type={showOldPassword ? "text" : "password"}
            name="oldPassword"
            id="oldPassword"
            placeholder="Enter Current Password"
            className="
              w-full rounded-md bg-richblack-800 px-4 py-3 text-richblack-5
              placeholder:text-richblack-400 border border-richblack-700
              focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200
              outline-none transition duration-200 ease-in-out shadow-sm
            "
            {...register("oldPassword", { required: true })}
          />
          <span
            onClick={() => setShowOldPassword((prev) => !prev)}
            className="absolute right-4 top-[44px] z-10 cursor-pointer"
            tabIndex={0}
            aria-label="Toggle current password visibility"
          >
            {showOldPassword ? (
              <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={22} fill="#AFB2BF" />
            )}
          </span>
          {errors.oldPassword && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your Current Password.
            </span>
          )}
        </div>
        {/* New Password */}
        <div className="relative flex flex-col gap-2 md:w-1/2">
          <label htmlFor="newPassword" className="mb-1 text-sm font-medium text-richblack-5">
            New Password <sup className="text-pink-200">*</sup>
          </label>
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            id="newPassword"
            placeholder="Enter New Password"
            className="
              w-full rounded-md bg-richblack-800 px-4 py-3 text-richblack-5
              placeholder:text-richblack-400 border border-richblack-700
              focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200
              outline-none transition duration-200 ease-in-out shadow-sm
            "
            {...register("newPassword", { required: true })}
          />
          <span
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute right-4 top-[44px] z-10 cursor-pointer"
            tabIndex={0}
            aria-label="Toggle new password visibility"
          >
            {showNewPassword ? (
              <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={22} fill="#AFB2BF" />
            )}
          </span>
          {errors.newPassword && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your New Password.
            </span>
          )}
        </div>
      </div>
      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 transition hover:bg-richblack-600"
        >
          Cancel
        </button>
        <IconBtn type="submit" text="Update" />
      </div>
    </form>
  );
}
