// Import React and necessary hooks
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios"; // Import Axios for API requests

// Import and register necessary Chart.js components
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = () => {
  // State to store chart data
  const [chartData, setChartData] = useState({
    labels: ["Loading...", "Loading...", "Loading...", "Loading...", "Loading..."], // Placeholder labels
    datasets: [
      {
        label: "Fetching Data...",
        data: [5, 5, 5, 5, 5], // Placeholder bars
        backgroundColor: ["#d1d5db", "#d1d5db", "#d1d5db", "#d1d5db", "#d1d5db"], // Grey bars
      },
    ],
  });
  const [loading, setLoading] = useState(true);

  // Fetch job data from the API when the component loads
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const options = {
          method: "GET",
          url: "https://jsearch.p.rapidapi.com/search",
          params: {
            query: "Software Engineer",
            page: "1",
            num_pages: "3", // Reduced pages for faster response
          },
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        const jobs = response.data.data;

        if (!jobs || jobs.length === 0) {
          setLoading(false);
          return;
        }

        // Extract technologies
        const technologyKeywords = ["Python", "Java", "JavaScript", "React", "AWS", "SQL"];
        const techCounts = {};

        jobs.forEach((job) => {
          const description = job.job_description.toLowerCase();
          technologyKeywords.forEach((tech) => {
            if (description.includes(tech.toLowerCase())) {
              techCounts[tech] = (techCounts[tech] || 0) + 1;
            }
          });
        });

        const sortedTech = Object.entries(techCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        setChartData({
          labels: sortedTech.map(([tech]) => tech),
          datasets: [
            {
              label: "Most Required Software Engineering Tools",
              data: sortedTech.map(([_, count]) => count),
              backgroundColor: ["#34D399", "#3B82F6", "#FBBF24", "#F87171", "#A78BFA"],
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchJobData();
  }, []);

  return (
    <div className="w-1/2 mx-auto mt-10">
      <h2 className="text-xl font-bold text-center mb-4">
        Most Required Software Engineering Tools
      </h2>
      <Bar data={chartData} /> {/* Always show chart, even while loading */}
    </div>
  );
};

export default BarChart; // Export the component
