import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie, Doughnut } from "react-chartjs-2"
import { FaUsers, FaMoneyBillWave, FaChartPie, FaChartLine } from "react-icons/fa"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")
  const [chartType, setChartType] = useState("pie")

  // Enhanced color palette with better contrast
  const generateColors = (numColors, type = "students") => {
    const colorPalettes = {
      students: [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
        "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
      ],
      income: [
        "#2ECC71", "#E74C3C", "#F39C12", "#9B59B6", "#3498DB",
        "#1ABC9C", "#E67E22", "#34495E", "#16A085", "#8E44AD"
      ]
    }
    
    const palette = colorPalettes[type]
    const colors = []
    for (let i = 0; i < numColors; i++) {
      colors.push(palette[i % palette.length])
    }
    return colors
  }

  // Enhanced data preparation with better formatting
  const prepareChartData = (type) => {
    const filteredCourses = courses.filter(course => 
      type === "students" ? course.totalStudentsEnrolled > 0 : course.totalAmountGenerated > 0
    )

    if (filteredCourses.length === 0) {
      return {
        labels: ["No Data"],
        datasets: [{
          data: [1],
          backgroundColor: ["#6B7280"],
          borderWidth: 0
        }]
      }
    }

    const labels = filteredCourses.map(course => {
      const name = course.courseName.length > 20 
        ? course.courseName.substring(0, 20) + "..." 
        : course.courseName
      return name
    })

    const data = filteredCourses.map(course => 
      type === "students" ? course.totalStudentsEnrolled : course.totalAmountGenerated
    )

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: generateColors(filteredCourses.length, type),
        borderWidth: 2,
        borderColor: "#1F2937",
        hoverBorderWidth: 3,
        hoverBorderColor: "#F59E0B"
      }]
    }
  }

  // Enhanced chart options
  const getChartOptions = () => ({
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: "#E5E7EB",
          font: {
            size: 12,
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F59E0B',
        bodyColor: '#E5E7EB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            
            if (currChart === "students") {
              return `${label}: ${value} students (${percentage}%)`
            } else {
              return `${label}: ₹${value.toLocaleString()} (${percentage}%)`
            }
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  })

  const chartData = prepareChartData(currChart)

  return (
    <div className="flex flex-1 flex-col gap-6 rounded-xl bg-richblack-800 p-6 shadow-lg border border-richblack-700">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
            {currChart === "students" ? (
              <FaUsers className="text-xl text-yellow-500" />
            ) : (
              <FaMoneyBillWave className="text-xl text-yellow-500" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-richblack-5">
              {currChart === "students" ? "Student Distribution" : "Income Analysis"}
            </h3>
            <p className="text-sm text-richblack-300">
              {currChart === "students" 
                ? "Students enrolled per course" 
                : "Revenue generated per course"
              }
            </p>
          </div>
        </div>
        
        {/* Chart Type Toggle */}
        <div className="flex items-center gap-2 rounded-lg bg-richblack-700 p-1">
          <button
            onClick={() => setChartType("pie")}
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              chartType === "pie"
                ? "bg-yellow-500 text-richblack-900"
                : "text-richblack-300 hover:text-richblack-100"
            }`}
          >
            <FaChartPie className="text-sm" />
            Pie
          </button>
          <button
            onClick={() => setChartType("doughnut")}
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              chartType === "doughnut"
                ? "bg-yellow-500 text-richblack-900"
                : "text-richblack-300 hover:text-richblack-100"
            }`}
          >
            <FaChartLine className="text-sm" />
            Doughnut
          </button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrChart("students")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
            currChart === "students"
              ? "bg-yellow-500 text-richblack-900 shadow-lg"
              : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600 hover:text-richblack-100"
          }`}
        >
          <FaUsers className="text-sm" />
          Students
        </button>
        <button
          onClick={() => setCurrChart("income")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
            currChart === "income"
              ? "bg-yellow-500 text-richblack-900 shadow-lg"
              : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600 hover:text-richblack-100"
          }`}
        >
          <FaMoneyBillWave className="text-sm" />
          Income
        </button>
      </div>

      {/* Chart Container */}
      <div className="relative mx-auto w-full max-w-[400px] aspect-square">
        {chartData.labels[0] === "No Data" ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-richblack-700 flex items-center justify-center">
                <FaChartPie className="text-2xl text-richblack-400" />
              </div>
              <p className="text-lg font-medium text-richblack-300">
                No {currChart === "students" ? "students" : "income"} data available
              </p>
              <p className="text-sm text-richblack-400">
                Create courses to see analytics
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {chartType === "pie" ? (
              <Pie data={chartData} options={getChartOptions()} />
            ) : (
              <Doughnut 
                data={{
                  ...chartData,
                  datasets: [{
                    ...chartData.datasets[0],
                    cutout: '60%'
                  }]
                }} 
                options={getChartOptions()} 
              />
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {chartData.labels[0] !== "No Data" && (
        <div className="mt-4 rounded-lg bg-richblack-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-richblack-300">
                Total {currChart === "students" ? "Students" : "Income"}
              </p>
              <p className="text-xl font-bold text-richblack-5">
                {currChart === "students" 
                  ? chartData.datasets[0].data.reduce((a, b) => a + b, 0)
                  : `₹${chartData.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}`
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-richblack-300">
                Active Courses
              </p>
              <p className="text-xl font-bold text-yellow-500">
                {chartData.labels.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}