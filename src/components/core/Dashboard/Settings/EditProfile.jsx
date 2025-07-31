import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../Common/IconBtn";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitProfileForm = async (data) => {
    try {
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitProfileForm)}
      className="w-full max-w-3xl mx-auto bg-richblack-800 rounded-md border border-richblack-700 p-6 md:p-8 flex flex-col gap-y-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>
      {/* Row 1 */}
      <div className="flex flex-col gap-5 md:flex-row">
        {/* First Name */}
        <div className="flex flex-col gap-2 md:w-1/2">
          <label htmlFor="firstName" className="mb-1 text-sm font-medium text-richblack-5">
            First Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Enter first name"
            className="
              w-full rounded-md bg-richblack-800 px-4 py-3 text-richblack-5
              placeholder:text-richblack-400 border border-richblack-700
              focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200
              outline-none transition duration-200 ease-in-out shadow-sm
            "
            {...register("firstName", { required: true })}
            defaultValue={user?.firstName}
          />
          {errors.firstName && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your first name.
            </span>
          )}
        </div>
        {/* Last Name */}
        <div className="flex flex-col gap-2 md:w-1/2">
          <label htmlFor="lastName" className="mb-1 text-sm font-medium text-richblack-5">
            Last Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Enter last name"
            className="
              w-full rounded-md bg-richblack-800 px-4 py-3 text-richblack-5
              placeholder:text-richblack-400 border border-richblack-700
              focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200
              outline-none transition duration-200 ease-in-out shadow-sm
            "
            {...register("lastName", { required: true })}
            defaultValue={user?.lastName}
          />
          {errors.lastName && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your last name.
            </span>
          )}
        </div>
      </div>
      {/* Row 2 */}
      <div className="flex flex-col gap-5 md:flex-row">
        {/* Date of Birth */}
        <div className="flex flex-col gap-2 md:w-1/2">
          <label htmlFor="dateOfBirth" className="mb-1 text-sm font-medium text-richblack-5">
            Date of Birth <sup className="text-pink-200">*</sup>
          </label>
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            className="
              w-full rounded-md bg-richblack-800 px-4 py-3 text-richblack-5
              border border-richblack-700
              focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200
              outline-none transition duration-200 ease-in-out shadow-sm
            "
            {...register("dateOfBirth", {
              required: {
                value: true,
                message: "Please enter your Date of Birth.",
              },
              max: {
                value: new Date().toISOString().split("T")[0],
                message: "Date of Birth cannot be in the future.",
              },
            })}
            defaultValue={user?.additionalDetails?.dateOfBirth}
          />
          {errors.dateOfBirth && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              {errors.dateOfBirth.message}
            </span>
          )}
        </div>
        {/* Gender */}
        <div className="flex flex-col gap-2 md:w-1/2">
          <label htmlFor="gender" className="mb-1 text-sm font-medium text-richblack-5">
            Gender <sup className="text-pink-200">*</sup>
          </label>
          <select
            name="gender"
            id="gender"
            className="
              w-full rounded-md bg-richblack-800 px-4 py-3 text-richblack-5
              border border-richblack-700
              focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200
              outline-none transition duration-200 ease-in-out shadow-sm
            "
            {...register("gender", { required: true })}
            defaultValue={user?.additionalDetails?.gender}
          >
            {genders.map((ele, i) => (
              <option key={i} value={ele}>
                {ele}
              </option>
            ))}
          </select>
          {errors.gender && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please select your gender.
            </span>
          )}
        </div>
      </div>
      {/* Row 3 */}
      <div className="flex flex-col gap-5 md:flex-row">
        {/* Contact Number */}
        <div className="flex flex-col gap-2 md:w-1/2">
          <label htmlFor="contactNumber" className="mb-1 text-sm font-medium text-richblack-5">
            Contact Number <sup className="text-pink-200">*</sup>
          </label>
          <input
            type="tel"
            name="contactNumber"
            id="contactNumber"
            placeholder="Enter Contact Number"
            className="
              w-full rounded-md bg-richblack-800 px-4 py-3 text-richblack-5
              placeholder:text-richblack-400 border border-richblack-700
              focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200
              outline-none transition duration-200 ease-in-out shadow-sm
            "
            {...register("contactNumber", {
              required: {
                value: true,
                message: "Please enter your Contact Number.",
              },
              maxLength: { value: 12, message: "Invalid Contact Number" },
              minLength: { value: 10, message: "Invalid Contact Number" },
            })}
            defaultValue={user?.additionalDetails?.contactNumber}
          />
          {errors.contactNumber && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              {errors.contactNumber.message}
            </span>
          )}
        </div>
        {/* About */}
        <div className="flex flex-col gap-2 md:w-1/2">
          <label htmlFor="about" className="mb-1 text-sm font-medium text-richblack-5">
            About <sup className="text-pink-200">*</sup>
          </label>
          <input
            type="text"
            name="about"
            id="about"
            placeholder="Enter Bio Details"
            className="
              w-full rounded-md bg-richblack-800 px-4 py-3 text-richblack-5
              placeholder:text-richblack-400 border border-richblack-700
              focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200
              outline-none transition duration-200 ease-in-out shadow-sm
            "
            {...register("about", { required: true })}
            defaultValue={user?.additionalDetails?.about}
          />
          {errors.about && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your About.
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
        <IconBtn type="submit" text="Save" />
      </div>
    </form>
  );
}
