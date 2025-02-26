import React, { useState, useEffect } from "react";
import "../Applicant/Applicant.css";
import { MDBDataTable } from "mdbreact";
import Table from "react-bootstrap/Table";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import { Link } from "react-router-dom";
import jwt from "jwt-decode";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Admin from "../Admin/Admin";
import COO from "./COO";
const BusinessRequestListCOO = () => {
  const [businessRequest, setbusinessRequest] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);
  const userToken = localStorage.getItem("accessToken");
  const decodedToken = jwt(userToken);
  const userID = parseInt(decodedToken.UserID, 10);

  const GetBusinessRequest = async () => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-eventRequestCOO`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response:", response.data);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setbusinessRequest(data);
  
    } catch (error) {
      console.error("Error fetching home request details:", error);
      setError("Failed to fetch home requests. Please try again later.");
    } finally {
      setisLoading(false);
    }
  };
  

  useEffect(() => {
    GetBusinessRequest();
  }, []);

  const data = {
    columns: [
      { label: "#", field: "Number", sort: "asc" },
      { label: "Event Title", field: "eventTitle", sort: "asc" },
      { label: "Organizer Name", field: "organizerName", sort: "asc" },
      // { label: "Organizer Mobile", field: "OrganizerMobile", sort: "asc" },
      // { label: "Organizer Extention", field: "OrganizerExtension", sort: "asc" },
      // { label: "Organizer Email", field: "OrganizerEmail", sort: "asc" },
      { label: "Approving Department", field: "approvingDeptName", sort: "asc" },
      { label: "Start Date", field: "eventStartDate", sort: "asc" },
      { label: "End Date", field: "eventEndDate", sort: "asc" },
      { label: "Created At", field: "createdAt", sort: "asc" },
      { label: "Updated At", field: "updateAt", sort: "asc" },
      { label: "Confirmed At", field: "confirmedAt", sort: "asc" },
      { label: "Status", field: "statusName", sort: "asc" },
      { label: "Actions", field: "actions", sort: "disabled" },
    ],
    rows: businessRequest.map((data, i) => ({
      Number: i + 1,
      eventTitle: data.eventTitle,
      organizerName: data.organizerName,
      // OrganizerMobile: data.OrganizerMobile,
      // OrganizerExtension: data.OrganizerExtension,
      // OrganizerEmail: data.OrganizerEmail,
      approvingDeptName: data.approvingDeptName,
      eventStartDate: new Date(data.eventStartDate).toLocaleDateString(),
      eventEndDate: new Date(data.eventEndDate).toLocaleDateString(),
      createdAt: new Date(data.createdAt).toLocaleDateString(),
      updateAt: new Date(data.updateAt).toLocaleDateString(),
      confirmedAt: new Date(data.confirmedAt).toLocaleDateString(),
      statusName: data.statusName,
      actions: (
        <div className="d-flex justify-content-around">
          <Link
            to={{
              pathname: "/business-request-details-vcb",
              state: { requestId: data.requestId, statusName: data.statusName },
            }}
          >
            {data.statusName === "Pending" ? (
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  color: "white",
                  backgroundColor: "#343a40",
                  borderColor: "#343a40"
                }}
              >
                Decide
              </button>
            ) : (
              <button type="button" className="btn btn-info btn-sm">
                View
              </button>
            )}
          </Link>
        </div>
      ),
      
    })),
  };
  

  return (
    <div className="my-home-requests">
      {/* <h4>Head of Department Portal</h4>
      <AdminTabs /> */}
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
    </div>
  );
};

export default BusinessRequestListCOO;
