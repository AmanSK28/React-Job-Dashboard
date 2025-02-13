// Import React and necessary hooks
import React, { useEffect, useState } from "react"

// Import chart library (Chart.js) and Bar component
import { Bar } from "react-chartjs-2"
import axios from "axios"

// Register Chart.js components
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const BarChart = () => {
  // State for chart data and loading
  const [chartData, setChartData] = useState({
    labels: ["Loading...", "Loading...", "Loading...", "Loading...", "Loading..."],
    datasets: [
      {
        label: "Fetching Data...",
        data: [5, 5, 5, 5, 5],
        backgroundColor: ["#d1d5db", "#d1d5db", "#d1d5db", "#d1d5db", "#d1d5db"],
      },
    ],
  })
  const [loading, setLoading] = useState(true)

  // Build chart data from jobs array
  const buildChartData = (jobs) => {
    const technologyKeywords = ["Python", "Java", "JavaScript", "React", "AWS", "SQL"]
    const techCounts = {}

    jobs.forEach((job) => {
      const description = job.job_description.toLowerCase()
      technologyKeywords.forEach((tech) => {
        if (description.includes(tech.toLowerCase())) {
          techCounts[tech] = (techCounts[tech] || 0) + 1
        }
      })
    })

    const sortedTech = Object.entries(techCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return {
      labels: sortedTech.map(([tech]) => tech),
      datasets: [
        {
          label: "Most Required Software Engineering Tools",
          data: sortedTech.map(([_, count]) => count),
          backgroundColor: ["#34D399", "#3B82F6", "#FBBF24", "#F87171", "#A78BFA"],
        },
      ],
    }
  }

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        // Check localStorage for cached data
        const cachedDataString = localStorage.getItem("jobDataCache")
        if (cachedDataString) {
          const cachedData = JSON.parse(cachedDataString)
          const isExpired = Date.now() - cachedData.timestamp > 60 * 60 * 1000

          if (!isExpired && cachedData?.jobs?.length > 0) {
            const chart = buildChartData(cachedData.jobs)
            setChartData(chart)
            setLoading(false)
            return
          }
        }

        // Fetch from API if no valid cache or it's expired
        const options = {
          method: "GET",
          url: "https://jsearch.p.rapidapi.com/search",
          params: {
            query: "Software Engineer",
            page: "1",
            num_pages: "3",
          },
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        }

        const response = await axios.request(options)
        const jobs = response.data.data

        if (!jobs || jobs.length === 0) {
          setLoading(false)
          return
        }

        const chart = buildChartData(jobs)
        setChartData(chart)

        // Cache the results with a timestamp
        localStorage.setItem(
          "jobDataCache",
          JSON.stringify({
            timestamp: Date.now(),
            jobs,
          })
        )

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchJobData()
  }, [])

  return (
    <div className="w-1/2 mx-auto mt-10">
      <h2 className="text-xl font-bold text-center mb-4">
        Most Required Software Engineering Tools
      </h2>
      {loading ? (
        <p className="text-center">Loading chart...</p>
      ) : (
        <Bar data={chartData} />
      )}
    </div>
  )
}

export default BarChart