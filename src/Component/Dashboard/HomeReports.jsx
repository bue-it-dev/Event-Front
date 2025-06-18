import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import DataGrid from "../shared_components/Grid";
import "./HomeReports.css"; // External CSS file for responsiveness
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Table,
  TableBody,
  TableHead,
  Tooltip,
  Typography,
  Alert,
} from "@mui/material";
const HomeReports = () => {
  const [requestId, setRequestId] = useState(null);
  const [statusName, setStatusName] = useState("");
  const [depId, setDepId] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [businessrequests, setbusinessrequests] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [airportList, setairportList] = React.useState([]);
  // Get List of Approval Department Schema
  const GetAirportList = () => {
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/BusinessRequest/get-airports-with-cities`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    axios(config)
      .then(function (response) {
        console.log("API Response", response.data.data);
        setairportList(
          response.data.data.map((airportList) => ({
            value: airportList.airportId,
            label: airportList.airportNameWithCity,
          }))
        );
      })
      .catch(function (error) {
        console.error(error);
      });
  };
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
  const getAirportName = (Id) => {
    console.log("ID", Id);
    const airport = airportList.find((airport) => airport.value === Number(Id));
    console.log("Airport result", airport);
    return airport ? airport.label : "Airport not found";
  };
  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 119,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-center">
            <Tooltip title="View" placement="left" arrow>
              <Link
                to={{
                  pathname: "/home-request-details-dashboard",
                  state: {
                    requestId: params.row.requestId,
                    status: params.row.statusName,
                  },
                }}
                // target="_blank"
                onClick={(e) => {
                  e.stopPropagation();
                  setRequestId(params.row.requestId);
                  setStatusName(params.row.statusName);
                }}
                style={{ textDecoration: "none" }} // Optional: removes the default link underline
              >
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#57636f",
                    color: "white",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    textTransform: "none",
                    fontSize: "12px",
                    fontWeight: "bold",
                    minWidth: "50px", // Decrease the width
                  }}
                >
                  View
                </Button>
              </Link>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: "requestName",
      headerName: "Request Name",
      width: 190,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.requestName}>
          <span className="table-cell-trucate">{params.row.requestName}</span>
        </Tooltip>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.phoneNumber}>
          <span className="table-cell-trucate">{params.row.phoneNumber}</span>
        </Tooltip>
      ),
    },
    {
      field: "passportName",
      headerName: "Passport Name",
      width: 190,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.passportName}>
          <span className="table-cell-trucate">{params.row.passportName}</span>
        </Tooltip>
      ),
    },
    {
      field: "passportNumber",
      headerName: "Passport Number",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.passportNumber}>
          <span className="table-cell-trucate">
            {params.row.passportNumber}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "issueDate",
      headerName: "Issue Date",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.issueDate}>
          <span className="table-cell-trucate">{params.row.issueDate}</span>
        </Tooltip>
      ),
    },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.expiryDate}>
          <span className="table-cell-trucate">{params.row.expiryDate}</span>
        </Tooltip>
      ),
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.dateOfBirth}>
          <span className="table-cell-trucate">{params.row.dateOfBirth}</span>
        </Tooltip>
      ),
    },
    {
      field: "dep",
      headerName: "Department",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.dep}>
          <span className="table-cell-trucate">{params.row.dep}</span>
        </Tooltip>
      ),
    },
    {
      field: "isAcademic",
      headerName: "Academic Status",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.isAcademic}>
          <span className="table-cell-trucate">{params.row.isAcademic}</span>
        </Tooltip>
      ),
    },
    {
      field: "hasDependent",
      headerName: "Dependent Travelers",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.hasDependent}>
          <span className="table-cell-trucate">{params.row.hasDependent}</span>
        </Tooltip>
      ),
    },
    {
      field: "planeClassId",
      headerName: "Flight Class",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.planeClassId}>
          <span className="table-cell-trucate">{params.row.planeClassId}</span>
        </Tooltip>
      ),
    },
    {
      field: "tripTypeName",
      headerName: "Trip Type",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.tripTypeName}>
          <span className="table-cell-trucate">{params.row.tripTypeName}</span>
        </Tooltip>
      ),
    },
    {
      field: "departureAirportId",
      headerName: "Departure Airport",
      width: 150,
      valueGetter: (params) => {
        const destinations = params.row.travelRequestDestinations;
        var airportname = getAirportName(destinations[0].departureAirportId);
        console.log("list", destinations);
        return destinations?.length > 0 ? airportname : "N/A";
      },
    },
    {
      field: "arrivalAirportId",
      headerName: "Arrival Airport",
      width: 150,
      valueGetter: (params) => {
        const destinations = params.row.travelRequestDestinations;
        var airportname = getAirportName(destinations[0].arrivalAirportId);
        console.log("list", destinations);
        return destinations?.length > 0 ? airportname : "N/A";
      },
    },
    {
      field: "departureDate",
      headerName: "Departure Date",
      width: 150,
      valueGetter: (params) => {
        const destinations = params.row.travelRequestDestinations;
        console.log("list", destinations);
        return destinations?.length > 0
          ? destinations[0].departureDate.split("T")[0]
          : "N/A";
      },
    },
    {
      field: "seconddepartureAirportId",
      headerName: "Return Departure Airport",
      width: 150,
      valueGetter: (params) => {
        if (params.row.tripTypeName !== "Round Trip") return "N/A";
        const destinations = params.row.travelRequestDestinations;
        var airportname = getAirportName(destinations[1]?.departureAirportId);
        console.log("list", destinations);
        return destinations?.length > 0 ? airportname : "N/A";
      },
    },
    {
      field: "secondarrivalAirportId",
      headerName: "Return Arrival Airport",
      width: 150,
      valueGetter: (params) => {
        if (params.row.tripTypeName !== "Round Trip") return "N/A";
        const destinations = params.row.travelRequestDestinations;
        var airportname = getAirportName(destinations[1]?.arrivalAirportId);
        console.log("list", destinations);
        return destinations?.length > 0 ? airportname : "N/A";
      },
    },
    {
      field: "secondarrivalDate",
      headerName: "Return Arrival Date",
      width: 150,
      valueGetter: (params) => {
        if (params.row.tripTypeName !== "Round Trip") return "N/A";
        const destinations = params.row.travelRequestDestinations;
        console.log("list", destinations);
        return destinations?.length > 0
          ? destinations[1]?.arrivalDate.split("T")[0] == null
            ? "N/A"
            : destinations[1]?.arrivalDate.split("T")[0]
          : "N/A";
      },
    },
    {
      field: "staffNameHr",
      headerName: "Staff Name (HR)",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.staffNameHr}>
          <span className="table-cell-trucate">{params.row.staffNameHr}</span>
        </Tooltip>
      ),
    },
    {
      field: "allowanceStartDate",
      headerName: "Allowance Start Date",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.allowanceStartDate}>
          <span className="table-cell-trucate">
            {params.row.allowanceStartDate}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "allowanceEndDate",
      headerName: "Allowance End Date",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.allowanceEndDate}>
          <span className="table-cell-trucate">
            {params.row.allowanceEndDate}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "remainingBalance",
      headerName: "Remaining Balance",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.remainingBalance}>
          <span className="table-cell-trucate">
            {params.row.remainingBalance}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "hasRoundTripTicket",
      headerName: "Round Trip Ticket Status",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.hasRoundTripTicket}>
          <span className="table-cell-trucate">
            {params.row.hasRoundTripTicket}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "statusName",
      headerName: "Status",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.statusName}>
          <span className="table-cell-trucate">{params.row.statusName}</span>
        </Tooltip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Submission Date",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.createdAt}>
          <span className="table-cell-trucate">{params.row.createdAt}</span>
        </Tooltip>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Modification Date",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.updatedAt}>
          <span className="table-cell-trucate">{params.row.updatedAt}</span>
        </Tooltip>
      ),
    },
  ];

  const rows = businessrequests.map((row, index) => ({
    id: index + 1,
    serial: row.serial == null ? "N/A" : row.serial,
    requestId: row.requestId,
    requestName:
      row.requestName == "Youssef Youssef ."
        ? "Youssef Youssef"
        : row.requestName,
    phoneNumber: row.phoneNumber == null ? "N/A" : row.phoneNumber,
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
    tripTypeName: row.tripTypeName,
    travelRequestDestinations: row.travelRequestDestinations,
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
    GetAirportList();
  }, []);

  return (
    <div className="home-reports-container">
      <div
        className="date-filters"
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <div
          className="date-input"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="select-dropdown"
            style={{
              fontSize: "0.8rem",
              minWidth: "150px",
              height: "40px",
            }}
          >
            <option value="">Select Department</option>
            {depId.map((data) => (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            ))}
          </select>
        </div>

        <div
          className="date-input"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label style={{ fontSize: "0.8rem" }}>Start Date</label>
          <input
            type="date"
            style={{
              fontSize: "0.8rem",
              height: "40px",
              minWidth: "150px",
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div
          className="date-input"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label style={{ fontSize: "0.8rem" }}>End Date</label>
          <input
            style={{
              fontSize: "0.8rem",
              height: "40px",
              minWidth: "150px",
            }}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={handleViewClick}
        className="view-button"
        style={{
          fontSize: "0.8rem",
          height: "34px",
          minWidth: "100px",
          alignSelf: "center", // aligns the button vertically with inputs
        }}
      >
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
