import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FaDownload, FaEye, FaReceipt } from "react-icons/fa"
import { formatDate } from "../../../services/formatDate"
import { apiConnector } from "../../../services/apiConnector"
import { studentEndpoints } from "../../../services/apis"

export default function PurchaseHistory() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [purchaseHistory, setPurchaseHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPurchaseHistory()
  }, [token])

  const fetchPurchaseHistory = async () => {
    try {
      setLoading(true)
      const response = await apiConnector(
        "GET",
        studentEndpoints.GET_PURCHASE_HISTORY_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )

      if (response.data.success) {
        setPurchaseHistory(response.data.data)
      } else {
        setError("Failed to fetch purchase history")
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error)
      setError("Failed to fetch purchase history")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-500"
      case "Pending":
        return "text-yellow-500"
      case "Failed":
        return "text-red-500"
      case "Refunded":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      case "Refunded":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchPurchaseHistory}
          className="bg-yellow-50 text-black px-4 py-2 rounded-md hover:bg-yellow-100"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-14">
        <h1 className="text-3xl font-medium text-richblack-5">Purchase History</h1>
        <p className="text-richblack-300 mt-2">
          View all your course purchases and transaction details
        </p>
      </div>

      {purchaseHistory.length === 0 ? (
        <div className="text-center py-10">
          <FaReceipt className="text-6xl text-richblack-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-richblack-100 mb-2">
            No Purchase History
          </h3>
          <p className="text-richblack-300 mb-6">
            You haven't made any purchases yet. Start learning by enrolling in courses!
          </p>
          <button
            onClick={() => navigate("/catalog/web-development")}
            className="bg-yellow-50 text-black px-6 py-3 rounded-md hover:bg-yellow-100 font-medium"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {purchaseHistory.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-richblack-800 rounded-lg p-6 border border-richblack-700 hover:border-richblack-600 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Course Details */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={transaction.courseDetails?.thumbnail}
                    alt={transaction.courseDetails?.courseName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-richblack-5 mb-1">
                      {transaction.courseDetails?.courseName}
                    </h3>
                    <p className="text-richblack-300 text-sm mb-2">
                      Instructor: {transaction.courseDetails?.instructorName}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-richblack-400">
                      <span>Order ID: {transaction.orderId}</span>
                      <span>Payment ID: {transaction.paymentId}</span>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-50">
                      ₹{transaction.amount}
                    </p>
                    <p className="text-sm text-richblack-400">
                      {transaction.currency}
                    </p>
                  </div>
                  
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>
                  
                  <p className="text-sm text-richblack-400">
                    {formatDate(transaction.transactionDate)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-richblack-700">
                <div className="flex items-center gap-2 text-sm text-richblack-400">
                  <span>Payment Method: {transaction.paymentMethod}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/courses/${transaction.courseId}`)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-richblack-700 text-richblack-100 rounded-md hover:bg-richblack-600 transition-colors"
                  >
                    <FaEye />
                    View Course
                  </button>
                  
                  <button
                    onClick={() => navigate(`/dashboard/enrolled-courses`)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-50 text-black rounded-md hover:bg-yellow-100 transition-colors"
                  >
                    <FaDownload />
                    Go to Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {purchaseHistory.length > 0 && (
        <div className="mt-8 p-6 bg-richblack-800 rounded-lg border border-richblack-700">
          <h3 className="text-lg font-semibold text-richblack-5 mb-4">
            Purchase Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-50">
                {purchaseHistory.length}
              </p>
              <p className="text-sm text-richblack-400">Total Purchases</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                ₹{purchaseHistory.reduce((sum, t) => sum + t.amount, 0)}
              </p>
              <p className="text-sm text-richblack-400">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {purchaseHistory.filter(t => t.status === "Completed").length}
              </p>
              <p className="text-sm text-richblack-400">Successful Payments</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 