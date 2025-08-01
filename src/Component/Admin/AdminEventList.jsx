import React, { useState, useEffect } from "react";
import "./Applicant.css";
import { MDBDataTable } from "mdbreact";
import Table from "react-bootstrap/Table";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import jwt from "jwt-decode";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Admin from "./Admin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
const AdminEventList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userToken = localStorage.getItem("accessToken");
  const decodedToken = jwt(userToken);
  const empID = decodedToken.nameid;

  const GetEvents = async (empID) => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-events-by-empId/${empID}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setEvents(response.data);
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
                toast.success("Event Deleted!");
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

  const data = {
    columns: [
      { label: "#", field: "Number", sort: "asc" },
      { label: "Title", field: "eventTitle", sort: "asc" },
      { label: "Organizer Name", field: "OrganizerName", sort: "asc" },
      //{ label: "Organizer Mobile", field: "OrganizerMobile", sort: "asc" },
      //{ label: "Organizer Email", field: "OrganizerEmail", sort: "asc" },
      //{ label: "Organizer Email", field: "OrganizerEmail", sort: "asc" }
      {
        label: "Approving Deptartment",
        field: "approvingDeptName",
        sort: "asc",
      },
      // { label: "Start Date", field: "eventStartDate", sort: "asc" },
      // { label: "End Date", field: "eventEndDate", sort: "asc" },
      { label: "Creation Date", field: "createdAt", sort: "asc" },
      { label: "Confrimation Date", field: "confirmedAt", sort: "asc" },
      { label: "Modification Date", field: "updateAt", sort: "asc" },
      { label: "Approver", field: "approvalName", sort: "asc" },
      { label: "Status", field: "statusName", sort: "asc" },
      { label: "Action", field: "actions", sort: "disabled" },
    ],
    rows: events.map((event, i) => ({
      Number: i + 1,
      eventId: event.eventId,
      createdAt: new Date(event.createdAt).toLocaleDateString(),
      updateAt: event.updateAt
        ? new Date(event.updateAt).toLocaleDateString()
        : "N/A",
      confirmedAt: event.confirmedAt
        ? new Date(event.confirmedAt).toLocaleDateString()
        : "N/A",
      eventTitle: event.eventTitle,
      eventStartDate: new Date(event.eventStartDate).toLocaleDateString(),
      eventEndDate: new Date(event.eventEndDate).toLocaleDateString(),
      OrganizerName: event.organizerName || "N/A",
      approvingDeptName: event.approvingDeptName || "N/A",
      //OrganizerMobile: event.organizerMobile || "N/A",
      //OrganizerEmail : event.OrganizerEmail || "N/A",
      approvalName: event.approvalName || "N/A",
      statusName:
        event.statusName == "Pending"
          ? "Pending"
          : event.statusName == "public Affairs Approved"
          ? "Public Affairs"
          : event.statusName == "OfficeOfThePresident Approved"
          ? "Office Of The President Approved"
          : event.statusName == "OfficeOfThePresident Rejected"
          ? "Office Of The President Rejected"
          : event.statusName == "BudgetOffice Approved"
          ? "Budget Office Approved"
          : event.statusName == "BOM Approved"
          ? "BO Manager Approved"
          : event.statusName == "BOM Rejected"
          ? "BO Manager Rejected"
          : event.statusName == "EAF Approved"
          ? "Estate & Facilities Director Approved"
          : event.statusName == "EAF Rejected"
          ? "Estate & Facilities Director Rejected"
          : event.statusName,
      actions: (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ gap: "0.4rem" }}
        >
          <Link
            to={{
              pathname: "/hod-my-event-request-details",
              state: {
                requestId: event.eventId,
                statusName: event.statusName,
              },
            }}
          >
            <button
              type="button"
              className="btn btn-success btn-sm mb-1"
              style={{
                backgroundColor: "#57636f",
                fontSize: "0.7rem",
                width: "auto",
                padding: "0.25rem 0.6rem",
                whiteSpace: "nowrap",
              }}
            >
              View
            </button>
          </Link>

          {event.confirmedAt == null ? (
            <button
              className="btn btn-danger btn-sm mb-1"
              style={{
                fontSize: "0.7rem",
                width: "auto",
                padding: "0.25rem 0.6rem",
                whiteSpace: "nowrap",
              }}
              onClick={() => handleDelete(event.eventId)}
            >
              Delete
            </button>
          ) : null}
        </div>
      ),
    })),
  };

  return (
    <div className="my-events">
      <Admin />
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
            overflowY: "hidden",
            // maxHeight: "600px",
            // border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            // padding: "16px",
            // backgroundColor: "#fff",
            // marginTop: "20px",
            width: "97%",
            maxWidth: "97%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div className="table-responsive">
            <MDBDataTable
              className="custom-table"
              striped
              bordered
              hover
              data={data}
              order={["Number", "asc"]}
              entries={10}
            />
          </div>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AdminEventList;
