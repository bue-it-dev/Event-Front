import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../Applicant/Applicant.css";
import { MDBDataTable } from "mdbreact";
import Table from "react-bootstrap/Table";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import jwt from "jwt-decode";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
// import AdminTabs from "./AdminTabs";
import COO from "./COO";
import { ToastContainer, toast } from "react-toastify";
import { UpdateEventApproval } from "../Requests/mutators";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { white } from "material-ui/styles/colors";
const AdminEventApprovalsList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userToken = localStorage.getItem("accessToken");
  const decodedToken = jwt(userToken);
  const empID = decodedToken.nameid;

  const GetEvents = async (empID) => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-eventRequestCOO/`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setEvents(response.data.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError("Failed to fetch events. Please try again later.");
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
                toast.success("Event deleted successfully!", {
                  position: "top-center",
                  autoClose: 3000,
                });
                // Refresh events
                GetEvents(empID);
              } catch (error) {
                console.error("Error deleting event:", error);
                // Error toast
                toast.error("Failed to delete event. Please try again.", {
                  position: "top-center",
                  autoClose: 3000,
                });
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
      { label: "Event Title", field: "eventTitle", sort: "asc" },
      { label: "Organizer Name", field: "OrganizerName", sort: "asc" },
      { label: "Organizer Mobile", field: "OrganizerMobile", sort: "asc" },
      { label: "Organizer Extention", field: "eventStartDate", sort: "asc" },
      { label: "Organizer Email", field: "organizerEmail", sort: "asc" },
      {
        label: "Approving Deptartment",
        field: "approvingDeptName",
        sort: "asc",
      },
      { label: "Start Date", field: "eventStartDate", sort: "asc" },
      { label: "End Date", field: "eventEndDate", sort: "asc" },
      { label: "Created At", field: "createdAt", sort: "asc" },
      { label: "Updated At", field: "updateAt", sort: "asc" },
      { label: "confirmed At", field: "confirmedAt", sort: "asc" },
      { label: "Status", field: "statusName", sort: "asc" },
      { label: "Actions", field: "actions", sort: "disabled" },
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
      OrganizerMobile: event.organizerMobile || "N/A",
      OrganizerExtension: event.organizerExtension || "N/A",
      organizerEmail: event.organizerEmail || "N/A",
      statusName: event.statusName,
      actions: (
        <>
          <Link
            to={{
              pathname: "/event-request-details-coo",
              state: {
                requestId: event.eventId,
                statusName: event.statusName,
              },
            }}
          >
            <button type="button" className="btn btn-sm" style={{ backgroundColor: "#343a40", color : white}}            >
            {event.statusName != "Pending" ? <>View</> : <>Decide</>}
            </button>
          </Link>
        </>
      ),
    })),
  };

  return (
    <div className="my-events">
      <COO />
      {error && <Alert variant="danger">{error}</Alert>}

      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="table-responsive-wrapper">
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

export default AdminEventApprovalsList;
