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
      url: `${URL.BASE_URL}/api/EventEntity/get-all-eventRequest/`,
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
      .get(`${URL.BASE_URL}/api/EventEntity/get-approval-departments-schema`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setDepId(response.data.data))
      .catch((error) => console.error(error));
  };

  // const GetBusinessRequest = async (startDate, endDate, deptId) => {
  //   try {
  //     const response = await axios.get(
  //       `${URL.BASE_URL}/api/Dashboard/get-filtered-homeRequest?arrivalDate=${startDate}&returnDate=${endDate}&deptId=${deptId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${getToken()}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     setbusinessrequests(response.data);
  //     setIsTableVisible(true);
  //   } catch (error) {
  //     console.error("Error fetching home request details:", error);
  //     setError("Failed to fetch home requests. Please try again later.");
  //   } finally {
  //     setisLoading(false);
  //   }
  // };
  const GetBusinessRequest = async (startDate, endDate, deptId) => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-all-eventRequest?startDate=${startDate}&endDate=${endDate}&ApprovingDepId=${deptId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      setbusinessrequests(response.data.data);
      setIsTableVisible(true);
    } catch (error) {
      console.error("Error fetching home request details:", error);
      setError("Failed to fetch home requests. Please try again later.");
      setIsTableVisible(false);
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
      width: 112,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-center">
            <Tooltip title="View" placement="left" arrow>
              <Link
                to={{
                  pathname: "/report-event-request-details",
                  state: {
                    requestId: params.row.eventId,
                    statusName: params.row.statusName,
                  },
                }}
                // target="_blank"
                onClick={(e) => {
                  e.stopPropagation();
                  setRequestId(params.row.eventId);
                  setStatusName(params.row.statusName);
                }}
                style={{ textDecoration: "none" }} // Optional: removes the default link underline
              >
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#57636f",
                    // maxWidth: "50px", // Decrease the width
                    color: "white",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    textTransform: "none",
                    fontSize: "0.7rem",
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
    // { field: "serial", headerName: "#", width: 150 },
    {
      field: "serial",
      headerName: "Serial",
      width: 110,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "organizerName",
      headerName: "Organizer Name",
      width: 290,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.organizerName}>
          <span className="table-cell-trucate">{params.row.organizerName}</span>
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
      field: "confirmedAt",
      headerName: "Confrimation Date",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.confirmedAt}>
          <span className="table-cell-trucate">{params.row.confirmedAt}</span>
        </Tooltip>
      ),
    },
    {
      field: "updateAt",
      headerName: "Modification Date",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.updateAt}>
          <span className="table-cell-trucate">{params.row.updateAt}</span>
        </Tooltip>
      ),
    },
    {
      field: "approvalName",
      headerName: "Approver",
      width: 190,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.approvalName}>
          <span className="table-cell-trucate">{params.row.approvalName}</span>
        </Tooltip>
      ),
    },
    {
      field: "statusName",
      headerName: "Status",
      width: 190,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.statusName}>
          <span className="table-cell-trucate">{params.row.statusName}</span>
        </Tooltip>
      ),
    },
    {
      field: "isreturned",
      headerName: "Returned for Update",
      width: 190,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.isreturned}>
          <span className="table-cell-trucate">{params.row.isreturned}</span>
        </Tooltip>
      ),
    },
    {
      field: "organizerMobile",
      headerName: "Organizer Mobile",
      width: 172,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.organizerMobile}>
          <span className="table-cell-trucate">
            {params.row.organizerMobile}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "organizerEmail",
      headerName: "Organizer Email",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.organizerEmail}>
          <span className="table-cell-trucate">
            {params.row.organizerEmail}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "approvingDeptName",
      headerName: "Department",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.approvingDeptName}>
          <span className="table-cell-trucate">
            {params.row.approvingDeptName}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "eventTitle",
      headerName: "Title",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.eventTitle}>
          <span className="table-cell-trucate">{params.row.eventTitle}</span>
        </Tooltip>
      ),
    },
    {
      field: "eventStartDate",
      headerName: "Start Date & Time",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.eventStartDate}>
          <span className="table-cell-trucate">
            {params.row.eventStartDate}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "eventEndDate",
      headerName: "End Date & Time",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.eventEndDate}>
          <span className="table-cell-trucate">{params.row.eventEndDate}</span>
        </Tooltip>
      ),
    },
    {
      field: "nomParticipants",
      headerName: "Number of Particpants",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.nomParticipants}>
          <span className="table-cell-trucate">
            {params.row.nomParticipants}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "hasBudget",
      headerName: "Budget",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.hasBudget}>
          <span className="table-cell-trucate">{params.row.hasBudget}</span>
        </Tooltip>
      ),
    },
    {
      field: "hasMarcom",
      headerName: "Marcom",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.hasMarcom}>
          <span className="table-cell-trucate">{params.row.hasMarcom}</span>
        </Tooltip>
      ),
    },
    {
      field: "hasIt",
      headerName: "IT",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.hasIt}>
          <span className="table-cell-trucate">{params.row.hasIt}</span>
        </Tooltip>
      ),
    },
    {
      field: "hasAccomdation",
      headerName: "Accommodation",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.hasAccomdation}>
          <span className="table-cell-trucate">
            {params.row.hasAccomdation}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "hasTransportation",
      headerName: "Transportation",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.hasTransportation}>
          <span className="table-cell-trucate">
            {params.row.hasTransportation}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "budgetlineName",
      headerName: "Budget Line Name",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.budgetlineName}>
          <span className="table-cell-trucate">
            {params.row.budgetlineName}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "budgetCode",
      headerName: "Budget Code",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.budgetCode}>
          <span className="table-cell-trucate">{params.row.budgetCode}</span>
        </Tooltip>
      ),
    },
    {
      field: "budgetCostCenter",
      headerName: "Budget Cost Center",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.budgetCostCenter}>
          <span className="table-cell-trucate">
            {params.row.budgetCostCenter}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "budgetEstimatedCost",
      headerName: "Estimated Cost (EGP)",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.budgetEstimatedCost}>
          <span className="table-cell-trucate">
            {params.row.budgetEstimatedCost}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "isStaffStudents",
      headerName: "BUE Internal Audience",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.isStaffStudents}>
          <span className="table-cell-trucate">
            {params.row.isStaffStudents}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "isChairBoardPrisidentVcb",
      headerName: "Leadership Attendance",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.isChairBoardPrisidentVcb}>
          <span className="table-cell-trucate">
            {params.row.isChairBoardPrisidentVcb}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "isOthers",
      headerName: "External Visitors & Agenda",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.isOthers}>
          <span className="table-cell-trucate">{params.row.isOthers}</span>
        </Tooltip>
      ),
    },
    {
      field: "isVip",
      headerName: "VIP Guests",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.isVip}>
          <span className="table-cell-trucate">{params.row.isVip}</span>
        </Tooltip>
      ),
    },
    {
      field: "isInernationalGuest",
      headerName: "nternational Delegations",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.isInernationalGuest}>
          <span className="table-cell-trucate">
            {params.row.isInernationalGuest}
          </span>
        </Tooltip>
      ),
    },
  ];

  const rows = businessrequests.map((event, i) => ({
    Number: i + 1,
    id: event.eventId,
    serial: event.serial,
    eventId: event.eventId,
    eventTitle: event.eventTitle,
    eventStartDate: event.eventStartDate,
    eventEndDate: event.eventEndDate,
    organizerName: event.organizerName || "N/A",
    organizerMobile: "0" + event.organizerMobile || "N/A",
    organizerEmail: event.organizerEmail || "N/A",
    approvingDeptName: event.approvingDeptName || "N/A",
    createdAt: new Date(event.createdAt).toLocaleDateString(),
    updateAt: event.updateAt
      ? new Date(event.updateAt).toLocaleDateString()
      : "N/A",
    confirmedAt: event.confirmedAt
      ? new Date(event.confirmedAt).toLocaleDateString()
      : "N/A",
    statusName: event.statusName,
    hasIt: event.hasIt ? "Yes" : "No",
    hasAccomdation: event.hasAccomdation ? "Yes" : "No",
    hasTransportation: event.hasTransportation ? "Yes" : "No",
    budgetlineName: event.budgetlineName || "N/A",
    budgetCode: event.budgetCode || "N/A",
    budgetCostCenter: event.budgetCostCenter || "N/A",
    budgetEstimatedCost: event.budgetEstimatedCost || "N/A",
    hasBudget: event.hasBudget ? "Yes" : "No",
    hasMarcom: event.hasMarcom ? "Yes" : "No",
    notes: event.notes || "N/A",
    isStaffStudents: event.isStaffStudents ? "Yes" : "No",
    isChairBoardPrisidentVcb: event.isChairBoardPrisidentVcb ? "Yes" : "No",
    isOthers: event.isOthers ? "Yes" : "No",
    isVip: event.isVip ? "Yes" : "No",
    isInernationalGuest: event.isInernationalGuest ? "Yes" : "No",
    nomParticipants: event.nomParticipants || "N/A",
    approvalName: event.approvalName || "N/A",
    isreturned: event.isreturned ? "Yes" : "No",
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
      <div className="row align-items-end mb-3">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
          <div className="form-group mb-0">
            <label
              className="form-label text-muted font-weight-semibold mb-2"
              style={{ fontSize: "0.8rem" }}
            >
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="form-control shadow-sm border-0"
              style={{
                fontSize: "0.8rem",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                border: "2px solid #e2e8f0",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow =
                  "0 0 0 0.2rem rgba(102, 126, 234, 0.25)";
                e.target.style.background = "#ffffff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
                e.target.style.background =
                  "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
              }}
            >
              <option value="">Select Department</option>
              {depId.map((data) => (
                <option key={data.rowId} value={data.rowId}>
                  {data.depName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
          <div className="form-group mb-0">
            <label
              className="form-label text-muted font-weight-semibold mb-2"
              style={{ fontSize: "0.8rem" }}
            >
              Start Date
            </label>
            <input
              type="date"
              className="form-control shadow-sm border-0"
              style={{
                fontSize: "0.8rem",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                border: "2px solid #e2e8f0",
                transition: "all 0.3s ease",
              }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow =
                  "0 0 0 0.2rem rgba(102, 126, 234, 0.25)";
                e.target.style.background = "#ffffff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
                e.target.style.background =
                  "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
              }}
            />
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
          <div className="form-group mb-0">
            <label
              className="form-label text-muted font-weight-semibold mb-2"
              style={{ fontSize: "0.8rem" }}
            >
              End Date
            </label>
            <input
              type="date"
              className="form-control shadow-sm border-0"
              style={{
                fontSize: "0.8rem",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                border: "2px solid #e2e8f0",
                transition: "all 0.3s ease",
              }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow =
                  "0 0 0 0.2rem rgba(102, 126, 234, 0.25)";
                e.target.style.background = "#ffffff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
                e.target.style.background =
                  "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
              }}
            />
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-2 d-flex align-items-end">
          <button
            onClick={handleViewClick}
            className="btn btn-primary shadow-sm font-weight-bold text-uppercase w-100"
            style={{
              fontSize: "0.8rem",
              height: "40px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgb(0 0 0) 0%, rgb(75 97 162) 100%)",
              border: "none",
              transition: "all 0.3s ease",
              letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.4)";
              e.target.style.background =
                "linear-gradient(135deg, rgb(0 0 0) 0%, rgb(75 97 162) 100%)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
              e.target.style.background =
                "linear-gradient(135deg, rgb(0 0 0) 0%, rgb(75 97 162) 100%)";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "translateY(0) scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "translateY(-2px) scale(1)";
            }}
          >
            View
          </button>
        </div>
      </div>

      {isTableVisible && (
        <div className="table-container">
          <DataGrid rows={rows} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default HomeReports;
