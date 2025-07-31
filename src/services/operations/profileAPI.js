import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { setUser as setAuthUser } from "../../slices/authSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API } = profileEndpoints

export function getUserDetails(token, navigate) {
  return async (dispatch) => {

    const toastId =toast.loading("Loading your profile...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to fetch user details");
      }

       // Validate required fields
      // const userData = response.data.data;
      // if (!userData?.firstName) {
      //   throw new Error("Incomplete user data received from server");
      // }

      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;

        console.log('API response:', response.data.data);

      const userData = { ...response.data.data, image: userImage };
      dispatch(setUser(userData))
      dispatch(setAuthUser(userData)) // Also update auth slice
      localStorage.setItem("user", JSON.stringify(userData));
    }
    // catch (error) {
    //   dispatch(logout(navigate))
    //   console.log("GET_USER_DETAILS API ERROR............", error)
    //   toast.error("Could Not Get User Details")
    // }
        catch (error) {
      console.log("GET_USER_DETAILS API ERROR............", error)
      // Only logout for specific errors (like 401 Unauthorized)
      if (error.response?.status === 401) {
        dispatch(logout(navigate))
        toast.error("Session expired. Please login again.")
      } else {
        toast.error(error.message || "Could Not Get User Details")
      }
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");
    console.log(
      "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
      response
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
    console.log("Enrolled courses result:", result)
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }
  toast.dismiss(toastId)
  return result
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, 
    {
      Authorization: `Bearer ${token}`,
    })

    console.log("GET_INSTRUCTOR_API_RESPONSE", response);
    result = response?.data?.courses

  }
  catch(error) {
    console.log("GET_INSTRUCTOR_API ERROR", error);
    toast.error("Could not Get Instructor Data")
  }
  toast.dismiss(toastId);
  return result;
}