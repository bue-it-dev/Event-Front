import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "./Home.css"; // Import the external CSS
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
const Home = () => {
  // State to store counts and lists for requests
  const [businessRequestCount, setBusinessRequestCount] = useState(0);
  const [homeRequestCount, setHomeRequestCount] = useState(0);
  const [businessList, setBusinessList] = useState([]);
  const [homeList, setHomeList] = useState([]);
  const [approvedbusinessList, setapprovedbusinessList] = useState([]);
  const [approvedhomeList, setapprovedhomeList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [businessApproval, setBusinessApproval] = useState({
    approvedCount: 0,
    rejectedCount: 0,
    pendingCount: 0,
  });
  const [homeApproval, setHomeApproval] = useState({
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  // Reusable function to fetch data from an API
  const fetchData = (url, stateSetter) => {
    axios
      .get(`${URL.BASE_URL}${url}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => stateSetter(response.data.data))
      .catch((error) => console.error(error));
  };
  // Fetch counts and top requests on component mount
  useEffect(() => {
    fetchData("/api/Dashboard/get-bussiness-count", setBusinessRequestCount);
    fetchData("/api/EventDashboard/get-events-count", setHomeRequestCount);
    fetchData("/api/EventDashboard/get-event-approvals-count", setHomeApproval);
    fetchData(
      "/api/Dashboard/get-approved-businessRequests",
      setBusinessApproval
    );
    fetchData("/api/EventDashboard/get-events-top-five", setHomeList);
    fetchData("/api/Dashboard/get-businessRequest-Top5", setBusinessList);
    fetchData("/api/EventDashboard/get-events-top-five", setapprovedhomeList);
    fetchData(
      "/api/Dashboard/get-approval-businessRequest-Top5",
      setapprovedbusinessList
    );
  }, []);
  const approvedPercentage = Math.round(
    (homeApproval.approved * 100) / homeRequestCount
  );
  const rejectedPercentage = Math.round(
    (homeApproval.rejected * 100) / homeRequestCount
  );
  const pendingPercentage = Math.round(
    (homeApproval.pending * 100) / homeRequestCount
  );
  // Pie chart data for requests and approvals
  const homeapprovalPieData = {
    labels: ["Approved Request", "Rejected Request", "Pending Request"],
    datasets: [
      {
        label: "Event Request Approval Count",
        data: [approvedPercentage, rejectedPercentage, pendingPercentage],
        backgroundColor: ["#4CAF50", "#E53935", "#FFC107"],
        hoverBackgroundColor: ["green", "red", "orange"],
      },
    ],
  };
  const Pieoptions = {
    plugins: {
      legend: {
        display: true,
        position: "left",
      },
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          size: 12,
        },
        formatter: (value, context) => {
          const data = context.chart.data.datasets[0].data;
          const total = data.reduce((sum, val) => sum + val, 0);
          const percentage = Math.round((value / total) * 100);
          return `${percentage}%`;
        },
      },
    },
  };

  const businesspprovalPieData = {
    labels: ["Approved Request", "Rejected Request", "Pending Request"],
    datasets: [
      {
        label: "Travel Request Approval Count",
        data: [
          businessApproval.approvedCount,
          businessApproval.rejectedCount,
          businessApproval.pendingCount,
        ],
        backgroundColor: ["#4CAF50", "#E53935", "#FFC107"],
        hoverBackgroundColor: ["green", "red", "orange"],
      },
    ],
  };

  // Render a table with given data and title
  const renderTable = (title, data, columns) => (
    <div className="recent-requests">
      <h5>{title}</h5>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((request, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{request.organizerName || "Unknown"}</td>
                <td>{request.title || "Unknown"}</td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                {request.status !== undefined && (
                  <td>{request.status === 1 ? "Approved" : "Rejected"}</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>No requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderApprovedTable = (title, data, columns) => (
    <div className="recent-requests">
      <p style={{ fontSize: "0.7erm" }}>{title}</p>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((request, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{request.title || "Unknown"}</td>
                <td>{request.organizerName || "Unknown"}</td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                {request.statusName !== undefined && (
                  <td>{request.statusName}</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>No requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="home-container">
        <div
          className="charts-container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <div
            className="col-md-6"
            style={{
              boxShadow: "0 4px 8px rgba(121, 121, 121, 0.1)",
              border: "1px solid #dbdbdb",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            {/* First row - Total Count */}
            <div
              style={{
                height: "60px",
                width: "100%",
                marginBottom: "20px",
                backgroundColor: "#57636f",
                color: "#fff",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                fontSize: "0.7rem",
              }}
            >
              <h6>
                Event Total Count: <br />
                <b>{homeRequestCount}</b>
              </h6>
            </div>

            {/* Second row - Approved, Rejected, Pending */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  height: "60px",
                  width: "32%",
                  marginBottom: "20px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "0.7rem",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h6>
                  Approved: <b>{homeApproval.approved}</b>
                </h6>
              </div>

              <div
                style={{
                  height: "60px",
                  width: "32%",
                  marginBottom: "20px",
                  backgroundColor: "darkred",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "0.7rem",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h6>
                  Rejected: <b>{homeApproval.rejected}</b>
                </h6>
              </div>

              <div
                style={{
                  height: "60px",
                  width: "32%",
                  marginBottom: "20px",
                  backgroundColor: "#FFC107",
                  color: "black",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "0.7rem",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h6>
                  Pending: <b>{homeApproval.pending}</b>
                </h6>
              </div>
            </div>
          </div>

          <div
            className="col-md-8 chart-container"
            // style={{}}
            style={{
              boxShadow: "0 4px 8px rgba(121, 121, 121, 0.1)",
              border: "1px solid #dbdbdb",
              borderRadius: "8px",
              paddingTop: "20px",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingBottom: "20px",
            }}
          >
            <h6>Event Request Approval Chart</h6>
            <Pie data={homeapprovalPieData} options={Pieoptions} />
          </div>
        </div>
      </div>

      <br />
      <div className="home-container">
        <div className="recent-claims-container">
          {renderApprovedTable(
            "Last 5 Submitted Event Requests",
            approvedhomeList,
            ["#", "Name", "Title", "Date of Submission", "Status"]
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
