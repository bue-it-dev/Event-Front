import React, { useState, useEffect, useCallback, useMemo } from "react";
import URL from "../Util/config";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import {
  AddHRHomeApprovalRequest,
  AddHomeApprovalRequest,
} from "../Requests/mutators";
import { getToken } from "../Util/Authenticate";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { set } from "react-hook-form";
import { toast } from "react-toastify";

const HomeRequestDetailsHR = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [planeClasses, setPlaneClasses] = useState([]);
  const location = useLocation();
  const history = useHistory();
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
    staffNameHr: "",
    allowanceStartDate: null,
    allowanceEndDate: null,
    remainingBalance: 0,
    passportName: "",
    passportNumber: "",
    issueDate: null,
    expiryDate: null,
    dateOfBirth: null,
    hasRoundTicketID: -1, // Ensure this is initialized correctly
    approvalLevelId: 0,
    userId: 0,
    status: 0,
    createdAt: null,
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
  // Condition for rendering
  const shouldShowRemainingBalance =
    homeTravelData.hasRoundTicketID === 0 ? true : false;
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
      const formattedAllowaStartDate = response.data.allowanceStartDate
        ? response.data.allowanceStartDate.split("T")[0]
        : "";
      const formattedAllowaEndDate = response.data.allowanceEndDate
        ? response.data.allowanceEndDate.split("T")[0]
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
        allowanceStartDate: formattedAllowaStartDate,
        allowanceEndDate: formattedAllowaEndDate,
        dependentTravellers: formattedDependentTravellers,
      });
    } catch (error) {
      console.error("Error fetching home request details:", error);
    }
  }, []);

  const handleSubmitForm = useCallback(
    async (statusId) => {
      try {
        setIsLoading(true);

        // Create an object with only the fields you want to send
        if (homeTravelData.remainingBalance == null) {
          const payload = {
            requestId: homeTravelData.requestId,
            allowanceStartDate: homeTravelData.allowanceStartDate,
            allowanceEndDate: homeTravelData.allowanceEndDate,
            staffNameHr: homeTravelData.staffNameHr,
            remainingBalance: 0.0,
            hasRoundTicketID: homeTravelData.hasRoundTicketID,
          };
          console.log("Payload", payload);
          // Send the payload to the endpoint
          await AddHRHomeApprovalRequest(payload);
        } else {
          const payload = {
            requestId: homeTravelData.requestId,
            allowanceStartDate: homeTravelData.allowanceStartDate,
            allowanceEndDate: homeTravelData.allowanceEndDate,
            staffNameHr: homeTravelData.staffNameHr,
            remainingBalance: homeTravelData.remainingBalance,
            hasRoundTicketID: homeTravelData.hasRoundTicketID,
          };
          await AddHRHomeApprovalRequest(payload);
        }
        setIsLoading(false);
        toast.success("Operation completed successfully", {
          position: "top-center",
        });
        window.location.reload();
      } catch (error) {
        setIsLoading(false);
        console.error("Error while updating user details:", error);
        toast.error("Error while updating user details, please try again", {
          position: "top-center",
        });
      }
    },
    [homeTravelData, setIsLoading]
  );

  const handleSaveForm = useCallback(
    async (statusId) => {
      try {
        setIsLoading(true);
        const payload = {
          status: statusId,
          createdAt: new Date().toISOString(), // Ensure `createdAt` is set with a valid date
          approvalLevelId: 5,
          requestId: homeTravelData.requestId,
        };
        await AddHomeApprovalRequest(payload);
        setIsLoading(false);
        // alert("Submission Occurred Successfully");
        history.push("/home-request-list-hr");
      } catch (error) {
        setIsLoading(false);
        console.error("Error while updating user details:", error);
        toast.error("Error while updating user details, please try again", {
          position: "top-center",
        });
      }
    },
    [homeTravelData, setIsLoading]
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
                    Return Date:
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
              <div className="horizontal-rule mb-4">
                <hr />
                <h5 className="horizontal-rule-text fs-5">
                  Human Resources Section
                </h5>
                <br />
                <p
                  style={{
                    color: "#7f0008", // White text color
                    fontSize: "12px", // Smaller font size
                  }}
                >
                  Note: Clicking 'Save' will save the data with the option to
                  update later. Clicking 'Submit' will finalize the data, and no
                  further updates will be possible.
                </p>
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div className="mb-4 flex-grow-1">
                  <label htmlFor="departureDate" className="form-label fs-6">
                    Allowance Start Date:
                  </label>
                  <input
                    type="date"
                    id="allowanceStartDate"
                    name="allowanceStartDate"
                    value={homeTravelData.allowanceStartDate}
                    onChange={(e) => {
                      setHomeTravelData({
                        ...homeTravelData,
                        allowanceStartDate: e.target.value,
                      });
                    }}
                    className="form-control form-control-lg custom-date-input"
                    required
                  />
                </div>
                <div className="mb-4 flex-grow-1">
                  <label htmlFor="departureDate" className="form-label fs-6">
                    Allowance End Date:
                  </label>
                  <input
                    type="date"
                    id="allowanceEndDate"
                    name="allowanceEndDate"
                    value={homeTravelData.allowanceEndDate}
                    onChange={(e) => {
                      setHomeTravelData({
                        ...homeTravelData,
                        allowanceEndDate: e.target.value,
                      });
                    }}
                    className="form-control form-control-lg custom-date-input"
                    required
                  />
                </div>
                <div className="mb-4 flex-grow-1">
                  <label
                    htmlFor="hasRoundTripTicket"
                    className="form-label fs-6"
                  >
                    Benefits:
                  </label>
                  <select
                    className="form-select form-select-lg custom-select"
                    value={homeTravelData.hasRoundTicketID} // Ensure value is a string
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setHomeTravelData((prevState) => ({
                        ...prevState,
                        hasRoundTicketID: value,
                      }));
                    }}
                    name="hasRoundTicketID"
                    required
                  >
                    <option value="-1">Select an option</option>{" "}
                    {/* Default empty option */}
                    <option value="1">Round-Trip Ticket available</option>
                    <option value="2">Round-Trip Ticket consumed</option>
                    <option value="0">Balance</option>
                  </select>
                </div>
              </div>
              {shouldShowRemainingBalance ? (
                <div>
                  <label
                    htmlFor="firstDepartureAirportName"
                    className="form-label fs-6"
                  >
                    Remaining Balance in (GBP):
                  </label>
                  <input
                    type="number"
                    id="remainingBalance"
                    name="remainingBalance"
                    value={homeTravelData.remainingBalance}
                    onChange={(e) => {
                      const value = e.target.value;
                      const decimalValue =
                        value === "" ? "" : parseFloat(value); // Convert to float
                      setHomeTravelData({
                        ...homeTravelData,
                        remainingBalance: decimalValue,
                      });
                    }}
                    className="form-control form-control-lg"
                    required
                  />
                </div>
              ) : null}
              {status == "Pending" &&
              homeTravelData.staffNameHr == "Pending HR" ? (
                <>
                  <div className="row">
                    <div>
                      <button
                        type="submit"
                        className="btn btn-danger btn-lg col-12 mt-4"
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "16px",
                          backgroundColor: "#57636f",
                        }}
                        onClick={() => handleSubmitForm(1)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving Details..." : "Save"}
                      </button>
                    </div>
                  </div>
                </>
              ) : status == "Pending" &&
                homeTravelData.staffNameHr != "Pending HR" ? (
                <>
                  <div className="row">
                    <div className="col-md-6">
                      <button
                        type="submit"
                        className="btn btn-success btn-lg col-12 mt-4"
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "16px",
                          backgroundColor: "#57636f",
                        }}
                        onClick={() => handleSaveForm(1)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Submitting Request..." : "Submit"}
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button
                        type="submit"
                        className="btn btn-danger btn-lg col-12 mt-4"
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "16px",
                          backgroundColor: "#57636f",
                        }}
                        onClick={() => handleSubmitForm(1)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving Details..." : "Save"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <div>
                      <p
                        type="submit"
                        style={{ backgroundColor: "green" }}
                        className="btn btn-danger btn-lg col-12 mt-4"
                        disabled={isLoading}
                      >
                        Already Submitted
                      </p>
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

export default HomeRequestDetailsHR;
