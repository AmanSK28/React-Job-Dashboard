// Import React library
import React from "react";
// Import the BarChart component
import BarChart from "./components/BarChart";

function App() {
  return (
    // Center the chart on the page with some spacing
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <BarChart />
    </div>
  );
}

export default App; // Export the main App component
