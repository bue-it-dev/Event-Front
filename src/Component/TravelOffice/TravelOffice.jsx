import React from "react";
import TravelOfficeTab from "./TravelOfficeTabs";
import { useHistory } from "react-router-dom"; // useHistory instead of useNavigate for v5

const TravelOffice = () => {
  const history = useHistory(); // useHistory hook
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const handleDashboardClick = () => {
    history.push("/dashboard-menu"); // Use history.push to open a new page
  };
  return (
    <div>
      {/* <h4>Travel Office Portal</h4> */}
      {/* <div className="button-group" style={{ marginBottom: "20px" }}>
        <button
          className="btn btn-secondary"
          style={{
            backgroundColor: "#343a40",
            border: "none",
            marginRight: "15px", // Add spacing between buttons
          }}
          onClick={handleDashboardClick}
        >
          Dashboard
        </button>
      </div> */}
      <TravelOfficeTab />
    </div>
  );
};

export default TravelOffice;
