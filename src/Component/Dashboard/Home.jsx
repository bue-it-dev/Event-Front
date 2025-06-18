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
  const [businessApproval, setBusinessApproval] = useState({
    approvedCount: 0,
    rejectedCount: 0,
    pendingCount: 0,
  });
  const [homeApproval, setHomeApproval] = useState({
    approvedCount: 0,
    rejectedCount: 0,
    pendingCount: 0,
  });

  // Reusable function to fetch data from an API
  const fetchData = (url, stateSetter) => {
    axios
      .get(`${URL.BASE_URL}${url}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => stateSetter(response.data))
      .catch((error) => console.error(error));
  };

  // Fetch counts and top requests on component mount
  useEffect(() => {
    fetchData("/api/Dashboard/get-bussiness-count", setBusinessRequestCount);
    fetchData("/api/Dashboard/get-home-count", setHomeRequestCount);
    fetchData("/api/Dashboard/get-approved-homeRequests", setHomeApproval);
    fetchData(
      "/api/Dashboard/get-approved-businessRequests",
      setBusinessApproval
    );
    fetchData("/api/Dashboard/get-homeRequest-Top5", setHomeList);
    fetchData("/api/Dashboard/get-businessRequest-Top5", setBusinessList);
    fetchData(
      "/api/Dashboard/get-approval-homeRequest-Top5",
      setapprovedhomeList
    );
    fetchData(
      "/api/Dashboard/get-approval-businessRequest-Top5",
      setapprovedbusinessList
    );
  }, []);

  // Pie chart data for requests and approvals
  const homeapprovalPieData = {
    labels: ["Approved Request", "Rejected Request", "Pending Request"],
    datasets: [
      {
        label: "Travel Request Approval Count",
        data: [
          homeApproval.approvedCount,
          homeApproval.rejectedCount,
          homeApproval.pendingCount,
        ],
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
        formatter: (value) => `${value}`, // Customize label format
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
                <td>{request.name || "Unknown"}</td>
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
      <h6>{title}</h6>
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
                <td>{request.name || "Unknown"}</td>
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
    <div className="home-container">
      <div className="stats-cards">
        <div className="chartcard">
          <h6>Home Request Count</h6>
          <h6>{homeRequestCount}</h6>
        </div>
        <div className="chartcard">
          <h6>Business Request Count</h6>
          <h6>{businessRequestCount}</h6>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-container">
          <h6>Home Request Approval Chart</h6>
          <Pie data={homeapprovalPieData} options={Pieoptions} />
        </div>
        <div className="chart-container">
          <h6>Business Request Approval Chart</h6>
          <Pie data={businesspprovalPieData} options={Pieoptions} />
        </div>
      </div>

      {/* <div className="recent-claims-container">
        {renderTable("Recently Submitted Home Requests", homeList, [
          "#",
          "Name",
          "Date of Submission",
        ])}
        {renderTable("Recently Submitted Business Requests", businessList, [
          "#",
          "Name",
          "Date of Submission",
        ])}
      </div> */}

      <div className="recent-claims-container">
        {renderApprovedTable("Last 5 Submitted", approvedhomeList, [
          "#",
          "Name",
          "Date of Submission",
          "Status",
        ])}
        {renderApprovedTable("Last 5 Submitted", approvedbusinessList, [
          "#",
          "Name",
          "Date of Submission",
          "Status",
        ])}
      </div>
    </div>
  );
};

export default Home;
