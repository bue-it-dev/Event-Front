import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import DataGrid from "../shared_components/Grid";
import "./HomeReports.css"; // External CSS file for responsiveness

const HomeReports = () => {
  const [depId, setDepId] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [businessrequests, setbusinessrequests] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);

  const GetAllDepartment = () => {
    axios
      .get(`${URL.BASE_URL}/api/Dashboard/get-homeRequest-all-departments`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setDepId(response.data))
      .catch((error) => console.error(error));
  };

  const GetBusinessRequest = async (startDate, endDate, deptId) => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/Dashboard/get-filtered-homeRequest?arrivalDate=${startDate}&returnDate=${endDate}&deptId=${deptId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      setbusinessrequests(response.data);
      setIsTableVisible(true);
    } catch (error) {
      console.error("Error fetching home request details:", error);
      setError("Failed to fetch home requests. Please try again later.");
    } finally {
      setisLoading(false);
    }
  };

  const columns = [
    { field: "requestName", headerName: "Request Name", width: 190 },
    { field: "passportName", headerName: "Passport Name", width: 190 },
    { field: "passportNumber", headerName: "Passport Number", width: 190 },
    { field: "issueDate", headerName: "Issue Date", width: 190 },
    { field: "expiryDate", headerName: "Expiry Date", width: 190 },
    { field: "dateOfBirth", headerName: "Date of Birth", width: 190 },
    { field: "dep", headerName: "Department", width: 190 },
    { field: "isAcademic", headerName: "Academic Status", width: 190 },
    { field: "hasDependent", headerName: "Dependent Travelers", width: 250 },
    { field: "planeClassId", headerName: "Flight Class", width: 190 },
    {
      field: "firstDepartureAirportName",
      headerName: "First Departure Airport",
      width: 190,
    },
    {
      field: "firstArrivalAirportName",
      headerName: "First Arrival Airport",
      width: 190,
    },
    { field: "departureDate", headerName: "Departure Date", width: 190 },
    {
      field: "secondDepartureAirportName",
      headerName: "Second Departure Airport",
      width: 190,
    },
    {
      field: "secondArrivalAirportName",
      headerName: "Second Arrival Airport",
      width: 190,
    },
    { field: "arrivalDate", headerName: "Arrival Date", width: 190 },
    { field: "staffNameHr", headerName: "Staff Name (HR)", width: 190 },
    {
      field: "allowanceStartDate",
      headerName: "Allowance Start Date",
      width: 190,
    },
    { field: "allowanceEndDate", headerName: "Allowance End Date", width: 190 },
    { field: "remainingBalance", headerName: "Remaining Balance", width: 190 },
    {
      field: "hasRoundTripTicket",
      headerName: "Round Trip Ticket Status",
      width: 190,
    },
    { field: "statusName", headerName: "Status", width: 190 },
    { field: "createdAt", headerName: "Submission Date", width: 190 },
    { field: "updatedAt", headerName: "Modification Date", width: 190 },
  ];

  const rows = businessrequests.map((row, index) => ({
    id: index + 1,
    serial: row.serial == null ? "N/A" : row.serial,
    requestId: row.requestId,
    requestName: row.requestName,
    empId: row.empId,
    parentDepId: row.parentDepId,
    depId: row.depId,
    dep: row.dep,
    isAcademic: row.isAcademic == 1 ? "Academic" : "Admin",
    hasDependent:
      row.hasDependent == 0 || row.hasDependent == null
        ? "No Dependent Travellers"
        : row.hasDependent + " Travellers",
    passportName: row.passportName,
    passportNumber: row.passportNumber,
    issueDate: new Date(row.issueDate).toLocaleDateString(),
    expiryDate: new Date(row.expiryDate).toLocaleDateString(),
    dateOfBirth: new Date(row.dateOfBirth).toLocaleDateString(),
    planeClassId:
      row.planeClassId == 2
        ? "Business Class"
        : row.planeClassId == 4
        ? "Economy Class"
        : null,
    firstDepartureAirportName: row.firstDepartureAirportName,
    firstArrivalAirportName: row.firstArrivalAirportName,
    departureDate: new Date(row.departureDate).toLocaleDateString(),
    secondDepartureAirportName:
      row.secondDepartureAirportName == null ||
      row.secondDepartureAirportName === ""
        ? "N/A"
        : row.secondDepartureAirportName,
    secondArrivalAirportName:
      row.secondArrivalAirportName == null ||
      row.secondArrivalAirportName === ""
        ? "N/A"
        : row.secondArrivalAirportName,
    arrivalDate:
      row.arrivalDate == null
        ? "N/A"
        : new Date(row.arrivalDate).toLocaleDateString(),
    staffNameHr: row.staffNameHr == null ? "N/A" : row.staffNameHr,
    allowanceStartDate:
      row.allowanceStartDate == null
        ? "N/A"
        : new Date(row.allowanceStartDate).toLocaleDateString(),
    allowanceEndDate:
      row.allowanceEndDate == null
        ? "N/A"
        : new Date(row.allowanceEndDate).toLocaleDateString(),
    remainingBalance:
      row.remainingBalance == 0 || row.remainingBalance == null
        ? "N/A"
        : row.remainingBalance,
    hasRoundTripTicket:
      row.hasRoundTripTicket == 1
        ? "Round-Trip Ticket available"
        : row.hasRoundTripTicket == 2
        ? "Round-Trip Ticket consumed"
        : row.hasRoundTripTicket == 0
        ? "Balance"
        : "N/A",
    createdAt: new Date(row.createdAt).toLocaleDateString(),
    statusName: row.statusName,
    updatedAt:
      row.updatedAt == null
        ? "No Modification"
        : new Date(row.updatedAt).toLocaleDateString(),
  }));

  const handleViewClick = () => {
    GetBusinessRequest(startDate, endDate, selectedDepartment);
  };

  useEffect(() => {
    GetAllDepartment();
  }, []);

  return (
    <div className="home-reports-container">
      <select
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
        className="department-dropdown"
      >
        <option value="">Select Department</option>
        {depId.map((data) => (
          <option key={data.id} value={data.id}>
            {data.name}
          </option>
        ))}
      </select>

      <div className="date-filters">
        <div className="date-input">
          <label>Departure Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="date-input">
          <label>Return Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <button onClick={handleViewClick} className="view-button">
        View
      </button>

      {isTableVisible && (
        <div className="table-container">
          <DataGrid rows={rows} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default HomeReports;
