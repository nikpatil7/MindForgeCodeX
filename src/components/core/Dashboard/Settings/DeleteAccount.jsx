import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { deleteProfile } from "../../../../services/operations/SettingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className="my-6 flex flex-col md:flex-row items-center gap-6 rounded-md border border-pink-700 bg-pink-900 p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-pink-700">
        <FiTrash2 className="text-3xl text-pink-200" />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-lg font-semibold text-richblack-5">
          Delete Account
        </h2>
        <div className="text-pink-25 text-sm md:w-4/5">
          <p className="mb-1">Are you sure you want to delete your account?</p>
          <p>
            This account may contain paid courses. Deleting your account is <span className="font-bold">permanent</span> and will remove all content associated with it.
          </p>
        </div>
        <button
          type="button"
          className="mt-2 w-fit cursor-pointer italic text-pink-300 hover:underline focus:underline focus:outline-none transition"
          onClick={handleDeleteAccount}
        >
          I want to delete my account.
        </button>
      </div>
    </div>
  )
}
