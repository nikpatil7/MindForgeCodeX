import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
      {loading ? (
        <div className="flex justify-center items-center h-16" aria-busy="true">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </div>
      ) : (
        <div className="max-w-[500px] w-full rounded-lg bg-richblack-800 shadow-lg p-6 lg:p-10">
          <h1 className="text-2xl font-bold text-richblack-5 mb-2">
            {!emailSent ? "Reset your password" : "Check email"}
          </h1>
          <p className="mb-6 text-base text-richblack-100">
            {!emailSent ? (
              "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery."
            ) : (
              <>
                We have sent the reset email to{" "}
                <span className="text-yellow-300 font-semibold break-all">{email}</span>
              </>
            )}
          </p>
          <form onSubmit={handleOnSubmit} className="space-y-4">
            {!emailSent && (
              <label htmlFor="email" className="block w-full">
                <span className="mb-1 block text-sm font-medium text-richblack-5">
                  Email Address <sup className="text-pink-200">*</sup>
                </span>
                <input
                  required
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
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
                  "
                />
              </label>
            )}
            <button
              type="submit"
              aria-label={!emailSent ? "Submit email for password reset" : "Resend password reset email"}
              className="mt-6 w-full rounded-md bg-yellow-50 py-3 px-4 font-semibold text-richblack-900 transition hover:bg-yellow-200"
            >
              {!emailSent ? "Submit" : "Resend Email"}
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
  );
};

export default ForgotPassword;
