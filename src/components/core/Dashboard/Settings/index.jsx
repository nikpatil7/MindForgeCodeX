import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

export default function Settings() {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 py-10">
      <h1 className="mb-10 text-3xl md:text-4xl font-semibold text-richblack-5 text-center md:text-left">
        Edit Profile
      </h1>
      <div className="flex flex-col gap-8">
        <ChangeProfilePicture />
        <EditProfile />
        <UpdatePassword />
        <DeleteAccount />
      </div>
    </div>
  )
}
