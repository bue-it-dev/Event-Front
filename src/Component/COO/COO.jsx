import VCBTab from "../VCB/VCBTabs";
import React, { useState, useEffect } from "react";
import AdminTabs from "../Admin/AdminTabs";
import BOMTabs from "../BOM/BOMTabs";
import jwt_decode from "jwt-decode"; // Assuming you have this installed to decode the token
import COOTabs from "./COOTabs";
import { useHistory } from "react-router-dom"; // useHistory instead of useNavigate for v5
import Dashboard from "../Dashboard/Dashboard";

const COO = () => {
  const [activeTab, setActiveTab] = useState("coo");
  const [userID, setUserID] = useState(null); // State to store the userID
  const [isHead, setIsHead] = useState(false); // State to conditionally show buttons
  const history = useHistory(); // useHistory hook

  useEffect(() => {
    // 1. Retrieve the accessToken from localStorage
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      // 2. Decode the token to extract userID
      const decodedToken = jwt_decode(accessToken);
      const retrievedUserID = decodedToken.UserID;

      // 3. Set the retrieved userID
      setUserID(retrievedUserID);

      // 4. Check if userID is 55
      if (retrievedUserID === "55") {
        setIsHead(true); // Set to true if the user is head of department
      }
    }
  }, []);

  const [activeButton, setActiveButton] = useState("COO");
  const handleVCBClick = () => {
    setActiveTab("vcb");
    setActiveButton("VCB");
  };

  const handleCOOClick = () => {
    setActiveTab("coo");
    setActiveButton("COO");
  };
  const handledashboardClick = () => {
    setActiveTab("dashboard");
    setActiveButton("Dashboard");
    history.push("/dashboard-menu"); // Use history.push to open a new page
  };

  return (
    <div>
      {/* Conditionally show buttons if userID is 55 */}
      <div className="button-group" style={{ marginBottom: "20px" }}>
        <button
          className="btn me-2"
          style={{
            backgroundColor: activeButton === "VCB" ? "#343a40" : "#D3D3D3", // Baby blue when active, grey when inactive
            color: activeButton === "VCB" ? "white" : "black", // White text when active, black when inactive
            border: "none",
            marginRight: "15px",
          }}
          onClick={handleVCBClick}
        >
          Vice-Chancellor of the Board
        </button>

        <button
          className="btn me-2"
          style={{
            backgroundColor: activeButton === "COO" ? "#343a40" : "#D3D3D3", // Baby blue when active, grey when inactive
            color: activeButton === "COO" ? "white" : "black", // White text when active, black when inactive
            border: "none",
            marginRight: "15px",
          }}
          onClick={handleCOOClick}
        >
          Chief Operating Officer
        </button>

        {/* <button
          className="btn me-2"
          style={{
            backgroundColor:
              activeButton === "Dashboard" ? "#587dbb" : "#D3D3D3", // Baby blue when active, grey when inactive
            color: activeButton === "Dashboard" ? "white" : "black", // White text when active, black when inactive
            border: "none",
            marginRight: "15px",
          }}
          onClick={handledashboardClick}
        >
          Dashboard
        </button> */}
      </div>

      {/* Conditionally render content based on active tab */}
      {isHead && (
        <div>
          {activeTab === "coo" && <COOTabs />}
          {activeTab === "vcb" && <VCBTab />}
          {/* {activeTab === "dashboard" && <Dashboard />} */}
        </div>
      )}
    </div>
  );
};

export default COO;
