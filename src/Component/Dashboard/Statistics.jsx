import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { Pie, Doughnut } from "react-chartjs-2";
import { getToken } from "../Util/Authenticate";
import URL from "../Util/config";
import { Spin, Alert } from "antd";
import JSONToCSVDownloader from "../shared_components/JSONToCSVDownloader";

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businesstransportationRequest, setbusinesstransportationRequest] =
    useState([]);
  const [TransferBarselectedDepType, setTransferBarselectedDepType] =
    useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [depTypes, setdepTypes] = useState([]);

  // Business Request Transportation Count
  const businessTransportationRequestdata = [
    ["Department", "count"],
    ...businesstransportationRequest
      .filter((dept) => dept.count > 0)
      .map((department) => [department.departmentName, department.count]),
  ];

  const businessTransportationRequestoptions = {
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
    colors: ["darkblue", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const Transportationheaders = ["departmentName", "count"];

  const getTransportationStatistics = async (
    startDate,
    endDate,
    TransferBarselectedDepType
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (TransferBarselectedDepType)
        params.append("approvingDepTypeID", TransferBarselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-budget-count-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setbusinesstransportationRequest(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transportation statistics:", error);
      setError("No data available for the selected criteria.");
    } finally {
      setLoading(false);
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
        getTransportationStatistics(
          startDate,
          endDate,
          TransferBarselectedDepType
        ),
        getallDepartmentTypes(),
      ]);
    };

    fetchData();
  }, [startDate, endDate, TransferBarselectedDepType]);

  // Show loading only when there's no data yet and it's the initial load
  const isInitialLoad =
    loading && businesstransportationRequest.length === 0 && !error;

  if (isInitialLoad) {
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
                    value={TransferBarselectedDepType}
                    onChange={(e) =>
                      setTransferBarselectedDepType(e.target.value)
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
                <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                  Start Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="startDate"
                  value={startDate || ""}
                  onChange={(e) => setStartDate(e.target.value || null)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                  End Date
                </label>
                <input
                  type="date"
                  style={{ fontSize: "0.8rem" }}
                  className="form-control"
                  id="endDate"
                  value={endDate || ""}
                  onChange={(e) => setEndDate(e.target.value || null)}
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
          {!error && businesstransportationRequest.length > 0 && (
            <>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={businessTransportationRequestdata}
                options={businessTransportationRequestoptions}
                legendToggle
              />
              <JSONToCSVDownloader
                data={businesstransportationRequest}
                headers={Transportationheaders}
                filename="event_request_budget_per_department_report.csv"
              />
            </>
          )}

          {/* No Data Message */}
          {!error && !loading && businesstransportationRequest.length === 0 && (
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
