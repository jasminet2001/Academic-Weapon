import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const WorkTimeChart = () => {
  const [period, setPeriod] = useState("week");
  const [workData, setWorkData] = useState([]);
  const [chartData, setChartData] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const accessToken = localStorage.getItem("access_token");
    axios
      .get(`http://localhost:8000/api/accounts/work-time/?period=${period}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(response.data);
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
      setChartData({ labels: [], datasets: [] }); // Set default empty state
      return;
    }

    const labels = data.map((item) => item.date);
    const workTime = data.map((item) => item.workTime);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: "Work Time (hours)",
          data: workTime,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div>
      <h3>Work Time ({period.charAt(0).toUpperCase() + period.slice(1)})</h3>

      <div style={{ padding: "20px", textAlign: "center" }}>
        <button
          onClick={() => setPeriod("week")}
          style={{
            marginRight: "10px",
            padding: "10px",
            background: period === "week" ? "#007bff" : "#6c757d",
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
            background: period === "month" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Monthly Work Time
        </button>
      </div>

      {/* Show a loading message until data is available */}
      {loading ? <p>Loading chart...</p> : <Line data={chartData} />}
    </div>
  );
};

export default WorkTimeChart;
