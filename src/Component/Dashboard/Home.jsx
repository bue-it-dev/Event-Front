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
    labels: ["Approved Request", "Rejected Request", "In Progress Request"],
    datasets: [
      {
        label: "Event Request Approval Count",
        data: [approvedPercentage, rejectedPercentage, pendingPercentage],
        backgroundColor: ["#4CAF50", "#E53935", "#d19d00"],
        hoverBackgroundColor: ["green", "red", "orange"],
      },
    ],
  };
  const Pieoptions = {
    plugins: {
      legend: {
        display: true,
        position: "left",
        font: {
          size: 13,
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          size: 13,
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
        backgroundColor: ["#4CAF50", "#E53935", "#d19d00"],
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
    <div
      style={{
        width: "100%",
        textAlign: "center",
        fontSize: "0.8rem",
        fontWeight: "normal",
      }}
      className="table-striped"
    >
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
                  <>
                    <td>{request.approvalName}</td>
                    <td>{request.statusName}</td>
                  </>
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
      <div className="container-fluid bg-white min-vh-100 py-5">
        {/* Main Content Container */}
        <div className="row mb-5">
          {/* Stats Cards Section - Takes 1/3 of width */}
          <div className="col-md-6">
            <div
              className="card border-0 shadow-lg h-100"
              style={{
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div>
                <p
                  className="card-title font-weight-bold text-dark text-center "
                  style={{ fontSize: "0.8rem", paddingTop: "25px" }}
                >
                  Request Count Distribution
                </p>
              </div>
              <div
                className="card-body"
                style={{
                  paddingTop: "30px",
                  paddingLeft: "50px",
                  paddingRight: "50px",
                }}
              >
                {/* First Row - Total Count */}
                <div
                  className="card mb-4 border-0 shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div className="card-body p-3">
                    <div>
                      <div>
                        <p
                          className="card-text text-muted text-uppercase font-weight-bold mb-2 text-center"
                          style={{
                            fontSize: "0.8rem",
                            letterSpacing: "0.5px",
                            width: "100%", // Ensures full width for centering
                          }}
                        >
                          Total Requests
                        </p>
                        <h3
                          className="card-title mb-0 font-weight-bold text-dark"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {homeRequestCount}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row - Status Cards */}
                <div className="row no-gutters">
                  {/* Approved Card */}
                  <div className="col-4 pr-1">
                    <div
                      className="card border-0 text-white text-center h-100"
                      style={{
                        // background:
                        //   "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        backgroundColor: "#4CAF50",
                        borderRadius: "16px",
                        boxShadow: "0 8px 16px rgba(16, 185, 129, 0.3)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-2px) scale(1.02)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 24px rgba(16, 185, 129, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 16px rgba(16, 185, 129, 0.3)";
                      }}
                    >
                      <div className="card-body p-2">
                        <p
                          className="card-text mb-1 font-weight-bold"
                          style={{
                            fontSize: "0.8rem",
                            opacity: "0.9",
                          }}
                        >
                          Approved
                        </p>
                        <h4
                          className="card-title mb-0 font-weight-bold"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {homeApproval.approved}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Rejected Card */}
                  <div className="col-4 px-1">
                    <div
                      className="card border-0 text-white text-center h-100"
                      style={{
                        // background:
                        //   "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        backgroundColor: "#E53935",
                        borderRadius: "16px",
                        boxShadow: "0 8px 16px rgba(239, 68, 68, 0.3)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-2px) scale(1.02)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 24px rgba(239, 68, 68, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 16px rgba(239, 68, 68, 0.3)";
                      }}
                    >
                      <div className="card-body p-2">
                        <p
                          className="card-text mb-1 font-weight-bold"
                          style={{
                            fontSize: "0.8rem",
                            opacity: "0.9",
                          }}
                        >
                          Rejected
                        </p>
                        <h4
                          className="card-title mb-0 font-weight-bold"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {homeApproval.rejected}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Pending Card */}
                  <div className="col-4 pl-1">
                    <div
                      className="card border-0 text-white text-center h-100"
                      style={{
                        // background:
                        //   "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        backgroundColor: "#d19d00",
                        borderRadius: "16px",
                        boxShadow: "0 8px 16px rgba(245, 158, 11, 0.3)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-2px) scale(1.02)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 24px rgba(245, 158, 11, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 16px rgba(245, 158, 11, 0.3)";
                      }}
                    >
                      <div className="card-body p-2">
                        <p
                          className="card-text mb-1 font-weight-bold"
                          style={{
                            fontSize: "0.8rem",
                            opacity: "0.9",
                          }}
                        >
                          In Progress
                        </p>
                        <h4
                          className="card-title mb-0 font-weight-bold"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {homeApproval.pending}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section - Takes 2/3 of width */}
          <div className="col-md-6">
            <div
              className="card border-0 shadow-lg h-100"
              style={{
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="card-body p-4 d-flex flex-column align-items-center">
                <p
                  className="card-title font-weight-bold text-dark text-center mb-4"
                  style={{ fontSize: "0.8rem" }}
                >
                  Request Percentage Distribution
                </p>
                <div className="w-100 d-flex justify-content-center">
                  <div
                    style={{
                      maxWidth: "500px",
                      width: "100%",
                      fontSize: "0.8rem",
                    }}
                  >
                    <Pie data={homeapprovalPieData} options={Pieoptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Requests Table */}
        <div className="row">
          <div className="col-12">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="card-body p-4">
                <p
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  Recent Event Requests
                </p>

                <div
                  style={{
                    width: "100%",
                  }}
                >
                  {renderApprovedTable("", approvedhomeList, [
                    "#",
                    "Title",
                    "Name",
                    "Date of Submission",
                    "Approver",
                    "Status",
                  ])}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
