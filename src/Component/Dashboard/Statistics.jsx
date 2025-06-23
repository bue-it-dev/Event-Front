import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { Pie, Doughnut } from "react-chartjs-2";
import { getToken } from "../Util/Authenticate";
import URL from "../Util/config";
import { Spin, Alert } from "antd";
import JSONToCSVDownloader from "../shared_components/JSONToCSVDownloader";

const Statistics = () => {
  //State variables for Statistics component
  const [loading, setLoading] = useState(true);
  const [eventBudgetCostloading, seteventBudgetCostloading] = useState(true);
  const [eventMarcomloading, seteventMarcomloading] = useState(true);
  const [error, setError] = useState(null);
  const [eventBudgetCosterror, seteventBudgetCosterror] = useState(null);
  const [eventMarcomError, seteventMarcomError] = useState(null);
  const [depTypes, setdepTypes] = useState([]);
  //Event Budget Per Department Statistics State Variables
  const [eventbudgetperdepartment, seteventbudgetperdepartment] = useState([]);
  const [
    budgetperdepartmentselectedDepType,
    setbudgetperdepartmentselectedDepType,
  ] = useState("");
  const [BudgetPerDepartmentStartDate, setBudgetPerDepartmentStartDate] =
    useState(null);
  const [BudgetPerDepartmentEndDate, setBudgetPerDepartmentEndDate] =
    useState(null);

  //Event Budget Estimated Cost Per Department Statistics State Variables
  const [eventbudgetperdepartmentcost, seteventbudgetperdepartmentcost] =
    useState([]);
  const [
    budgetperdepartmentcostselectedDepType,
    setbudgetperdepartmentcostselectedDepType,
  ] = useState("");
  const [
    BudgetPerDepartmentCostStartDate,
    setBudgetPerDepartmentCostStartDate,
  ] = useState(null);
  const [BudgetPerDepartmentCostEndDate, setBudgetPerDepartmenCostEndDate] =
    useState(null);

  //Marcom Count Per Department Statistics State Variables
  const [eventmarcomperdepartment, seteventmarcomperdepartment] = useState([]);
  const [
    marcomperdepartmentselectedDepType,
    setmarcomperdepartmentselectedDepType,
  ] = useState("");
  const [MarcomPerDepartmentStartDate, setMarcomPerDepartmentStartDate] =
    useState(null);
  const [MarcomPerDepartmentEndDate, setMarcomPerDepartmentEndDate] =
    useState(null);
  //Budget Per Department Bar Chart & CSV Data Preparation
  const eventbudgetperdepartmentdata = [
    ["Department", "count"],
    ...eventbudgetperdepartment
      .filter((dept) => dept.count > 0)
      .map((department) => [department.departmentName, department.count]),
  ];
  const eventbudgetperdepartmentoptions = {
    title: "Event Budget Requests by Department",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 14, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#57636f", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const BudgetPerDepartmentHeaders = ["departmentName", "count"];

  //Budget Per Department Cost Bar Chart & CSV Data Preparation
  const eventbudgetperdepartmentCostdata = [
    ["Department", "count"],
    ...eventbudgetperdepartmentcost
      .filter((dept) => dept.totalBudget > 0)
      .map((department) => [department.departmentName, department.totalBudget]),
  ];
  const eventbudgetperdepartmentcostoptions = {
    title: "Event Budget Requests by Department Estimated Cost",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Total Cost (EGP)",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 14, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#57636f", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const BudgetPerDepartmentCostHeaders = ["departmentName", "totalBudget"];

  //Marcom Per Department Cost Bar Chart & CSV Data Preparation
  const eventmarcomperdepartmentdata = [
    ["Department", "count"],
    ...eventmarcomperdepartment
      .filter((dept) => dept.count > 0)
      .map((department) => [department.departmentName, department.count]),
  ];
  const eventmarcomperdepartmentoptions = {
    title: "Event Marcom Requests Count per Department",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 14, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#57636f", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const MarcomPerDepartmentHeaders = ["departmentName", "count"];
  // Function to fetch Data from the Backend
  // for Event Budget Per Department Statistics
  const GetBudgetPerDepartment = async (
    BudgetPerDepartmentStartDate,
    BudgetPerDepartmentEndDate,
    budgetperdepartmentselectedDepType
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (BudgetPerDepartmentStartDate)
        params.append("startDate", BudgetPerDepartmentStartDate);
      if (BudgetPerDepartmentEndDate)
        params.append("endDate", BudgetPerDepartmentEndDate);
      if (budgetperdepartmentselectedDepType)
        params.append("approvingDepTypeID", budgetperdepartmentselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-budget-count-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventbudgetperdepartment(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transportation statistics:", error);
      setError("No data available for the selected criteria.");
    } finally {
      setLoading(false);
    }
  };

  // for Event Budget Per Department Cost Statistics
  const GetBudgetPerDepartmentCost = async (
    BudgetPerDepartmentCostStartDate,
    BudgetPerDepartmentCostEndDate,
    budgetperdepartmentcostselectedDepType
  ) => {
    try {
      seteventBudgetCostloading(true);
      seteventBudgetCosterror(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (BudgetPerDepartmentCostStartDate)
        params.append("startDate", BudgetPerDepartmentCostStartDate);
      if (BudgetPerDepartmentCostEndDate)
        params.append("endDate", BudgetPerDepartmentCostEndDate);
      if (budgetperdepartmentcostselectedDepType)
        params.append(
          "approvingDepTypeID",
          budgetperdepartmentcostselectedDepType
        );

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-budget-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventbudgetperdepartmentcost(response.data.data || []);
    } catch (eventBudgetCosterror) {
      console.eventBudgetCosterror(
        "Error fetching transportation statistics:",
        eventBudgetCosterror
      );
      seteventBudgetCosterror("No data available for the selected criteria.");
    } finally {
      seteventBudgetCostloading(false);
    }
  };
  // for Event Marcom Per Department Statistics
  const GetMarcomCountPerDepartment = async (
    MarcomPerDepartmentStartDate,
    MarcomPerDepartmentEndDate,
    marcomperdepartmentselectedDepType
  ) => {
    try {
      seteventMarcomloading(true);
      seteventMarcomError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (MarcomPerDepartmentStartDate)
        params.append("startDate", MarcomPerDepartmentStartDate);
      if (MarcomPerDepartmentEndDate)
        params.append("endDate", MarcomPerDepartmentEndDate);
      if (marcomperdepartmentselectedDepType)
        params.append("approvingDepTypeID", marcomperdepartmentselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-marcom-count-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventmarcomperdepartment(response.data.data || []);
    } catch (eventMarcomError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventMarcomError("No data available for the selected criteria.");
    } finally {
      seteventMarcomloading(false);
    }
  };
  const getallDepartmentTypes = async () => {
    try {
      const response = await axios.get(
        `https://hcms.bue.edu.eg/TravelBE/api/BusinessRequest/get-all-department-types`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      console.log("Department types response:", response.data);
      setdepTypes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching department types:", error);
      // Don't set error state for this as it's not critical for the main functionality
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        GetBudgetPerDepartment(
          BudgetPerDepartmentStartDate,
          BudgetPerDepartmentEndDate,
          budgetperdepartmentselectedDepType
        ),
        GetBudgetPerDepartmentCost(
          BudgetPerDepartmentCostStartDate,
          BudgetPerDepartmentCostEndDate,
          budgetperdepartmentcostselectedDepType
        ),
        GetMarcomCountPerDepartment(
          MarcomPerDepartmentStartDate,
          MarcomPerDepartmentEndDate,
          marcomperdepartmentselectedDepType
        ),
        getallDepartmentTypes(),
      ]);
    };

    fetchData();
  }, [
    BudgetPerDepartmentStartDate,
    BudgetPerDepartmentEndDate,
    budgetperdepartmentselectedDepType,
    BudgetPerDepartmentCostStartDate,
    BudgetPerDepartmentCostEndDate,
    budgetperdepartmentcostselectedDepType,
    MarcomPerDepartmentStartDate,
    MarcomPerDepartmentEndDate,
    marcomperdepartmentselectedDepType,
  ]);

  // Show loading only when there's no data yet and it's the initial load
  const isInitialLoad =
    loading && eventbudgetperdepartment.length === 0 && !error;

  if (isInitialLoad) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
      />
    );
  }

  const isBudgetCostInitialLoad =
    eventBudgetCostloading &&
    eventbudgetperdepartmentCostdata.length === 0 &&
    !eventBudgetCosterror;

  if (isBudgetCostInitialLoad) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
      />
    );
  }

  const isMarcomInitialLoad =
    eventMarcomloading &&
    eventmarcomperdepartment.length === 0 &&
    !eventMarcomError;

  if (isMarcomInitialLoad) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
      />
    );
  }

  return (
    <>
      {/* Business request Transfer Statistics */}
      <div>
        <div className="chart">
          {/* Filters Section - Always visible */}
          <div className="row mb-3">
            <div className="col-12 col-sm-4">
              <div>
                <div className="form-group">
                  <label
                    htmlFor="departmentType"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Department Type
                  </label>
                  <select
                    id="departmentType"
                    style={{ fontSize: "0.8rem" }}
                    className="form-select form-select-lg custom-select"
                    value={budgetperdepartmentselectedDepType}
                    onChange={(e) =>
                      setbudgetperdepartmentselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    disabled={loading}
                  >
                    <option value="">All Department Types</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="BudgetPerDepartmentStartDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="BudgetPerDepartmentStartDate"
                  value={BudgetPerDepartmentStartDate || ""}
                  onChange={(e) =>
                    setBudgetPerDepartmentStartDate(e.target.value || null)
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="BudgetPerDepartmentEndDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="BudgetPerDepartmentEndDate"
                  value={BudgetPerDepartmentEndDate || ""}
                  onChange={(e) =>
                    setBudgetPerDepartmentEndDate(e.target.value || null)
                  }
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Loading indicator for filter changes */}
          {loading && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <Spin size="small" /> Loading...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ fontSize: "16px", padding: "12px", margin: "20px 0" }}
              //   closable
              onClose={() => setError(null)}
            />
          )}

          {/* Chart and Download Section */}
          {!error && eventbudgetperdepartment.length > 0 && (
            <>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={eventbudgetperdepartmentdata}
                options={eventbudgetperdepartmentoptions}
                legendToggle
              />
              <JSONToCSVDownloader
                data={eventbudgetperdepartment}
                headers={BudgetPerDepartmentHeaders}
                filename="event_request_budget_per_department_report.csv"
              />
            </>
          )}

          {/* No Data Message */}
          {!error && !loading && eventbudgetperdepartment.length === 0 && (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>No data available for the selected criteria.</p>
            </div>
          )}
        </div>
        <br />
        <div className="chart">
          {/* Filters Section - Always visible */}
          <div className="row mb-3">
            <div className="col-12 col-sm-4">
              <div>
                <div className="form-group">
                  <label
                    htmlFor="departmentType"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Department Type
                  </label>
                  <select
                    id="departmentType"
                    style={{ fontSize: "0.8rem" }}
                    className="form-select form-select-lg custom-select"
                    value={budgetperdepartmentcostselectedDepType}
                    onChange={(e) =>
                      setbudgetperdepartmentcostselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    disabled={eventBudgetCostloading}
                  >
                    <option value="">All Department Types</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="BudgetPerDepartmentStartDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="BudgetPerDepartmentCostStartDate"
                  value={BudgetPerDepartmentCostStartDate || ""}
                  onChange={(e) =>
                    setBudgetPerDepartmentCostStartDate(e.target.value || null)
                  }
                  disabled={eventBudgetCostloading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="BudgetPerDepartmentCostEndDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="BudgetPerDepartmentCostEndDate"
                  value={BudgetPerDepartmentCostEndDate || ""}
                  onChange={(e) =>
                    setBudgetPerDepartmenCostEndDate(e.target.value || null)
                  }
                  disabled={eventBudgetCostloading}
                />
              </div>
            </div>
          </div>

          {/* Loading indicator for filter changes */}
          {eventBudgetCosterror && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <Spin size="small" /> Loading...
            </div>
          )}

          {/* Error Message */}
          {eventBudgetCosterror && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ fontSize: "16px", padding: "12px", margin: "20px 0" }}
              //   closable
              onClose={() => seteventBudgetCosterror(null)}
            />
          )}

          {/* Chart and Download Section */}
          {!eventBudgetCosterror && eventbudgetperdepartmentcost.length > 0 && (
            <>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={eventbudgetperdepartmentCostdata}
                options={eventbudgetperdepartmentcostoptions}
                legendToggle
              />
              <JSONToCSVDownloader
                data={eventbudgetperdepartmentcost}
                headers={BudgetPerDepartmentCostHeaders}
                filename="event_request_cost_budget_per_department_report.csv"
              />
            </>
          )}

          {/* No Data Message */}
          {!eventBudgetCosterror &&
            !eventBudgetCostloading &&
            eventbudgetperdepartmentcost.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <p>No data available for the selected criteria.</p>
              </div>
            )}
        </div>
        <br />
        <div className="chart">
          {/* Filters Section - Always visible */}
          <div className="row mb-3">
            <div className="col-12 col-sm-4">
              <div>
                <div className="form-group">
                  <label
                    htmlFor="departmentType"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Department Type
                  </label>
                  <select
                    id="departmentType"
                    style={{ fontSize: "0.8rem" }}
                    className="form-select form-select-lg custom-select"
                    value={marcomperdepartmentselectedDepType}
                    onChange={(e) =>
                      setmarcomperdepartmentselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    disabled={eventMarcomloading}
                  >
                    <option value="">All Department Types</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="MarcomPerDepartmentStartDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="MarcomPerDepartmentStartDate"
                  value={MarcomPerDepartmentStartDate || ""}
                  onChange={(e) =>
                    setMarcomPerDepartmentStartDate(e.target.value || null)
                  }
                  disabled={eventMarcomloading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="MarcomPerDepartmentEndDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="MarcomPerDepartmentEndDate"
                  value={MarcomPerDepartmentEndDate || ""}
                  onChange={(e) =>
                    setMarcomPerDepartmentEndDate(e.target.value || null)
                  }
                  disabled={eventMarcomloading}
                />
              </div>
            </div>
          </div>

          {/* Loading indicator for filter changes */}
          {eventMarcomloading && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <Spin size="small" /> Loading...
            </div>
          )}

          {/* Error Message */}
          {eventMarcomError && (
            <Alert
              message={eventMarcomError}
              type="error"
              showIcon
              style={{ fontSize: "16px", padding: "12px", margin: "20px 0" }}
              //   closable
              onClose={() => seteventMarcomError(null)}
            />
          )}

          {/* Chart and Download Section */}
          {!eventMarcomError && eventmarcomperdepartment.length > 0 && (
            <>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={eventmarcomperdepartmentdata}
                options={eventmarcomperdepartmentoptions}
                legendToggle
              />
              <JSONToCSVDownloader
                data={eventmarcomperdepartment}
                headers={MarcomPerDepartmentHeaders}
                filename="event_request_marcom_per_department_report.csv"
              />
            </>
          )}

          {/* No Data Message */}
          {!eventMarcomError &&
            !eventMarcomloading &&
            eventmarcomperdepartment.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <p>No data available for the selected criteria.</p>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default Statistics;
