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
import PresidentTabs from "./PresidentTabs";
import President from "./President";

const BusinessRequestListPRE = () => {
  const [businessRequest, setbusinessRequest] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);
  const userToken = localStorage.getItem("accessToken");
  const decodedToken = jwt(userToken);
  const userID = parseInt(decodedToken.UserID, 10);

  const GetBusinessRequest = async () => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/BusinessRequest/GetTravelBusinessRequestPresident`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      setbusinessRequest(response.data);
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
      { label: "Name", field: "requestName", sort: "asc" },
      { label: "Email", field: "email", sort: "asc" },
      // { label: "Head Department", field: "parentDep", sort: "asc" },
      { label: "Department", field: "dep", sort: "asc" },
      { label: "Travellers", field: "travellersList", sort: "asc" },
      { label: "Creation Date", field: "createdAt", sort: "asc" },
      { label: "Modification Date", field: "updatedAt", sort: "asc" },
      { label: "Status", field: "statusName", sort: "asc" },
      { label: "Action", field: "action", sort: "asc" },
    ],
    rows: businessRequest.map((data, i) => ({
      Number: i + 1,
      requestId: data.requestId,
      requestName: data.requestName,
      email: data.email,
      parentDep: data.parentDep ?? data.dep,
      dep: data.dep,
      planeClass: data.planeClass,
      travellersList:
        data.travellersList === 0
          ? "No Traveler"
          : `${data.travellersList} Traveler(s)`,
      createdAt: new Date(data.createdAt).toLocaleDateString(),
      updatedAt:
        data.updatedAt == "Date Modification Doesn't Exist"
          ? "No Modification"
          : new Date(data.updatedAt).toLocaleDateString(),
      statusName: data.statusName,
      action: (
        <div className="d-flex justify-content-around">
          <Link
            to={{
              pathname: "/business-request-details-president",
              state: { requestId: data.requestId, statusName: data.statusName },
            }}
          >
            {data.statusName == "Pending" ? (
              <button type="button" className="btn btn-success btn-sm">
                Decide
              </button>
            ) : data.statusName == "Approved" ? (
              <button
                type="button"
                // style={{ backgroundColor: "green" }}
                className="btn btn-success btn-sm"
              >
                View
              </button>
            ) : data.statusName == "Rejected" ? (
              <button type="button" className="btn btn-success btn-sm">
                View
              </button>
            ) : null}
          </Link>
        </div>
      ),
    })),
  };

  return (
    <div className="my-home-requests">
      {/* <h4>President Portal</h4> */}
      <PresidentTabs />
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="row">
          <Table responsive>
            <MDBDataTable
              className="custom-table"
              striped
              bordered
              hover
              data={data}
              order={["Number", "asc"]}
              entries={10}
            />
          </Table>
        </div>
      )}
    </div>
  );
};

export default BusinessRequestListPRE;
