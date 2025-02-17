import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import DataGrid from "../shared_components/Grid";
import "./BusinessReports.css"; // Import the external CSS

const BusinessReports = () => {
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

  const columns = [
    { field: "serial", headerName: "#", width: 150 },
    { field: "requestName", headerName: "Name", width: 300 },
    { field: "isAcademic", headerName: "Academic Status", width: 150 },
    { field: "dep", headerName: "Department", width: 150 },
    { field: "travelType", headerName: "Travel Type", width: 150 },
    { field: "budgetlineType", headerName: "Budget Line Type", width: 190 },
    { field: "budgetlineName", headerName: "Budget Line Name", width: 190 },
    { field: "eventStartDate", headerName: "Event Start Date", width: 150 },
    { field: "eventEndDate", headerName: "Event End Date", width: 190 },
    { field: "travellerList", headerName: "Travelers List", width: 250 },
    {
      field: "hasTransportation",
      headerName: "Has Transfer",
      width: 190,
    },
    {
      field: "transportationCurrency",
      headerName: "Transfer Currency",
      width: 190,
    },
    {
      field: "transportationAmount",
      headerName: "Transfer Amount",
      width: 190,
    },
    { field: "hasAccomdation", headerName: "Has Accomdation", width: 190 },
    {
      field: "accomdationCurrency",
      headerName: "Accomdation Currency",
      width: 190,
    },
    {
      field: "accomdationAmount",
      headerName: "Accomdation Amount",
      width: 190,
    },
    { field: "hasVisa", headerName: "Has Visa", width: 190 },
    {
      field: "visaCurrency",
      headerName: "Visa Currency",
      width: 190,
    },
    {
      field: "visaAmount",
      headerName: "Visa Amount",
      width: 190,
    },
    {
      field: "hasRegistrationFee",
      headerName: "Has RegistrationFee",
      width: 190,
    },
    {
      field: "registrationFeeCurrency",
      headerName: "RegistrationFee Currency",
      width: 190,
    },
    {
      field: "registrationFeeAmount",
      headerName: "RegistrationFee Amount",
      width: 190,
    },
    { field: "hasAllowance", headerName: "Has Allowance", width: 190 },
    {
      field: "totalAllowanceAmountUSD",
      headerName: "Allowance USD Amount",
      width: 190,
    },
    {
      field: "totalAllowanceAmountEGP",
      headerName: "Allowance EGP Amount",
      width: 190,
    },
    {
      field: "totalAllowanceAmountEUR",
      headerName: "Allowance EUR Amount",
      width: 190,
    },
    {
      field: "totalAllowanceAmountGBP",
      headerName: "Allowance GBP Amount",
      width: 190,
    },
    { field: "budgetCode", headerName: "Budget Code", width: 190 },
    { field: "budgetCostCenter", headerName: "Budget Cost Center", width: 190 },
    { field: "budgetNotes", headerName: "Budget Notes", width: 190 },
    { field: "statusName", headerName: "Status", width: 190 },
    { field: "createdAt", headerName: "Submission Date", width: 190 },
    { field: "updateAt", headerName: "Modification Date", width: 190 },
  ];

  const rows = businessrequests.map((row, index) => ({
    id: index + 1,
    requestId: row.requestId,
    serial: row.serial == null ? "N/A" : row.serial,
    requestName: row.requestName,
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
    <div className="container">
      <select
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
        className="select-dropdown"
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
          <label>Event Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="date-input">
          <label>Event End Date</label>
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

export default BusinessReports;
