// import VCBTab from "./VCBTabs";
import React, { useState, useEffect } from "react";
import AdminTabs from "./AdminTabs";
import BOMTabs from "../BOM/BOMTabs";
import EAFTabs from "../EAF/EAFTabs";
import jwt_decode from "jwt-decode"; // Assuming you have this installed to decode the token
// import COOTabs from "../COO/COOTabs";
import { useHistory } from "react-router-dom"; // useHistory instead of useNavigate for v5
import Dashboard from "../Dashboard/Dashboard";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [userID, setUserID] = useState(null); // State to store the userID
  const [isHead, setIsHead] = useState(false); // State to conditionally show buttons
  const [isEAFHead, setisEAFHead] = useState(false); // State to conditionally show buttons
  const [isHeadIT, setIsHeadIT] = useState(false); // State to conditionally show buttons
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
      if (retrievedUserID === "35") {
        setIsHead(true); // Set to true if the user is head of department
        console.log("User is Head of Department:", retrievedUserID);
      } else if (retrievedUserID === "33") {
        setisEAFHead(true); // Set to true if the user is head of department
      }
      // 5. Check if userID is 67
      if (retrievedUserID === "67") {
        setIsHeadIT(true); // Set to true if the user is head of department
      }
    }
  }, []);

  const [activeButton, setActiveButton] = useState("admin");
  const [activeEAFButton, setActiveEAFButton] = useState("eafadmin");
  const handleHODClick = () => {
    setActiveTab("admin");
    setActiveButton("admin");
  };

  const handleBOMClick = () => {
    setActiveTab("bom");
    setActiveButton("bom");
  };
  const handleEAFClick = () => {
    setActiveTab("eafadmin");
    setActiveButton("eafadmin");
  };
  const handledashboardClick = () => {
    setActiveTab("dashboard");
    setActiveButton("Dashboard");
    history.push("/dashboard-menu"); // Use history.push to open a new page
  };

  return (
    <div>
      {/* Conditionally show buttons if userID is 55 */}
      {/* Conditionally show buttons if userID is 55 */}
      {isHeadIT && (
        <button
          className="btn me-2"
          style={{
            backgroundColor:
              activeButton === "Dashboard" ? "#587dbb" : "#D3D3D3", // Baby blue when active, grey when inactive
            color: activeButton === "Dashboard" ? "white" : "black", // White text when active, black when inactive
            border: "none",
            marginRight: "15px",
            fontSize: "0.7rem", // Increased font size for better visibility
          }}
          onClick={handledashboardClick}
        >
          Dashboard
        </button>
      )}
      {isHead ? (
        <div className="button-group" style={{ marginBottom: "20px" }}>
          <button
            className="btn me-2"
            style={{
              backgroundColor: activeButton === "admin" ? "#343a40" : "#D3D3D3", // Baby blue when active, grey when inactive
              color: activeButton === "admin" ? "white" : "black", // White text when active, black when inactive
              border: "none",
              marginRight: "15px",
              fontSize: "0.7rem", // Increased font size for better visibility
            }}
            onClick={handleHODClick}
          >
            Head of Department
          </button>

          <button
            className="btn me-2"
            style={{
              backgroundColor: activeButton === "bom" ? "#343a40" : "#D3D3D3", // Baby blue when active, grey when inactive
              color: activeButton === "bom" ? "white" : "black", // White text when active, black when inactive
              border: "none",
              marginRight: "15px",
              fontSize: "0.7rem", // Increased font size for better visibility
            }}
            onClick={handleBOMClick}
          >
            BO Manager
          </button>

          <button
            className="btn me-2"
            style={{
              backgroundColor:
                activeButton === "Dashboard" ? "#587dbb" : "#D3D3D3", // Baby blue when active, grey when inactive
              color: activeButton === "Dashboard" ? "white" : "black", // White text when active, black when inactive
              border: "none",
              marginRight: "15px",
              fontSize: "0.7rem", // Increased font size for better visibility
            }}
            onClick={handledashboardClick}
          >
            Dashboard
          </button>
        </div>
      ) : isEAFHead ? (
        <>
          <div className="button-group" style={{ marginBottom: "20px" }}>
            <button
              className="btn me-2"
              style={{
                backgroundColor:
                  activeButton === "admin" ? "#343a40" : "#D3D3D3", // Baby blue when active, grey when inactive
                color: activeButton === "admin" ? "white" : "black", // White text when active, black when inactive
                border: "none",
                marginRight: "15px",
                fontSize: "0.7rem", // Increased font size for better visibility
              }}
              onClick={handleHODClick}
            >
              Head of Department
            </button>

            <button
              className="btn me-2"
              style={{
                backgroundColor:
                  activeButton === "eafadmin" ? "#343a40" : "#D3D3D3", // Baby blue when active, grey when inactive
                color: activeButton === "eafadmin" ? "white" : "black", // White text when active, black when inactive
                border: "none",
                marginRight: "15px",
                fontSize: "0.7rem", // Increased font size for better visibility
              }}
              onClick={handleEAFClick}
            >
              Estates and Facilities Manager
            </button>
            <button
              className="btn me-2"
              style={{
                backgroundColor:
                  activeButton === "Dashboard" ? "#587dbb" : "#D3D3D3", // Baby blue when active, grey when inactive
                color: activeButton === "Dashboard" ? "white" : "black", // White text when active, black when inactive
                border: "none",
                marginRight: "15px",
                fontSize: "0.7rem", // Increased font size for better visibility
              }}
              onClick={handledashboardClick}
            >
              Dashboard
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
        </>
      ) : (
        <>
          {/* <h4>Head of Department Portal</h4> */}
          {/* // 5. If userID is not 55, show AdminTabs only */}
          <AdminTabs />
        </>
      )}

      {/* Conditionally render content based on active tab */}
      {isHead && (
        <div>
          {activeTab === "admin" && <AdminTabs />}
          {activeTab === "bom" && <BOMTabs />}
          {/* {activeTab === "dashboard" && <Dashboard />} */}
        </div>
      )}

      {/* Conditionally render content based on active tab */}
      {isEAFHead && (
        <div>
          {activeTab === "admin" && <AdminTabs />}
          {activeTab === "eafadmin" && <EAFTabs />}
          {/* {activeTab === "dashboard" && <Dashboard />} */}
        </div>
      )}
    </div>
  );
};

export default Admin;
