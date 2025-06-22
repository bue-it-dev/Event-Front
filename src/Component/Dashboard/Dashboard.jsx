import React, { useEffect, useState } from "react";
import { Link, Route, Switch, Redirect, useLocation } from "react-router-dom";
import "./Dashboard.css";
import Home from "./Home";
import HomeReports from "./HomeReports";
import BusinessReports from "./BusinessReports";
import {
  FaHome,
  FaChartLine,
  FaChevronDown,
  FaChevronLeft,
  FaFileAlt,
  FaChevronRight,
} from "react-icons/fa";
import Statistics from "./Statistics";

const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [showReportsSubmenu, setShowReportsSubmenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const toggleReportsSubmenu = () => setShowReportsSubmenu((prev) => !prev);
  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        {/* <button
          onClick={toggleSidebar}
          className="sidebar-toggle"
          aria-label="Toggle Sidebar"
        >
          {isSidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button> */}
        <ul>
          <li>
            <Link
              to="/dashboard-menu/home"
              className={activeTab === "/dashboard-menu/home" ? "active" : ""}
            >
              <FaHome className="icon" />
              {!isSidebarCollapsed && (
                <span style={{ fontSize: "14px" }}>Home</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard-menu/statistics"
              className={
                activeTab === "/dashboard-menu/statistics" ? "active" : ""
              }
            >
              <FaChartLine className="icon" />
              {!isSidebarCollapsed && (
                <span style={{ fontSize: "14px" }}>Statistics</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard-menu/reports"
              onClick={toggleReportsSubmenu}
              className="submenu-toggle"
            >
              <FaFileAlt className="icon" />
              {!isSidebarCollapsed && (
                <span style={{ fontSize: "14px" }}>Reports</span>
              )}
              <FaChevronDown
                className={`submenu-arrow ${showReportsSubmenu ? "open" : ""}`}
              />
            </Link>
            {showReportsSubmenu && !isSidebarCollapsed && (
              <ul className="submenu">
                <li>
                  <Link
                    style={{ fontSize: "14px" }}
                    to="/dashboard-menu/reports/home-reports"
                    className={
                      activeTab === "/dashboard-menu/reports/home-reports"
                        ? "active"
                        : ""
                    }
                  >
                    All Requests
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/dashboard-menu/reports/business-reports"
                    style={{ fontSize: "14px" }}
                    className={
                      activeTab === "/dashboard-menu/reports/business-reports"
                        ? "active"
                        : ""
                    }
                  >
                    Business Reports
                  </Link>
                </li> */}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <div className={`main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        {/* <div className="content-area"> */}
        <Switch>
          <Route exact path="/dashboard-menu">
            <Redirect to="/dashboard-menu/home" />
          </Route>
          <Route path="/dashboard-menu/home" component={Home} />
          <Route path="/dashboard-menu/statistics" component={Statistics} />
          <Route
            path="/dashboard-menu/reports/home-reports"
            component={HomeReports}
          />
          {/* <Route
            path="/dashboard-menu/reports/business-reports"
            component={BusinessReports}
          /> */}
        </Switch>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
