import React, { useState, useEffect, useCallback, useMemo } from "react";
import URL from "../Util/config";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import {
  AddHomeApprovalRequest,
  AddVCBHomeApprovalRequest,
} from "../Requests/mutators";
import { getToken } from "../Util/Authenticate";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";

const HomeRequestDetailsVCB = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [planeClasses, setPlaneClasses] = useState([]);
  const location = useLocation();
  const history = useHistory();
  const requestId = useMemo(() => {
    if (location.state) {
      let saverequestId = JSON.stringify(location.state.requestId);
      localStorage.setItem("requestId", saverequestId);
      let saverequeststatus = JSON.stringify(location.state.statusname);
      localStorage.setItem("status", saverequeststatus);
    }
    return JSON.parse(localStorage.getItem("requestId"));
  }, [location.state]);

  let status = JSON.parse(localStorage.getItem("status"));

  const [homeTravelData, setHomeTravelData] = useState({
    requestId: requestId,
    planeClass: "",
    planeClassID: 0,
    numberOfDependents: 0,
    firstDepartureAirportName: "",
    firstArrivalAirportName: "",
    secondDepartureAirportName: "",
    secondArrivalAirportName: "",
    departureDate: null,
    arrivalDate: null,
    updatedAt: null,
    passportName: "",
    passportNumber: "",
    issueDate: null,
    expiryDate: null,
    dateOfBirth: null,
    dependentTravellers: [
      {
        dependentTravellersId: 0,
        name: "",
        relation: "",
        passportNumber: "",
        issueDate: null,
        expiryDate: null,
        dateOfBirth: null,
      },
    ],
  });

  const [approvalData, setApprovalData] = useState({
    requestId: requestId,
    approvalLevelId: 0,
    userId: 0,
    status: 0,
    createdAt: null,
  });
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);

  const GetApprovalDepartmentSchema = () => {
    var data = "";
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/BusinessRequest/get-approval-departments-schema`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        setapprovalDepartments(response.data);
      })
      .catch(function (error) {});
  };
  const getPlaneClasses = useCallback(() => {
    axios
      .get(`${URL.BASE_URL}/api/PlaneClass/GetAllPlaneClass`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setPlaneClasses(response.data))
      .catch((error) => console.error("Error fetching plane classes:", error));
  }, []);

  const getHomeRequestDetails = useCallback(async (requestId) => {
    try {
      const response = await axios.post(
        `${URL.BASE_URL}/api/HomeRequest/get-by-id`,
        requestId,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Directly use the date from the response, assuming it's in YYYY-MM-DD format
      const formattedDepartureDate = response.data.departureDate
        ? response.data.departureDate.split("T")[0]
        : "";
      const formattedArrivalDate = response.data.arrivalDate
        ? response.data.arrivalDate.split("T")[0]
        : "";
      const formattedPassportIssueDate = response.data.issueDate
        ? response.data.issueDate.split("T")[0]
        : "";
      const formattedPassportExpiryDate = response.data.expiryDate
        ? response.data.expiryDate.split("T")[0]
        : "";
      const formattedPassportDateofBirth = response.data.dateOfBirth
        ? response.data.dateOfBirth.split("T")[0]
        : "";
      // Format the dates inside dependentTravellers
      const formattedDependentTravellers =
        response.data.dependentTravellers.map((traveller) => ({
          ...traveller,
          issueDate: traveller.issueDate
            ? traveller.issueDate.split("T")[0]
            : null,
          expiryDate: traveller.expiryDate
            ? traveller.expiryDate.split("T")[0]
            : null,
          dateOfBirth: traveller.dateOfBirth
            ? traveller.dateOfBirth.split("T")[0]
            : null,
        }));
      setHomeTravelData({
        ...response.data,
        departureDate: formattedDepartureDate,
        arrivalDate: formattedArrivalDate,
        issueDate: formattedPassportIssueDate,
        expiryDate: formattedPassportExpiryDate,
        dateOfBirth: formattedPassportDateofBirth,
        dependentTravellers: formattedDependentTravellers,
      });
    } catch (error) {
      console.error("Error fetching home request details:", error);
    }
  }, []);
  const getRoleID = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.RoleID; // Adjust the key based on the structure of your token
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };
  const roleID = getRoleID();
  var roleIDParsed = parseInt(roleID, 10);
  const handleApproval = useCallback(
    async (statusId) => {
      try {
        setIsLoading(true);
        // Create a new object with the updated status
        const updatedApprovalData = {
          ...approvalData,
          status: statusId,
          createdAt: new Date().toISOString(), // Ensure `createdAt` is set with a valid date
        };
        if (roleIDParsed == 8) {
          // Create a new object with the updated status
          const updatedApprovalData = {
            ...approvalData,
            status: statusId,
            approvalLevelId: 3,
            createdAt: new Date().toISOString(), // Ensure `createdAt` is set with a valid date
          };
          await AddHomeApprovalRequest(updatedApprovalData);
          setIsLoading(false);
          if (statusId == 1) {
            toast.success("Request Approved successfully", {
              position: "top-center",
            });
          } else {
            toast.error("Request Rejected!", {
              position: "top-center",
            });
          }
          history.push("/home-request-list-vcb");
        } else {
          // Create a new object with the updated status
          const updatedApprovalData = {
            ...approvalData,
            status: statusId,
            approvalLevelId: 3,
            createdAt: new Date().toISOString(), // Ensure `createdAt` is set with a valid date
          };
          await AddHomeApprovalRequest(updatedApprovalData);
          setIsLoading(false);
          if (statusId == 1) {
            toast.success("Request Approved successfully", {
              position: "top-center",
            });
          } else {
            toast.error("Request Rejected!", {
              position: "top-center",
            });
          }
          history.push("/home-request-list-vcb");
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error while updating user details:", error);
        toast.error("Error while updating user details, please try again", {
          position: "top-center",
        });
      }
    },
    [approvalData, setIsLoading]
  );

  useEffect(() => {
    setIsLoading(false);
    getHomeRequestDetails(requestId);
    GetApprovalDepartmentSchema();
    getPlaneClasses();
  }, [getHomeRequestDetails, getPlaneClasses, requestId]);

  return (
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-lg-10 col-xl-8">
        <div className="card" style={{ padding: "30px" }}>
          <div className="card-body">
            <h3 className="card-header text-center mb-4">
              Home Leave Request Details
            </h3>
            <ValidatorForm className="px-md-4">
              <div className="horizontal-rule mb-4">
                <h5 className="horizontal-rule-text">Contact Section</h5>
              </div>
              <div>
                <label htmlFor="passportName" className="form-label fs-6 ">
                  Contact Email
                </label>
                <input
                  type="text"
                  id="passportName"
                  name="passportName"
                  value={homeTravelData.email}
                  className="form-control form-control-lg"
                  disabled
                  pattern="[a-zA-Z ]+"
                />
              </div>
              <div className="horizontal-rule mb-4">
                <h5 className="horizontal-rule-text">Department Info</h5>
              </div>
              <div className="mb-4 flex-grow-1">
                <select
                  className="form-select form-select-lg custom-select"
                  value={homeTravelData.approvingDepName} // Access the planeClassId inside transportation
                  onChange={(e) => {
                    setHomeTravelData({
                      ...homeTravelData,
                      approvingDepName: e.target.value,
                    });
                  }}
                  name="approvingDepName"
                  disabled
                >
                  <option value="">Choose your department</option>
                  {approvalDepartments.map((data) => (
                    <option key={data.depName} value={data.depName}>
                      {data.depName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="horizontal-rule mb-4">
                {" "}
                {/* Increased bottom margin */}
                <h5 className="horizontal-rule-text">Passport Section</h5>
              </div>
              <div className="container">
                <div className="row">
                  {/* Passport Name */}
                  <div className="col-md-6 mb-4">
                    <label htmlFor="passportName" className="form-label fs-6 ">
                      Name (Per Passport):
                    </label>
                    <input
                      type="text"
                      id="passportName"
                      name="passportName"
                      value={homeTravelData.passportName}
                      className="form-control form-control-lg"
                      disabled
                      pattern="[a-zA-Z ]+"
                    />
                  </div>
                  {/* Passport Number */}
                  <div className="col-md-6 mb-4">
                    <label
                      htmlFor="passportNumber"
                      className="form-label fs-6 "
                    >
                      Passport Number:
                    </label>
                    <input
                      type="text"
                      id="passportNumber"
                      name="passportNumber"
                      value={homeTravelData.passportNumber}
                      className="form-control form-control-lg"
                      disabled
                      pattern="[a-zA-Z0-9]+"
                    />
                  </div>
                </div>

                <div className="row">
                  {/* Passport Issue Date */}
                  <div className="col-md-4 mb-4">
                    <label htmlFor="issueDate" className="form-label fs-6 ">
                      Passport Issue Date:
                    </label>
                    <input
                      type="date"
                      id="issueDate"
                      name="issueDate"
                      value={homeTravelData.issueDate}
                      className="form-control form-control-lg custom-date-input"
                      disabled
                      //max={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Passport Expiry Date */}
                  <div className="col-md-4 mb-4">
                    <label htmlFor="expiryDate" className="form-label fs-6 ">
                      Passport Expiry Date:
                    </label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={homeTravelData.expiryDate}
                      disabled
                      className="form-control form-control-lg custom-date-input"
                      //min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Birth Date */}
                  <div className="col-md-4 mb-4">
                    <label htmlFor="dateOfBirth" className="form-label fs-6 ">
                      Birth Date (Per Passport):
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={homeTravelData.dateOfBirth}
                      disabled
                      className="form-control form-control-lg custom-date-input"
                    />
                  </div>
                </div>
              </div>
              <div className="horizontal-rule mb-4">
                <h5 className="horizontal-rule-text">
                  Number of Travelers (If Any)
                </h5>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1.5rem",
                }}
              >
                {homeTravelData.dependentTravellers.map((traveller, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexWrap: "wrap", // Allows wrapping for responsiveness
                      gap: "1.5rem",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Grouping input fields in a div to align them in rows of three */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1.5rem",
                      }}
                    >
                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Name (as in Passport)
                        </label>
                        <input
                          type="text"
                          id={`dependentName-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.name}
                          name={`dependentName-${index}`}
                          disabled
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Relation
                        </label>
                        <input
                          type="text"
                          id={`relation-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.relation}
                          name={`relation-${index}`}
                          disabled
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Passport Number
                        </label>
                        <input
                          type="text"
                          id={`passportNumber-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.passportNumber}
                          name={`passportNumber-${index}`}
                          disabled
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Passport Issue Date
                        </label>
                        <input
                          type="text"
                          id={`issueDate-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.issueDate}
                          name={`issueDate-${index}`}
                          disabled
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Passport Expiry Date
                        </label>
                        <input
                          type="text"
                          id={`expiryDate-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.expiryDate}
                          name={`expiryDate-${index}`}
                          disabled
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Date of Birth
                        </label>
                        <input
                          type="text"
                          id={`dateOfBirth-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.dateOfBirth}
                          name={`dateOfBirth-${index}`}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="horizontal-rule mb-4">
                <h5 className="horizontal-rule-text">Flight Class</h5>
              </div>
              <div className="form-outline mb-4">
                <select
                  className="form-select form-select-lg"
                  value={homeTravelData.planeClassID}
                  name="planeClassID"
                  disabled
                >
                  <option value="" disabled>
                    Select Flight Class
                  </option>
                  {planeClasses.map((data) => (
                    <option key={data.planeClassId} value={data.planeClassId}>
                      {data.planeClassName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="horizontal-rule mb-4">
                <h5 className="horizontal-rule-text">Itinerary (Airport)</h5>
              </div>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="firstDepartureAirportName"
                    className="form-label form-label-lg"
                  >
                    From:
                  </label>
                  <input
                    type="text"
                    id="firstDepartureAirportName"
                    name="firstDepartureAirportName"
                    value={homeTravelData.firstDepartureAirportName}
                    className="form-control form-control-lg"
                    placeholder="Enter airport name"
                    disabled
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="firstArrivalAirportName"
                    className="form-label form-label-lg"
                  >
                    To:
                  </label>
                  <input
                    type="text"
                    id="firstArrivalAirportName"
                    name="firstArrivalAirportName"
                    value={homeTravelData.firstArrivalAirportName}
                    className="form-control form-control-lg"
                    placeholder="Enter airport name"
                    disabled
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="departureDate"
                    className="form-label form-label-lg"
                  >
                    Departure Date:
                  </label>
                  <input
                    id="departureDate"
                    name="departureDate"
                    value={homeTravelData.departureDate}
                    className="form-control form-control-lg"
                    disabled
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  marginTop: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="secondDepartureAirportName"
                    className="form-label form-label-lg"
                  >
                    From:
                  </label>
                  <input
                    type="text"
                    id="secondDepartureAirportName"
                    name="secondDepartureAirportName"
                    value={homeTravelData.secondDepartureAirportName}
                    className="form-control form-control-lg"
                    placeholder="Enter airport name"
                    disabled
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="secondArrivalAirportName"
                    className="form-label form-label-lg"
                  >
                    To:
                  </label>
                  <input
                    type="text"
                    id="secondArrivalAirportName"
                    name="secondArrivalAirportName"
                    value={homeTravelData.secondArrivalAirportName}
                    className="form-control form-control-lg"
                    placeholder="Enter airport name"
                    disabled
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="arrivalDate"
                    className="form-label form-label-lg"
                  >
                    Return Date
                  </label>
                  <input
                    id="arrivalDate"
                    name="arrivalDate"
                    value={homeTravelData.arrivalDate}
                    className="form-control form-control-lg"
                    disabled
                  />
                </div>
              </div>
              {status == "Pending" ? (
                <>
                  <div className="row">
                    <div className="col-md-6">
                      <button
                        type="submit"
                        className="btn btn-success-approve btn-lg col-12 mt-4"
                        onClick={() => handleApproval(1)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Approving Request..." : "Approve"}
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button
                        type="submit"
                        className="btn btn-danger btn-lg col-12 mt-4"
                        disabled={isLoading}
                        onClick={() => handleApproval(0)}
                      >
                        {isLoading ? "Rejecting Request..." : "Reject"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <div>
                      {status == "Approved" ? (
                        <button
                          type="submit"
                          style={{ backgroundColor: "green" }}
                          className="btn btn-danger btn-lg col-12 mt-4"
                          disabled
                        >
                          Already Approved
                        </button>
                      ) : status == "Rejected" ? (
                        <button
                          type="submit"
                          className="btn btn-danger btn-lg col-12 mt-4"
                          disabled
                        >
                          Already Rejected
                        </button>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
            </ValidatorForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeRequestDetailsVCB;
