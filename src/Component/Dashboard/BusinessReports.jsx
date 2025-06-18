import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import DataGrid from "../shared_components/Grid";
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
import "./BusinessReports.css"; // Import the external CSS

const BusinessReports = () => {
  const [depId, setDepId] = useState([]);
  const [requestId, setRequestId] = useState(null);
  const [statusName, setStatusName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [businessrequests, setbusinessrequests] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);

  const GetAllDepartment = () => {
    axios
      .get(
        `${URL.BASE_URL}/api/Dashboard/get-businessRequest-all-departments`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((response) => setDepId(response.data))
      .catch((error) => console.error(error));
  };

  const GetBusinessRequest = async (startDate, endDate, deptId) => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/Dashboard/get-filtered-businessRequest?startDate=${startDate}&endDate=${endDate}&deptId=${deptId}`,
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
  const location = useLocation();
  const onView = (e, params) => {
    e.stopPropagation(); // don't select this row after clicking
    const api = params.api;
    const thisRow = {};

    //console.log('Params: ', params.row.rowId);
    api
      .getAllColumns()
      .filter((c) => c.field !== "__check__" && !!c)
      .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
    var current = location.pathname;
    window.open(`#${current}/view/${params.row.key}`, "_blank");
    //return alert(JSON.stringify(thisRow, null, 4));
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
                  pathname: "/business-request-details-dashboard",
                  state: {
                    requestId: params.row.requestId,
                    statusName: params.row.statusName,
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
      field: "serial",
      headerName: "Serial",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "requestName",
      headerName: "Name",
      width: 300,
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
      width: 300,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.phoneNumber}>
          <span className="table-cell-trucate">{params.row.phoneNumber}</span>
        </Tooltip>
      ),
    },
    {
      field: "isAcademic",
      headerName: "Academic Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.isAcademic}>
          <span className="table-cell-trucate">{params.row.isAcademic}</span>
        </Tooltip>
      ),
    },
    {
      field: "dep",
      headerName: "Department",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.dep}>
          <span className="table-cell-trucate">{params.row.dep}</span>
        </Tooltip>
      ),
    },
    {
      field: "travelType",
      headerName: "Travel Type",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.travelType}>
          <span className="table-cell-trucate">{params.row.travelType}</span>
        </Tooltip>
      ),
    },
    {
      field: "budgetlineType",
      headerName: "Budget Line Type",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.budgetlineType}>
          <span className="table-cell-trucate">
            {params.row.budgetlineType}
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
      field: "eventStartDate",
      headerName: "Event Start Date",
      width: 150,
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
      headerName: "Event End Date",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.eventEndDate}>
          <span className="table-cell-trucate">{params.row.eventEndDate}</span>
        </Tooltip>
      ),
    },
    {
      field: "travellerList",
      headerName: "Travelers List",
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hasTransportation",
      headerName: "Transfer",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "transportationCurrency",
      headerName: "Transfer Currency",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "transportationAmount",
      headerName: "Transfer Amount",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hasAccomdation",
      headerName: "Accommodation",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "accomdationCurrency",
      headerName: "Accommodation Currency",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "accomdationAmount",
      headerName: "Accommodation Amount",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.accomdationAmount}>
          <span className="table-cell-trucate">
            {params.row.accomdationAmount}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "hasVisa",
      headerName: "Visa",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "visaCurrency",
      headerName: "Visa Currency",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "visaAmount",
      headerName: "Visa Amount",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.visaAmount}>
          <span className="table-cell-trucate">{params.row.visaAmount}</span>
        </Tooltip>
      ),
    },
    {
      field: "hasRegistrationFee",
      headerName: "Registration Fee",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.hasRegistrationFee}>
          <span className="table-cell-trucate">
            {params.row.hasRegistrationFee}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "registrationFeeCurrency",
      headerName: "Registration Fee Currency",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "registrationFeeAmount",
      headerName: "Registration Fee Amount",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.registrationFeeAmount}>
          <span className="table-cell-trucate">
            {params.row.registrationFeeAmount}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "hasAllowance",
      headerName: "Allowance",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalAllowanceAmountUSD",
      headerName: "Allowance USD Amount",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.totalAllowanceAmountUSD}>
          <span className="table-cell-trucate">
            {params.row.totalAllowanceAmountUSD}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "totalAllowanceAmountEGP",
      headerName: "Allowance EGP Amount",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.totalAllowanceAmountEGP}>
          <span className="table-cell-trucate">
            {params.row.totalAllowanceAmountEGP}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "totalAllowanceAmountEUR",
      headerName: "Allowance EUR Amount",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.totalAllowanceAmountEUR}>
          <span className="table-cell-trucate">
            {params.row.totalAllowanceAmountEUR}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "totalAllowanceAmountGBP",
      headerName: "Allowance GBP Amount",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.totalAllowanceAmountGBP}>
          <span className="table-cell-trucate">
            {params.row.totalAllowanceAmountGBP}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "budgetCode",
      headerName: "Budget Code",
      width: 190,
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
      field: "budgetNotes",
      headerName: "Budget Notes",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.budgetNotes}>
          <span className="table-cell-trucate">{params.row.budgetNotes}</span>
        </Tooltip>
      ),
    },
    {
      field: "statusName",
      headerName: "Status",
      width: 250,
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
    },
    {
      field: "updateAt",
      headerName: "Modification Date",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
  ];

  const rows = businessrequests.map((row, index) => ({
    id: index + 1,
    requestId: row.requestId,
    serial: row.serial == null ? "N/A" : row.serial,
    requestName:
      row.requestName == "Youssef Youssef ."
        ? "Youssef Youssef"
        : row.requestName,
    phoneNumber: row.phoneNumber == null ? "N/A" : row.phoneNumber,
    isAcademic: row.isAcademic == 1 ? "Academic" : "Admin",
    dep: row.dep,
    travelType:
      row.travelType == 1
        ? "Domestic"
        : row.travelType == 2
        ? "International"
        : row.travelType == 3
        ? "Guest"
        : row.travelType,
    budgetlineType:
      row.budgetlineType == 1 ? "University Budget" : "Research Budget",
    budgetlineName: row.budgetlineName,
    travellerList: row.travellerList + " " + "Travelers",
    travelpurpose: row.travelpurpose,
    eventStartDate: new Date(row.createdAt).toLocaleDateString(),
    eventEndDate: new Date(row.eventEndDate).toLocaleDateString(),
    hasTransportation:
      row.hasTransportation == 1 ? "Requested" : "Not Requested",
    transportationCurrency:
      row.transportationCurrency == null
        ? "Not Requested"
        : row.transportationCurrency,
    transportationAmount:
      row.transportationAmount == null
        ? "Not Requested"
        : row.transportationAmount,
    hasAccomdation: row.hasAccomdation == 1 ? "Requested" : "Not Requested",
    accomdationCurrency:
      row.accomdationCurrency == null
        ? "Not Requested"
        : row.accomdationCurrency,
    accomdationAmount:
      row.accomdationAmount == null ? "Not Requested" : row.accomdationAmount,
    hasVisa: row.hasVisa == 1 ? "Requested" : "Not Requested",
    visaCurrency: row.visaCurrency == null ? "Not Requested" : row.visaCurrency,
    visaAmount: row.visaAmount == null ? "Not Requested" : row.visaAmount,
    hasRegistrationFee:
      row.hasRegistrationFee == 1 ? "Requested" : "Not Requested",
    registrationFeeCurrency:
      row.registrationFeeCurrency == null
        ? "Not Requested"
        : row.registrationFeeCurrency,
    registrationFeeAmount:
      row.registrationFeeAmount == null
        ? "Not Requested"
        : row.registrationFeeAmount,
    hasAllowance: row.hasAllowance == 1 ? "Requested" : "Not Requested",
    totalAllowanceAmountUSD:
      row.totalAllowanceAmountUSD == 0 ? "0.0" : row.totalAllowanceAmountUSD,
    totalAllowanceAmountEGP:
      row.totalAllowanceAmountEGP == 0 ? "0.0" : row.totalAllowanceAmountEGP,
    totalAllowanceAmountEUR:
      row.totalAllowanceAmountEUR == 0 ? "0.0" : row.totalAllowanceAmountEUR,
    totalAllowanceAmountGBP:
      row.totalAllowanceAmountGBP == 0 ? "0.0" : row.totalAllowanceAmountGBP,
    budgetCode:
      row.budgetCode == null || row.budgetCode == "" ? "N/A" : row.budgetCode,
    budgetCostCenter:
      row.budgetCostCenter == null || row.budgetCostCenter == ""
        ? "N/A"
        : row.budgetCostCenter,
    budgetNotes: row.budgetNotes == null ? "No Notes" : row.budgetNotes,
    statusName: row.statusName,
    createdAt: new Date(row.createdAt).toLocaleDateString(),
    updateAt:
      row.updateAt == null
        ? "No Modification"
        : new Date(row.createdAt).toLocaleDateString(),
  }));

  const handleViewClick = () => {
    GetBusinessRequest(startDate, endDate, selectedDepartment);
  };

  useEffect(() => {
    GetAllDepartment();
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
          <label style={{ fontSize: "0.8rem" }}>&nbsp;</label>{" "}
          {/* Empty label for alignment */}
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
          <label style={{ fontSize: "0.8rem" }}>Event Start Date</label>
          <input
            style={{
              fontSize: "0.8rem",
              height: "40px",
              minWidth: "150px",
            }}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div
          className="date-input"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label style={{ fontSize: "0.8rem" }}>Event End Date</label>
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

export default BusinessReports;
