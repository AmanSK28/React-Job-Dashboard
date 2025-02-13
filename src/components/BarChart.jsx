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
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch job data from the API when the component loads
  useEffect(() => {
    console.log("API Key Loaded:", import.meta.env.VITE_RAPIDAPI_KEY); // Debug API Key

    const fetchJobData = async () => {
      try {
        const options = {
          method: "GET",
          url: "https://jsearch.p.rapidapi.com/search",
          params: {
            query: "Software Engineer",
            page: "1",
            num_pages: "10", // Fetch more data for better accuracy
          },
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY, // Secure API key usage
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        console.log("API Response:", response.data); // Debug API response

        const jobs = response.data.data; // Extract job postings

        if (!jobs || jobs.length === 0) {
          console.warn("No job data found.");
          setLoading(false);
          return;
        }

        // List of technologies/tools to track in job descriptions
        const technologyKeywords = [
          "Python", "Java", "JavaScript", "React", "Node.js", "C++", "AWS",
          "Docker", "Kubernetes", "SQL", "Git", "CI/CD", "TypeScript", "Azure",
          "Linux", "Jenkins", "MongoDB", "PostgreSQL", "GraphQL", "Terraform"
        ];

        // Count occurrences of each technology in job descriptions
        const techCounts = {};
        jobs.forEach((job) => {
          const description = job.job_description.toLowerCase(); // Convert to lowercase for consistency
          technologyKeywords.forEach((tech) => {
            if (description.includes(tech.toLowerCase())) {
              techCounts[tech] = (techCounts[tech] || 0) + 1;
            }
          });
        });

        console.log("Extracted Technologies:", techCounts); // Debug extracted techs

        // Sort technologies by count and get top 5
        const sortedTech = Object.entries(techCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        // Prepare data for the bar chart
        setChartData({
          labels: sortedTech.map(([tech]) => tech), // Technology names
          datasets: [
            {
              label: "Most Required Software Engineering Tools",
              data: sortedTech.map(([_, count]) => count), // Count values
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

    fetchJobData(); // Call API function
  }, []);

  return (
    <div className="w-1/2 mx-auto mt-10">
      <h2 className="text-xl font-bold text-center mb-4">Most Required Software Engineering Tools</h2>
      {loading ? <p>Loading chart...</p> : chartData ? <Bar data={chartData} /> : <p>No data available.</p>}
    </div>
  );
};

export default BarChart; // Export the component
