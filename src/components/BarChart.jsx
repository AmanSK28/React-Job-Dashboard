import React from "react";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
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
  // **Hardcoded Sample Data for Staging**
  const chartData = {
    labels: ["Python", "AWS", "React", "SQL", "Docker"],
    datasets: [
      {
        label: "Most Required Software Engineering Tools",
        data: [15, 12, 9, 8, 7], // Example counts
        backgroundColor: ["#34D399", "#3B82F6", "#FBBF24", "#F87171", "#A78BFA"],
      },
    ],
  };

  return (
    <div className="w-1/2 mx-auto mt-10">
      <h2 className="text-xl font-bold text-center mb-4">
        Most Required Software Engineering Tools
      </h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
