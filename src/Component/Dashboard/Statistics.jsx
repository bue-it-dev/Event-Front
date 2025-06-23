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
  const [eventITloading, seteventITloading] = useState(true);
  const [eventTransloading, seteventTransloading] = useState(true);
  const [eventTransComploading, seteventTransComploading] = useState(true);
  const [error, setError] = useState(null);
  const [eventBudgetCosterror, seteventBudgetCosterror] = useState(null);
  const [eventMarcomError, seteventMarcomError] = useState(null);
  const [eventITError, seteventITError] = useState(null);
  const [eventTransError, seteventTransError] = useState(null);
  const [eventTransCompError, seteventTransCompError] = useState(null);
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

  //IT Count Per Department Statistics State Variables
  const [eventITperdepartment, seteventITperdepartment] = useState([]);
  const [ITperdepartmentselectedDepType, setITperdepartmentselectedDepType] =
    useState("");
  const [ITPerDepartmentStartDate, setITPerDepartmentStartDate] =
    useState(null);
  const [ITPerDepartmentEndDate, setITPerDepartmentEndDate] = useState(null);

  //Event Transportation Per Department Statistics State Variables
  const [eventTransperdepartment, seteventTransperdepartment] = useState([]);
  const [
    TransperdepartmentselectedDepType,
    setTransperdepartmentselectedDepType,
  ] = useState("");
  const [TransPerDepartmentStartDate, setTransPerDepartmentStartDate] =
    useState(null);
  const [TransPerDepartmentEndDate, setTransPerDepartmentEndDate] =
    useState(null);
  //Event Transportation Component Count Statistics State Variables
  const [eventTransCompCount, seteventTransCompCount] = useState([]);
  const [TransCompCountselectedDepType, setTransCompCountselectedDepType] =
    useState("");
  const [TransCompCountStartDate, setTransCompCountStartDate] = useState(null);
  const [TransCompCountEndDate, setTransCompCountEndDate] = useState(null);
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

  //IT Per Department Cost Bar Chart & CSV Data Preparation
  const eventITperdepartmentdata = [
    ["Department", "count"],
    ...eventITperdepartment
      .filter((dept) => dept.count > 0)
      .map((department) => [department.departmentName, department.count]),
  ];
  const eventITperdepartmentoptions = {
    title: "Event IT Requests Count per Department",
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

  const ITPerDepartmentHeaders = ["departmentName", "count"];

  //Trans Per Department Cost Bar Chart & CSV Data Preparation
  const eventTransperdepartmentdata = [
    ["Department", "count"],
    ...eventTransperdepartment
      .filter((dept) => dept.count > 0)
      .map((department) => [department.departmentName, department.count]),
  ];
  const eventTransperdepartmentoptions = {
    title: "Event Transportation Requests Count per Department",
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

  const TransPerDepartmentHeaders = ["departmentName", "count"];

  // Transportation Service Type Count Bar Chart & CSV Data Preparation
  const eventTransCompCountdata = (() => {
    // Get unique service types from the data
    const serviceTypes = [
      ...new Set(eventTransCompCount.map((item) => item.serviceType)),
    ];

    // Get unique departments
    const departments = [
      ...new Set(eventTransCompCount.map((item) => item.departmentName)),
    ];

    // Create header row with department name and all service types
    const header = ["Department", ...serviceTypes];

    // Create data rows for each department
    const dataRows = departments
      .map((department) => {
        const row = [department];

        // For each service type, find the count for this department
        serviceTypes.forEach((serviceType) => {
          const found = eventTransCompCount.find(
            (item) =>
              item.departmentName === department &&
              item.serviceType === serviceType
          );
          row.push(found ? found.count : 0);
        });

        return row;
      })
      .filter((row) => {
        // Filter out departments with no counts (all service types are 0)
        return row.slice(1).some((count) => count > 0);
      });

    return [header, ...dataRows];
  })();

  const eventTransCompCountoptions = {
    title: "Transportation Service Type Statistics",
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
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b", "#2a4a5b"], // Added more colors for potential service types
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  // Headers for CSV export
  const TransCompCountHeaders = ["departmentName", "serviceType", "count"];

  //   const TransCompCountHeaders = ["departmentName", "count", "serviceType"];
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
  // for Event IT Per Department Statistics
  const GetITCountPerDepartment = async (
    ITPerDepartmentStartDate,
    ITPerDepartmentEndDate,
    ITperdepartmentselectedDepType
  ) => {
    try {
      seteventITloading(true);
      seteventITError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (ITPerDepartmentStartDate)
        params.append("startDate", ITPerDepartmentStartDate);
      if (ITPerDepartmentEndDate)
        params.append("endDate", ITPerDepartmentEndDate);
      if (ITperdepartmentselectedDepType)
        params.append("approvingDepTypeID", ITperdepartmentselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-it-count-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventITperdepartment(response.data.data || []);
    } catch (eventITError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventITError("No data available for the selected criteria.");
    } finally {
      seteventITloading(false);
    }
  };
  // for Event Transportation Per Department Statistics
  const GetTransCountPerDepartment = async (
    TransPerDepartmentStartDate,
    TransPerDepartmentEndDate,
    TransperdepartmentselectedDepType
  ) => {
    try {
      seteventTransloading(true);
      seteventTransError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (TransPerDepartmentStartDate)
        params.append("startDate", TransPerDepartmentStartDate);
      if (TransPerDepartmentEndDate)
        params.append("endDate", TransPerDepartmentEndDate);
      if (TransperdepartmentselectedDepType)
        params.append("approvingDepTypeID", TransperdepartmentselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-transportation-count-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventTransperdepartment(response.data.data || []);
    } catch (eventTransError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventTransError("No data available for the selected criteria.");
    } finally {
      seteventTransloading(false);
    }
  };

  // for Event Transportation Per Department Statistics
  const GetTransCompCountPerDepartment = async (
    TransCompCountStartDate,
    TransCompCountEndDate,
    TransCompCountselectedDepType
  ) => {
    try {
      seteventTransComploading(true);
      seteventTransCompError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (TransCompCountStartDate)
        params.append("startDate", TransCompCountStartDate);
      if (TransCompCountEndDate)
        params.append("endDate", TransCompCountEndDate);
      if (TransCompCountselectedDepType)
        params.append("approvingDepTypeID", TransCompCountselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/department-transportation-type-count${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventTransCompCount(response.data.data || []);
    } catch (eventTransCompError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventTransCompError("No data available for the selected criteria.");
    } finally {
      seteventTransComploading(false);
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
        GetITCountPerDepartment(
          ITPerDepartmentStartDate,
          ITPerDepartmentEndDate,
          ITperdepartmentselectedDepType
        ),
        GetTransCountPerDepartment(
          TransPerDepartmentStartDate,
          TransPerDepartmentEndDate,
          TransperdepartmentselectedDepType
        ),
        GetTransCompCountPerDepartment(
          TransCompCountStartDate,
          TransCompCountEndDate,
          TransCompCountselectedDepType
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
    ITPerDepartmentStartDate,
    ITPerDepartmentEndDate,
    ITperdepartmentselectedDepType,
    TransPerDepartmentStartDate,
    TransPerDepartmentEndDate,
    TransperdepartmentselectedDepType,
    TransCompCountStartDate,
    TransCompCountEndDate,
    TransCompCountselectedDepType,
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

  const isITInitialLoad =
    eventITloading && eventITperdepartment.length === 0 && !eventITError;

  if (isITInitialLoad) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
      />
    );
  }

  const isTransInitialLoad =
    eventTransloading &&
    eventTransperdepartment.length === 0 &&
    !eventTransError;

  if (isTransInitialLoad) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
      />
    );
  }

  const isTransCompCountInitialLoad =
    eventTransComploading &&
    eventTransCompCount.length === 0 &&
    !eventTransCompError;

  if (isTransCompCountInitialLoad) {
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
        <div className="horizontal-rule mb-4">
          <hr className="border-secondary" />
          <h5 className="horizontal-rule-text fs-5 text-dark">
            Budget Service Statisitics
          </h5>
        </div>
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
        <div className="horizontal-rule mb-4">
          <hr className="border-secondary" />
          <h5 className="horizontal-rule-text fs-5 text-dark">
            Marcom Service Statisitics
          </h5>
        </div>
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
        <br />
        <div className="horizontal-rule mb-4">
          <hr className="border-secondary" />
          <h5 className="horizontal-rule-text fs-5 text-dark">
            IT Service Statisitics
          </h5>
        </div>
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
                    value={ITperdepartmentselectedDepType}
                    onChange={(e) =>
                      setITperdepartmentselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    disabled={eventITloading}
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
                  htmlFor="ITPerDepartmentStartDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="ITPerDepartmentStartDate"
                  value={ITPerDepartmentStartDate || ""}
                  onChange={(e) =>
                    setITPerDepartmentStartDate(e.target.value || null)
                  }
                  disabled={eventITloading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="ITPerDepartmentEndDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="ITPerDepartmentEndDate"
                  value={ITPerDepartmentEndDate || ""}
                  onChange={(e) =>
                    setITPerDepartmentEndDate(e.target.value || null)
                  }
                  disabled={eventITloading}
                />
              </div>
            </div>
          </div>

          {/* Loading indicator for filter changes */}
          {eventITloading && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <Spin size="small" /> Loading...
            </div>
          )}

          {/* Error Message */}
          {eventITError && (
            <Alert
              message={eventITError}
              type="error"
              showIcon
              style={{ fontSize: "16px", padding: "12px", margin: "20px 0" }}
              //   closable
              onClose={() => seteventITError(null)}
            />
          )}

          {/* Chart and Download Section */}
          {!eventITError && eventITperdepartment.length > 0 && (
            <>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={eventITperdepartmentdata}
                options={eventITperdepartmentoptions}
                legendToggle
              />
              <JSONToCSVDownloader
                data={eventITperdepartment}
                headers={ITPerDepartmentHeaders}
                filename="event_request_IT_per_department_report.csv"
              />
            </>
          )}

          {/* No Data Message */}
          {!eventITError &&
            !eventITloading &&
            eventITperdepartment.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <p>No data available for the selected criteria.</p>
              </div>
            )}
        </div>
        <div className="horizontal-rule mb-4">
          <hr className="border-secondary" />
          <h5 className="horizontal-rule-text fs-5 text-dark">
            Transportation Service
          </h5>
        </div>
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
                    value={TransperdepartmentselectedDepType}
                    onChange={(e) =>
                      setTransperdepartmentselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    disabled={eventTransloading}
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
                  htmlFor="TransPerDepartmentStartDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="TransPerDepartmentStartDate"
                  value={TransPerDepartmentStartDate || ""}
                  onChange={(e) =>
                    setTransPerDepartmentStartDate(e.target.value || null)
                  }
                  disabled={eventTransloading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="TransPerDepartmentEndDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="TransPerDepartmentEndDate"
                  value={TransPerDepartmentEndDate || ""}
                  onChange={(e) =>
                    setTransPerDepartmentEndDate(e.target.value || null)
                  }
                  disabled={eventTransloading}
                />
              </div>
            </div>
          </div>

          {/* Loading indicator for filter changes */}
          {eventTransloading && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <Spin size="small" /> Loading...
            </div>
          )}

          {/* Error Message */}
          {eventTransError && (
            <Alert
              message={eventTransError}
              type="error"
              showIcon
              style={{ fontSize: "16px", padding: "12px", margin: "20px 0" }}
              //   closable
              onClose={() => seteventTransError(null)}
            />
          )}

          {/* Chart and Download Section */}
          {!eventTransError && eventTransperdepartment.length > 0 && (
            <>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={eventTransperdepartmentdata}
                options={eventTransperdepartmentoptions}
                legendToggle
              />
              <JSONToCSVDownloader
                data={eventTransperdepartment}
                headers={TransPerDepartmentHeaders}
                filename="event_request_Transportation_per_department_report.csv"
              />
            </>
          )}

          {/* No Data Message */}
          {!eventTransError &&
            !eventTransloading &&
            eventTransperdepartment.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <p>No data available for the selected criteria.</p>
              </div>
            )}
        </div>
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
                    value={TransCompCountselectedDepType}
                    onChange={(e) =>
                      setTransCompCountselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    disabled={eventTransComploading}
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
                  htmlFor="TransCompCountStartDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="TransCompCountStartDate"
                  value={TransCompCountStartDate || ""}
                  onChange={(e) =>
                    setTransCompCountStartDate(e.target.value || null)
                  }
                  disabled={eventTransComploading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="TransCompCountEndDate"
                  style={{ fontSize: "0.8rem" }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="TransCompCountEndDate"
                  value={TransCompCountEndDate || ""}
                  onChange={(e) =>
                    setTransCompCountEndDate(e.target.value || null)
                  }
                  disabled={eventTransComploading}
                />
              </div>
            </div>
          </div>

          {/* Loading indicator for filter changes */}
          {eventTransComploading && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <Spin size="small" /> Loading...
            </div>
          )}

          {/* Error Message */}
          {eventTransCompError && (
            <Alert
              message={eventTransCompError}
              type="error"
              showIcon
              style={{ fontSize: "16px", padding: "12px", margin: "20px 0" }}
              //   closable
              onClose={() => seteventTransCompError(null)}
            />
          )}

          {/* Chart and Download Section */}
          {!eventTransCompError && eventTransCompCount.length > 0 && (
            <>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={eventTransCompCountdata}
                options={eventTransCompCountoptions}
                legendToggle
              />
              <JSONToCSVDownloader
                data={eventTransCompCount}
                headers={TransCompCountHeaders}
                filename="event_request_Transportation_Most_Used_Component_per_department_report.csv"
              />
            </>
          )}

          {/* No Data Message */}
          {!eventTransCompError &&
            !eventTransComploading &&
            eventTransCompCount.length === 0 && (
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
