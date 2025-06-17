import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../Applicant/Applicant.css";
import { MDBDataTable } from "mdbreact";
// import Table from "react-bootstrap/Table";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import jwt from "jwt-decode";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import DataGrid from "../shared_components/Grid";
// import AdminTabs from "./AdminTabs";
import BOM from "./BOM";
import { ToastContainer, toast } from "react-toastify";
import { UpdateEventApproval } from "../Requests/mutators";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { white } from "material-ui/styles/colors";
import { Button, Tooltip } from "@mui/material";
const BOMAllEventRequestsList = () => {
  const [requestId, setRequestId] = useState(null);
  const [statusName, setStatusName] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userToken = localStorage.getItem("accessToken");
  const decodedToken = jwt(userToken);
  const empID = decodedToken.nameid;

  const GetEvents = async (empID) => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-all-eventRequest/`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setEvents(response.data.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      // setError("Failed to fetch events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (eventId) => {
    const toastId = "delete-confirmation"; // Unique ID to control this toast

    // Check if the confirmation toast is already active
    if (toast.isActive(toastId)) return;

    toast(
      <div>
        Are you sure you want to delete this event?
        <div className="mt-2">
          <button
            style={{
              backgroundColor: "green",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "3px",
            }}
            onClick={async () => {
              toast.dismiss(toastId); // Dismiss the confirmation toast
              try {
                const response = await axios.delete(
                  `${URL.BASE_URL}/api/EventEntity/delete/${eventId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${getToken()}`,
                    },
                  }
                );
                // Success toast
                toast.success("Event deleted successfully!");
                // Refresh events
                GetEvents(empID);
              } catch (error) {
                console.error("Error deleting event:", error);
                // Error toast
                toast.error("Failed to delete event. Please try again.");
              }
            }}
          >
            Yes
          </button>
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "3px",
              marginLeft: "10px",
            }}
            onClick={() => toast.dismiss(toastId)}
          >
            No
          </button>
        </div>
      </div>,
      {
        toastId: toastId, // Ensure it's unique
        autoClose: false,
        closeButton: false,
        position: "top-center",
      }
    );
  };

  const handleUpdate = (eventId) => {
    window.location.href = `/update-event/${eventId}`;
  };

  useEffect(() => {
    GetEvents(empID);
  }, [empID]);
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
                  pathname: "/all-event-request-details-bom",
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
      field: "id",
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
  ];

  const rows = events.map((event, i) => ({
    Number: i + 1,
    id: event.eventId,
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
  }));
  // const data = {
  //   columns: [
  //     // { label: "Organizer Email", field: "OrganizerEmail", sort: "asc" },
  //     { label: "#", field: "Number", sort: "asc" },
  //     { label: "Title", field: "eventTitle", sort: "asc" },
  //     { label: "Organizer Name", field: "OrganizerName", sort: "asc" },
  //     { label: "Organizer Mobile", field: "OrganizerMobile", sort: "asc" },
  //     { label: "Organizer Email", field: "OrganizerEmail", sort: "asc" },
  //     {
  //       label: "Approving Deptartment",
  //       field: "approvingDeptName",
  //       sort: "asc",
  //     },
  //     { label: "Start Date", field: "eventStartDate", sort: "asc" },
  //     { label: "End Date", field: "eventEndDate", sort: "asc" },
  //     { label: "Creation Date", field: "createdAt", sort: "asc" },
  //     { label: "Confrimation Date", field: "confirmedAt", sort: "asc" },
  //     { label: "Modification Date", field: "updateAt", sort: "asc" },
  //     { label: "Status", field: "statusName", sort: "asc" },
  //     { label: "Action", field: "actions", sort: "disabled" },
  //   ],
  //   rows: events.map((event, i) => ({
  //     Number: i + 1,
  //     eventId: event.eventId,
  //     createdAt: new Date(event.createdAt).toLocaleDateString(),
  //     updateAt: event.updateAt
  //       ? new Date(event.updateAt).toLocaleDateString()
  //       : "N/A",
  //     confirmedAt: event.confirmedAt
  //       ? new Date(event.confirmedAt).toLocaleDateString()
  //       : "N/A",
  //     eventTitle: event.eventTitle,
  //     eventStartDate: new Date(event.eventStartDate).toLocaleDateString(),
  //     eventEndDate: new Date(event.eventEndDate).toLocaleDateString(),
  //     OrganizerName: event.organizerName || "N/A",
  //     approvingDeptName: event.approvingDeptName || "N/A",
  //     OrganizerMobile: "0" + event.organizerMobile || "N/A",
  //     organizerEmail: event.organizerEmail || "N/A",
  //     statusName: event.statusName,
  //     actions: (
  //       <>
  //         <Link
  //           to={{
  //             pathname: "/all-event-request-details-coo",
  //             state: {
  //               requestId: event.eventId,
  //               statusName: event.statusName,
  //             },
  //           }}
  //         >
  //           <button
  //             type="button"
  //             className="btn btn-success btn-sm mb-1"
  //             style={{
  //               backgroundColor: "#57636f",
  //               fontSize: "0.7rem",
  //               width: "auto",
  //               padding: "0.25rem 0.6rem",
  //               whiteSpace: "nowrap",
  //             }}
  //           >
  //             View
  //           </button>
  //         </Link>
  //       </>
  //     ),
  //   })),
  // };

  return (
    <div className="my-events">
      <BOM />
      {error && <Alert variant="danger">{error}</Alert>}

      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div
          className="table-container"
          style={{
            overflowX: "hidden",
            maxHeight: "600px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            padding: "16px",
            backgroundColor: "#fff",
            marginTop: "20px",
            width: "98%",
            maxWidth: "98%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            style={{
              minWidth: "100%",
              fontFamily: "Segoe UI, sans-serif",
              fontSize: "0.7rem",
            }}
            rowHeight={40}
            headerHeight={50}
            columnHeaderStyle={{
              backgroundColor: "#f8f9fa",
              fontWeight: "bold",
              borderBottom: "1px solid #dee2e6",
            }}
            getRowClassName={() => "custom-row"}
          />
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default BOMAllEventRequestsList;
