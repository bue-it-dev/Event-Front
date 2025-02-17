import React, { useState, useEffect } from "react";
import "../Applicant/Applicant.css";
import { MDBDataTable } from "mdbreact";
import Table from "react-bootstrap/Table";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import { Link } from "react-router-dom";
import { DeleteHomeRequest } from "../Requests/mutators";
import jwt from "jwt-decode";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import PresidentTabs from "./PresidentTabs";
import { toast } from "react-toastify";

const PresidentMyRequests = () => {
  const [homerequests, sethomerequests] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);
  const userToken = localStorage.getItem("accessToken");
  const decodedToken = jwt(userToken);
  const empID = decodedToken.nameid;

  const GetHomeRequests = async (empID) => {
    try {
      const response = await axios.post(
        `${URL.BASE_URL}/api/HomeRequest/get-by-empId`,
        empID,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      sethomerequests(response.data);
    } catch (error) {
      console.error("Error fetching home request details:", error);
      setError("Failed to fetch home requests. Please try again later.");
    } finally {
      setisLoading(false);
    }
  };

  const onDelete = async (id) => {
    const confirmAction = () =>
      new Promise((resolve) => {
        const toastId = toast.info(
          <>
            <div style={{ textAlign: "center" }}>
              <p>Are you sure you want to confirm this request?</p>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => {
                    toast.dismiss(toastId); // Dismiss the toast
                    resolve(true); // Proceed with confirmation
                  }}
                  style={{
                    marginRight: "10px",
                    backgroundColor: "#7f0008",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(toastId); // Dismiss the toast
                    resolve(false); // Cancel the operation
                  }}
                  style={{
                    backgroundColor: "gray",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>,
          {
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            position: "top-center", // Center the toast
          }
        );
      });

    const userConfirmed = await confirmAction();
    if (userConfirmed) {
      try {
        setisLoading(true);
        await DeleteHomeRequest(id);
        toast.success("Operation completed successfully.", {
          position: "top-center",
        });
        sethomerequests((prev) =>
          prev.filter((request) => request.requestId !== id)
        );
      } catch (err) {
        toast.error("An error occurred. Please try again later", {
          position: "top-center",
        });
      } finally {
        setisLoading(false);
      }
    }
  };
  useEffect(() => {
    GetHomeRequests(empID);
  }, [empID]);

  const data = {
    columns: [
      { label: "#", field: "Number", sort: "asc" },
      { label: "Name", field: "requestName", sort: "asc" },
      // { label: "Head Department", field: "parentDep", sort: "asc" },
      { label: "Department", field: "dep", sort: "asc" },
      { label: "Class", field: "planeClass", sort: "asc" },
      { label: "Dependents", field: "numberOfDependents", sort: "asc" },
      { label: "Creation Date", field: "createdAt", sort: "asc" },
      { label: "Modification Date", field: "updatedAt", sort: "asc" },
      { label: "Status", field: "statusname", sort: "asc" },
      { label: "Action", field: "action", sort: "asc" },
    ],
    rows: homerequests.map((data, i) => ({
      Number: i + 1,
      requestId: data.requestId,
      requestName: data.requestName,
      parentDep: data.parentDep ?? data.dep,
      dep: data.dep,
      planeClass: data.planeClass,
      numberOfDependents:
        data.numberOfDependents === 0
          ? "No Dependent Traveler"
          : `${data.numberOfDependents} Traveler(s)`,
      createdAt: new Date(data.createdAt).toLocaleDateString(),
      updatedAt:
        data.updatedAt == "Date Modification Doesn't Exist"
          ? "No Modification"
          : new Date(data.updatedAt).toLocaleDateString(),
      statusname: data.statusname,
      action:
        data.statusname.toLowerCase() === "pending" ? (
          <div className="d-flex justify-content-around">
            <Link
              to={{
                pathname: "/home-request-details",
                state: {
                  requestId: data.requestId,
                  statusname: data.statusname,
                },
              }}
            >
              <button type="button" className="btn btn-success btn-sm">
                View
              </button>
            </Link>
            <button
              onClick={() => onDelete(data.requestId)}
              type="button"
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        ) : (
          <Link
            to={{
              pathname: "/home-request-details",
              state: { requestId: data.requestId, statusname: data.statusname },
            }}
          >
            <button type="button" className="btn btn-success btn-sm w-100">
              View
            </button>
          </Link>
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

export default PresidentMyRequests;
