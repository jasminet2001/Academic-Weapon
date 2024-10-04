import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios"; // Import axios
import {
  Chart as ChartJS,
  CategoryScale, // Import CategoryScale for X-axis
  LinearScale, // Import LinearScale for Y-axis
  BarElement, // Import BarElement for line chart
  PointElement, // Import PointElement for points on the line chart
  Title,
  Tooltip, // Import Tooltip for hover info
  Legend, // Import Legend for chart legend
} from "chart.js";
import BottomNavbar from "./Navbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WorkTimeChart = () => {
  const [period, setPeriod] = useState("week"); // Manage period locally in this component
  const [workData, setWorkData] = useState([]);
  const [chartData, setChartData] = useState({});

  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    setLoading(true);
    const accessToken = localStorage.getItem("access_token");

    axios
      .get(`http://localhost:8000/api/accounts/work-time?period=${period}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const data = response.data;
        setWorkData(data);
        formatChartData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching work time data", error);
        setLoading(false);
      });
  }, [period]);

  const formatChartData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    let labels = [];
    if (period === "week") {
      labels = data.map((item) => item.date); // Keep dates for weekly view
    } else if (period === "month") {
      labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
    }

    const workTime = data.map((item) => item.workTime);

    setChartData({
      labels: labels, // Use different labels based on period
      datasets: [
        {
          label: "Work Time (hours)",
          data: workTime,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)", // Red
            "rgba(255, 159, 64, 0.6)", // Orange
            "rgba(255, 205, 86, 0.6)", // Yellow
            "rgba(75, 192, 192, 0.6)", // Green
            "rgba(54, 162, 235, 0.6)", // Blue
            "rgba(153, 102, 255, 0.6)", // Purple
            "rgba(201, 203, 207, 0.6)", // Grey
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 205, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(201, 203, 207, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div className="container">
      <div className="row justify-content-center" style={{ marginTop: "3rem" }}>
        <div
          className="card shadow-lg py-4 px-4 bg-light bg-opacity-100 w-100 mt-5"
          style={{ width: "25rem" }}
        >
          <h2>
            Work Time ({period.charAt(0).toUpperCase() + period.slice(1)})
          </h2>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <button
              onClick={() => setPeriod("week")}
              style={{
                marginRight: "10px",
                padding: "10px",
                background: period === "week" ? "#007bff" : "#1FBA07",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Weekly Work Time
            </button>
            <button
              onClick={() => setPeriod("month")}
              style={{
                padding: "10px",
                background: period === "month" ? "#007bff" : "#1FBA07",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Monthly Work Time
            </button>
          </div>
          {loading ? (
            <p>Loading chart...</p>
          ) : workData.length === 0 ? (
            <p>No data available for the selected period.</p>
          ) : (
            <Bar
              data={chartData}
              style={{ width: "70%", height: "400px", margin: "0 auto" }}
            />
          )}
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default WorkTimeChart;
