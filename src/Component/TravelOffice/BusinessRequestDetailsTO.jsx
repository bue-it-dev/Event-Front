import React, { useState, useEffect, useCallback, useMemo } from "react";
import URL from "../Util/config";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import "../HR/HR.css";
import "./TravelOfficeStyle.css";
import { UpdateTOData } from "../Requests/mutators";
import { getToken } from "../Util/Authenticate";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { MDBDataTable } from "mdbreact";
import Table from "react-bootstrap/Table";
import PrintableBusinessReport from "./PrintableBusinessReport";
import { toast } from "react-toastify";

const BusinessRequestDetailsTO = () => {
  const [isLoading, setisLoading] = useState(true);
  const [traveltype, settraveltype] = useState([]);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const [planeClasses, setplaneClasses] = useState([]);
  const [currency, setcurrency] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const location = useLocation();
  const [approvalTracker, setApprovalTracker] = useState([]);
  const history = useHistory();
  if (location.state) {
    let saverequestId = JSON.stringify(location.state.requestId);
    let saverequeststatus = JSON.stringify(location.state.statusName);
    localStorage.setItem("requestId", saverequestId);
    localStorage.setItem("status", saverequeststatus);
  }
  const [showReport, setShowReport] = useState(false);
  let requestId = JSON.parse(localStorage.getItem("requestId"));
  let status = JSON.parse(localStorage.getItem("status"));
  // Initialize state with proper transportation initialization
  const [updatehometravelData, setupdatehometravelData] = useState({
    requestId: requestId,
    travelType: 0,
    budgetlineType: 0,
    budgetlineName: "",
    email: "",
    serial: "",
    travelPurpose: "",
    travellerList: 0,
    eventStartDate: null,
    eventEndDate: null,
    hasTransportation: 0,
    hasAccomdation: 0,
    hasVisa: 0,
    hasRegistrationFee: 0,
    visaCurrency: null,
    visaAmount: 0,
    registrationFeeCurrency: null,
    registrationFeeAmount: 0,
    budgetCode: null,
    budgetCostCenter: null,
    budgetNotes: null,
    createdAt: null,
    updateAt: null,
    hasAllowance: 0,
    transportation: {
      planeClassId: 0,
      amount: 0,
      currency: null,
      firstDepartureAirportName: "",
      selfTransferNotes: "",
      otherTransferId: 0,
      firstArrivalAirportName: "",
      departureDate: null,
      secondDepartureAirportName: "",
      secondArrivalAirportName: "",
      arrivalDate: null,
      transportationType: "", // Default to an empty string
    },
    accomdation: {
      eventVenue: "",
      preferredHotel: "",
      singleRoomCount: 0,
      doubleRoomCount: 0,
      tripleRoomCount: 0,
      amount: 0,
      currency: null,
    },
    businessTravellrers: [
      {
        requesterName: "",
        requesterPassportNumber: "",
        passportIssueDate: null,
        passportExpiryDate: null,
        requesterBirthDate: null,
        requestId: 0,
      },
    ],
    businessTravellrersAllowance: [
      {
        rowId: 0,
        businessTravellerID: 0,
        businessTravellerName: "",
        travellerLevel: 0,
        diemPerNight: 0,
        numberofNights: 0,
        totalPerDiem: 0,
        currency: "",
      },
    ],
  });
  // Get List of Approval Department Schema
  const GetTravelTypes = () => {
    var data = "";
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/BusinessRequest/get-all-trasferTypes`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        settraveltype(response.data);
      })
      .catch(function (error) {});
  };
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

  const GetBusinessRequest = async (requestId) => {
    try {
      const response = await axios.post(
        `${URL.BASE_URL}/api/BusinessRequest/get-business-request-details-by-id`,
        requestId,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Directly use the date from the response, assuming it's in YYYY-MM-DD format
      const formattedeventStartDate = response.data.eventStartDate
        ? response.data.eventStartDate.split("T")[0]
        : "";
      const formattedeventEndDate = response.data.eventEndDate
        ? response.data.eventEndDate.split("T")[0]
        : "";
      const formattedissueDate = response.data.issueDate
        ? response.data.issueDate.split("T")[0]
        : "";
      const formattedexpiryDate = response.data.expiryDate
        ? response.data.expiryDate.split("T")[0]
        : "";
      const formatteddateOfBirth = response.data.dateOfBirth
        ? response.data.dateOfBirth.split("T")[0]
        : "";
      // Format the dates inside dependentTravellers
      const formattedbusinessTravellrers =
        response.data.businessTravellrers.map((traveller) => ({
          ...traveller,
          passportIssueDate: traveller.passportIssueDate
            ? traveller.passportIssueDate.split("T")[0]
            : null,
          passportExpiryDate: traveller.passportExpiryDate
            ? traveller.passportExpiryDate.split("T")[0]
            : null,
          requesterBirthDate: traveller.requesterBirthDate
            ? traveller.requesterBirthDate.split("T")[0]
            : null,
        }));
      setupdatehometravelData({
        ...response.data,
        eventStartDate: formattedeventStartDate,
        eventEndDate: formattedeventEndDate,
        issueDate: formattedissueDate,
        expiryDate: formattedexpiryDate,
        dateOfBirth: formatteddateOfBirth,
        businessTravellrers: formattedbusinessTravellrers,
      });
    } catch (error) {
      console.error("Error fetching business request details:", error);
    }
  };
  const GetPlaneClasses = () => {
    axios
      .get(`${URL.BASE_URL}/api/PlaneClass/GetAllPlaneClass`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setplaneClasses(response.data))
      .catch((error) => console.error(error));
  };

  const GetCurrency = () => {
    axios
      .get(`${URL.BASE_URL}/api/Currency/GetAllCurrencies`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setcurrency(response.data))
      .catch((error) => console.error(error));
  };
  const UpdateBusinessRequestAsync = async () => {
    try {
      setisLoading(true);

      const payload = {
        hasTransportation: updatehometravelData.hasTransportation,
        transportationAmount: updatehometravelData.transportation?.amount || 0,
        transportationCurrency:
          updatehometravelData.transportation?.currency || "",
        hasAccomdation: updatehometravelData.hasAccomdation,
        accomdationCurrency: updatehometravelData.accomdation?.currency || "",
        accomdationAmount: updatehometravelData.accomdation?.amount || 0,
        hasRegisteration: updatehometravelData.hasRegistrationFee,
        registrationFeeCurrency:
          updatehometravelData.registrationFeeCurrency || "",
        registrationFeeAmount: updatehometravelData.registrationFeeAmount || 0,
        hasVisa: updatehometravelData.hasVisa,
        visaCurrency: updatehometravelData.visaCurrency || "",
        visaAmount: updatehometravelData.visaAmount || 0,
      };
      await UpdateTOData(requestId, payload);
      setisLoading(false);
      toast.success("Operation completed successfully", {
        position: "top-center",
      });
      history.push("/dashboard");
    } catch (err) {
      setisLoading(false);
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
      });
    }
  };
  const GetBusinessApprovalsTracker = async (requestId) => {
    try {
      const response = await axios.post(
        `${URL.BASE_URL}/api/Approvals/GetBusinessRequestApprovalsbyRequestID`,
        requestId,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Ensure the response data is an array or wrap it in one if it's an object
      const responseData = Array.isArray(response.data)
        ? response.data
        : [response.data];

      // Format the createdAt date for each item
      const formattedData = responseData.map((item) => ({
        ...item,
        createdAt: item.createdAt ? item.createdAt.split("T")[0] : "",
      }));

      setApprovalTracker(formattedData);
    } catch (error) {
      console.error("Error fetching home request details:", error);
    }
  };
  const data = {
    columns: [
      // { label: "#", field: "Number", sort: "asc" },
      { label: "Approved By", field: "userName", sort: "asc" },
      { label: "Approval Level", field: "approvalLevelName", sort: "asc" },
      { label: "Status", field: "statusName", sort: "asc" },
      { label: "Approved At", field: "createdAt", sort: "asc" },
    ],
    rows: approvalTracker.map((data, i) => ({
      Number: i + 1,
      approvalLevelName:
        data.approvalLevelName == "Business_operation_manager"
          ? "Business Operation Manager"
          : data.approvalLevelName,
      userName: data.userName,
      statusName: data.statusName,
      createdAt: data.createdAt,
    })),
  };
  const printReport = () => {
    const printableArea = document.querySelector(".printable-area");
    const originalContents = document.body.innerHTML;

    // Set body content to the printable area only
    document.body.innerHTML = printableArea.innerHTML;

    // Print the page
    window.print();

    // Restore original page content
    document.body.innerHTML = originalContents;
  };
  useEffect(() => {
    setisLoading(false);
    GetBusinessRequest(requestId);
    GetPlaneClasses();
    GetTravelTypes();
    GetCurrency();
    GetApprovalDepartmentSchema();
    if (status != "Pending") {
      GetBusinessApprovalsTracker(requestId);
    }
  }, [requestId]);
  const handlePrintClick = () => {
    setShowReport(true);
  };
  return (
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-lg-10 col-xl-8">
        {" "}
        {/* Increased the width */}
        <div className="card" style={{ padding: "30px" }}>
          {" "}
          {/* Increased padding */}
          <div className="card-body">
            <h3 className="card-header text-center mb-4">
              {" "}
              {/* Centered the header and added margin */}
              Business Leave Request Details
            </h3>
            {/* <button onClick={printReport} className="btn btn-success no-print">
              Print Report
            </button> */}
            {/* Button to trigger print */}
            <button onClick={handlePrintClick} className="print-button">
              Print Report
            </button>

            {/* Render PrintableBusinessReport only when needed */}
            {showReport && (
              <PrintableBusinessReport
                data={updatehometravelData}
                requestId={requestId}
                status={status}
                onAfterPrint={() => setShowReport(false)}
              />
            )}
            <div className="printable-area">
              <ValidatorForm
                onSubmit={UpdateBusinessRequestAsync}
                className="px-md-4" /* Added more padding */
              >
                <div className="horizontal-rule mb-4">
                  <h5 className="horizontal-rule-text">Contact Section</h5>
                </div>
                <div>
                  <label htmlFor="passportName" className="form-label fs-6 ">
                    Contact Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={updatehometravelData.email}
                    className="form-control form-control-lg"
                    disabled
                    pattern="[a-zA-Z ]+"
                  />
                </div>
                <div className="horizontal-rule mb-4">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">Travel Details</h5>
                  <br />
                </div>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div className="mb-4" style={{ flex: "1 1 48%" }}>
                    <label htmlFor="planeClassId" className="form-label fs-6">
                      Department:
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-select form-select-lg custom-select"
                      value={updatehometravelData.approvingDepartment}
                      onChange={(e) => {
                        setupdatehometravelData({
                          ...updatehometravelData,
                          approvingDepartment: e.target.value,
                        });
                      }}
                      name="approvingDepartment"
                      required
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
                  <div className="mb-6" style={{ flex: "1 1 48%" }}>
                    <label htmlFor="departureDate" className="form-label fs-6">
                      Travel Type:
                    </label>
                    <select
                      className="form-select form-select-lg custom-select"
                      value={updatehometravelData.travelType}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setupdatehometravelData((prevState) => ({
                          ...prevState,
                          travelType: value,
                        }));
                      }}
                      name="travelType"
                      required
                      disabled
                    >
                      <option value="">Select an option</option>
                      <option value="1">Domestic</option>
                      <option value="2">International</option>
                      <option value="3">Guest</option>
                    </select>
                  </div>
                  <div className="mb-4" style={{ flex: "1 1 48%" }}>
                    <label htmlFor="departureDate" className="form-label fs-6">
                      Budget Line Type:
                    </label>
                    <select
                      className="form-select form-select-lg custom-select"
                      value={updatehometravelData.budgetlineType}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setupdatehometravelData((prevState) => ({
                          ...prevState,
                          budgetlineType: value,
                        }));
                      }}
                      name="budgetlineType"
                      required
                      disabled
                    >
                      <option value="">Select an option</option>
                      <option value="1">Business Budget</option>
                      <option value="0">Research Budget</option>
                    </select>
                  </div>
                  <div className="mb-4" style={{ flex: "1 1 48%" }}>
                    <label htmlFor="budgetlineName" className="form-label fs-6">
                      Budget Line Name:
                    </label>
                    <input
                      type="text"
                      id="budgetlineName"
                      name="budgetlineName"
                      value={updatehometravelData.budgetlineName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z ]*$/.test(value) && value.trim() !== "") {
                          setupdatehometravelData({
                            ...updatehometravelData,
                            budgetlineName: value,
                          });
                        } else if (value === "") {
                          setupdatehometravelData({
                            ...updatehometravelData,
                            budgetlineName: value,
                          });
                        }
                      }}
                      className="form-control form-control-lg"
                      required
                      disabled
                      pattern="[a-zA-Z ]+"
                    />
                  </div>
                </div>
                <div className="mb-4 flex-grow-1">
                  <label htmlFor="travelPurpose" className="form-label fs-6">
                    Purpose of travel/ Mission:
                  </label>
                  <textarea
                    id="travelPurpose"
                    name="travelPurpose"
                    value={updatehometravelData.travelPurpose}
                    onChange={(e) => {
                      const value = e.target.value;
                      setupdatehometravelData({
                        ...updatehometravelData,
                        travelPurpose: value,
                      });
                    }}
                    className="form-control form-control-lg"
                    rows="4" // Set rows to control textarea height
                    required
                    disabled
                    pattern="[a-zA-Z ]+"
                  />
                </div>
                <div className="horizontal-rule mb-4">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">Travellers List</h5>
                </div>
                {updatehometravelData.travellerList > 0 ? (
                  <>
                    {Array.from({
                      length: updatehometravelData.travellerList,
                    }).map((_, index) => (
                      <>
                        <div style={{ gap: "1rem" }} key={index}>
                          <div className="row">
                            {/* Name (Per Passport) */}
                            <div className="col-md-6 mb-4">
                              {" "}
                              {/* Adjust column width to 6 for full width */}
                              <div className="form-outline">
                                <TextValidator
                                  type="text"
                                  id={`requesterName-${index}`}
                                  className="form-control-lg w-100"
                                  value={
                                    updatehometravelData.businessTravellrers[
                                      index
                                    ]?.requesterName || ""
                                  }
                                  disabled
                                  required
                                  validators={[
                                    "required",
                                    "matchRegexp:^[a-zA-Z ]*$",
                                  ]}
                                  errorMessages={[
                                    "this field is required",
                                    "only characters are allowed",
                                  ]}
                                  name={`requesterName-${index}`}
                                  label="Name (Per Passport)"
                                />
                              </div>
                            </div>

                            {/* Passport Number */}
                            <div className="col-md-6 mb-4">
                              {" "}
                              {/* Adjust column width to 6 for full width */}
                              <div className="form-outline">
                                <TextValidator
                                  type="text"
                                  id={`requesterPassportNumber-${index}`}
                                  className="form-control-lg w-100"
                                  value={
                                    updatehometravelData.businessTravellrers[
                                      index
                                    ]?.requesterPassportNumber || ""
                                  }
                                  disabled
                                  required
                                  validators={[
                                    "required",
                                    "matchRegexp:^[a-zA-Z0-9]*$",
                                  ]}
                                  errorMessages={[
                                    "this field is required",
                                    "only characters and numbers are allowed",
                                  ]}
                                  name={`requesterPassportNumber-${index}`}
                                  label="Passport Number"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            {/* Passport Issue Date */}
                            <div className="col-md-4 mb-4">
                              <label
                                htmlFor={`requesterPassportIssueDate-${index}`}
                                className="form-label fs-6"
                              >
                                Passport Issue Date:
                              </label>
                              <input
                                type="date"
                                id={`requesterIssueDate-${index}`}
                                name={`requesterIssueDate-${index}`}
                                value={
                                  updatehometravelData.businessTravellrers[
                                    index
                                  ]?.passportIssueDate || ""
                                }
                                disabled
                                className="form-control form-control-lg"
                                required
                                //max={new Date().toISOString().split("T")[0]}
                              />
                            </div>

                            {/* Passport Expiry Date */}
                            <div className="col-md-4 mb-4">
                              <label
                                htmlFor={`requesterPassportExpiryDate-${index}`}
                                className="form-label fs-6"
                              >
                                Passport Expiry Date:
                              </label>
                              <input
                                type="date"
                                id={`requesterExpiryDate-${index}`}
                                name={`requesterExpiryDate-${index}`}
                                value={
                                  updatehometravelData.businessTravellrers[
                                    index
                                  ]?.passportExpiryDate || ""
                                }
                                disabled
                                className="form-control form-control-lg"
                                required
                                //min={new Date().toISOString().split("T")[0]}
                              />
                            </div>

                            {/* Birth Date */}
                            <div className="col-md-4 mb-4">
                              <label
                                htmlFor={`requesterBirthDate-${index}`}
                                className="form-label fs-6"
                              >
                                Birth Date:
                              </label>
                              <input
                                type="date"
                                id={`requesterDateOfBirth-${index}`}
                                name={`requesterDateOfBirth-${index}`}
                                value={
                                  updatehometravelData.businessTravellrers[
                                    index
                                  ]?.requesterBirthDate || ""
                                }
                                disabled
                                className="form-control form-control-lg"
                                required
                                //max={new Date().toISOString().split("T")[0]}
                              />
                            </div>
                          </div>
                          <div className="modern-separator"></div>
                        </div>
                      </>
                    ))}
                  </>
                ) : null}
                <br />
                <div className="horizontal-rule mb-4">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">Event Dates</h5>
                </div>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div className="mb-4 flex-grow-1">
                    <label htmlFor="departureDate" className="form-label fs-6">
                      From Date:
                    </label>
                    <input
                      type="date"
                      id="eventStartDate"
                      name="eventStartDate"
                      value={updatehometravelData.eventStartDate}
                      disabled
                      className="form-control form-control-lg custom-date-input"
                      required
                      // max={
                      //   new Date(new Date().setDate(new Date().getDate() + 1))
                      //     .toISOString()
                      //     .split("T")[0]
                      // } // Set min date to tomorrow
                    />
                  </div>
                  <div className="mb-4 flex-grow-1">
                    <label htmlFor="departureDate" className="form-label fs-6">
                      To Date:
                    </label>
                    <input
                      type="date"
                      id="eventEndDate"
                      name="eventEndDate"
                      value={updatehometravelData.eventEndDate}
                      disabled
                      className="form-control form-control-lg custom-date-input"
                      required
                      // min={
                      //   new Date(new Date().setDate(new Date().getDate() + 1))
                      //     .toISOString()
                      //     .split("T")[0]
                      // } // Set min date to tomorrow
                    />
                  </div>
                </div>
                <div className="horizontal-rule mb-4">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">
                    Requested Services
                  </h5>
                </div>
                <div
                  style={{
                    display: "flex", // Flexbox for horizontal alignment
                    gap: "10px", // Adjust gap between checkboxes
                    flexWrap: "wrap", // Allows wrapping if necessary on smaller screens
                    alignItems: "center", // Vertically aligns checkboxes with labels
                    justifyContent: "center", // Centers the checkboxes horizontally
                  }}
                >
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="transportationCheckbox"
                      checked={updatehometravelData.hasTransportation === 1}
                      disabled
                    />
                    <label
                      className="form-check-label"
                      htmlFor="transportationCheckbox"
                    >
                      Transfer
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={updatehometravelData.hasAccomdation === 1}
                      disabled
                      id="accomdationCheckbox"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="accomdationCheckbox"
                    >
                      accomdation
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={updatehometravelData.hasAllowance === 1}
                      disabled
                      id="allowanceCheckbox"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="allowanceCheckbox"
                    >
                      Allowance
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={updatehometravelData.hasVisa === 1}
                      disabled
                      id="visaCheckbox"
                    />
                    <label className="form-check-label" htmlFor="visaCheckbox">
                      Visa
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={updatehometravelData.hasRegistrationFee === 1}
                      disabled
                      id="registrationFeeCheckbox"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="registrationFeeCheckbox"
                    >
                      Participation Fee
                    </label>
                  </div>
                </div>
                {updatehometravelData.hasTransportation == 1 ? (
                  <>
                    <div className="horizontal-rule mb-4">
                      <hr />
                      <h5 className="horizontal-rule-text fs-5">Transfer</h5>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="airTicketCheckbox"
                          checked={
                            selectedOption == "airTicket" ||
                            updatehometravelData?.transportation
                              ?.transportationType === "airTicket"
                          }
                          // checked={selectedOption == "airTicket"}
                          // onChange={handleAirTicketChange}
                          disabled
                        />
                        <label
                          className="form-check-label"
                          htmlFor="airTicketCheckbox"
                        >
                          Air Ticket
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="selfTransferCheckbox"
                          checked={
                            updatehometravelData?.transportation
                              ?.transportationType === "selfTransfer"
                          }
                          // checked={selectedOption == "selfTransfer"}
                          // onChange={handleSelfTransferChange}
                          disabled
                        />
                        <label
                          className="form-check-label"
                          htmlFor="selfTransferCheckbox"
                        >
                          Other
                        </label>
                      </div>
                    </div>

                    {/* Conditional rendering based on checkbox state */}
                    {selectedOption === "airTicket" ||
                      (updatehometravelData.transportation
                        .transportationType === "airTicket" && (
                        <div>
                          <>
                            <br />
                            {updatehometravelData.transportation
                              .transportationType === "airTicket" ? (
                              <>
                                <div className="horizontal-rule mb-4">
                                  <hr />
                                  <h5 className="horizontal-rule-text fs-5">
                                    Air Ticket Details
                                  </h5>
                                </div>
                                <div className="form-outline mb-4">
                                  <label
                                    htmlFor="planeClassId"
                                    className="form-label fs-6"
                                  >
                                    Travel Type:
                                  </label>
                                  <select
                                    className="form-select form-select-lg custom-select"
                                    value={
                                      updatehometravelData.transportation
                                        .planeClassId
                                    } // Access the planeClassId inside transportation
                                    disabled
                                    name="planeClassId"
                                    required
                                  >
                                    <option value="">Select Plane Class</option>
                                    {planeClasses.map((data) => (
                                      <option
                                        key={data.planeClassId}
                                        value={data.planeClassId}
                                      >
                                        {data.planeClassName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <br />
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "16px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <div className="mb-4 flex-grow-1">
                                    <label
                                      htmlFor="firstDepartureAirportName"
                                      className="form-label fs-6"
                                    >
                                      From:
                                    </label>
                                    <input
                                      type="text"
                                      id="firstDepartureAirportName"
                                      name="firstDepartureAirportName"
                                      value={
                                        updatehometravelData.transportation
                                          .firstDepartureAirportName
                                      } // Access the value inside transportation
                                      disabled
                                      className="form-control form-control-lg"
                                      required
                                      pattern="[a-zA-Z ]+"
                                    />
                                  </div>
                                  <div className="mb-4 flex-grow-1">
                                    <label
                                      htmlFor="firstArrivalAirportName"
                                      className="form-label fs-6"
                                    >
                                      To:
                                    </label>
                                    <input
                                      type="text"
                                      id="firstArrivalAirportName"
                                      name="firstArrivalAirportName"
                                      value={
                                        updatehometravelData.transportation
                                          .firstArrivalAirportName
                                      } // Access the value inside transportation
                                      disabled
                                      className="form-control form-control-lg"
                                      required
                                      pattern="[a-zA-Z ]+"
                                      title="Only letters and spaces are allowed"
                                    />
                                  </div>
                                  <div className="mb-4 flex-grow-1">
                                    <label
                                      htmlFor="departureDate"
                                      className="form-label fs-6"
                                    >
                                      Departure Date:
                                    </label>
                                    <input
                                      type="date"
                                      id="departureDate"
                                      name="departureDate"
                                      value={
                                        updatehometravelData.transportation.departureDate?.split(
                                          "T"
                                        )[0] || ""
                                      } // Access the value inside transportation
                                      disabled
                                      className="form-control form-control-lg custom-date-input"
                                      required
                                      // min={
                                      //   new Date(
                                      //     new Date().setDate(
                                      //       new Date().getDate() + 1
                                      //     )
                                      //   )
                                      //     .toISOString()
                                      //     .split("T")[0]
                                      // } // Set min date to tomorrow
                                    />
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "16px",
                                    marginTop: "16px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <div className="mb-4 flex-grow-1">
                                    <label
                                      htmlFor="secondDepartureAirportName"
                                      className="form-label fs-6"
                                    >
                                      From (Optional):
                                    </label>
                                    <input
                                      type="text"
                                      id="secondDepartureAirportName"
                                      name="secondDepartureAirportName"
                                      value={
                                        updatehometravelData.transportation
                                          .secondDepartureAirportName || ""
                                      }
                                      disabled
                                      className="form-control form-control-lg"
                                      pattern="[a-zA-Z ]+"
                                    />
                                  </div>

                                  <div className="mb-4 flex-grow-1">
                                    <label
                                      htmlFor="secondArrivalAirportName"
                                      className="form-label fs-6"
                                    >
                                      To (Optional):
                                    </label>
                                    <input
                                      type="text"
                                      id="secondArrivalAirportName"
                                      name="secondArrivalAirportName"
                                      value={
                                        updatehometravelData.transportation
                                          .secondArrivalAirportName || ""
                                      }
                                      disabled
                                      className="form-control form-control-lg"
                                      pattern="[a-zA-Z ]+"
                                      title="Only letters and spaces are allowed"
                                    />
                                  </div>

                                  <div className="mb-4 flex-grow-1">
                                    <label
                                      htmlFor="arrivalDate"
                                      className="form-label fs-6"
                                    >
                                      Return Date (Optional):
                                    </label>
                                    <input
                                      type="date"
                                      id="arrivalDate"
                                      name="arrivalDate"
                                      value={
                                        updatehometravelData.transportation?.arrivalDate?.split(
                                          "T"
                                        )[0] || ""
                                      }
                                      disabled
                                      className="form-control form-control-lg custom-date-input"
                                      // min={
                                      //   updatehometravelData.transportation
                                      //     .departureDate
                                      //     ? updatehometravelData.transportation
                                      //         .departureDate
                                      //     : ""
                                      // }
                                    />
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </>
                        </div>
                      ))}
                    {selectedOption === "selfTransfer" ||
                      (updatehometravelData.transportation
                        .transportationType === "selfTransfer" && (
                        <div>
                          <div className="form-outline mb-4">
                            <label
                              htmlFor="planeClassId"
                              className="form-label fs-6"
                            >
                              Other Transfer Methods:
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              className="form-select form-select-lg custom-select"
                              value={
                                updatehometravelData.transportation
                                  .otherTransferId
                              } // Access the planeClassId inside transportation
                              onChange={(e) => {
                                setupdatehometravelData({
                                  ...updatehometravelData,
                                  transportation: {
                                    ...updatehometravelData.transportation,
                                    otherTransferId: e.target.value,
                                  },
                                });
                              }}
                              name="otherTransferId"
                              disabled
                            >
                              <option value="">Select Transfer Method</option>
                              {traveltype.map((data) => (
                                <option key={data.rowid} value={data.rowid}>
                                  {data.transferTypeName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <br />
                          <div className="mb-4 flex-grow-1">
                            <label htmlFor="notes" className="form-label fs-6">
                              Notes
                            </label>
                            <input
                              type="text"
                              id="notes"
                              name="notes"
                              value={
                                updatehometravelData.transportation
                                  ?.selfTransferNotes || ""
                              } // Assuming you have a notes property in your state
                              disabled
                              className="form-control form-control-lg"
                              required
                              pattern="[a-zA-Z ]*"
                              title="Only letters and spaces are allowed" // Optional: Add a title for clarity
                            />
                          </div>
                        </div>
                      ))}
                  </>
                ) : null}
                <br />
                {updatehometravelData.hasAccomdation == 1 ? (
                  <>
                    <div className="horizontal-rule mb-4">
                      <hr />
                      <h5 className="horizontal-rule-text fs-5">
                        Accommodation
                      </h5>
                    </div>
                    {/* Table for Room Type and Number of Rooms */}
                    <div className="mb-4">
                      <div className="mb-4">
                        <div className="row">
                          <div className="col-md-6 mb-4">
                            {" "}
                            {/* Add margin bottom for spacing */}
                            <label
                              htmlFor="eventVenue"
                              className="form-label fs-6"
                            >
                              Event Venue
                            </label>
                            <input
                              type="text"
                              id="eventVenue"
                              name="eventVenue"
                              value={
                                updatehometravelData.accomdation.eventVenue ||
                                ""
                              } // Adjusted to match state structure
                              disabled
                              className="form-control form-control-lg"
                              required
                              pattern="[a-zA-Z ]*"
                              title="Only letters and spaces are allowed"
                            />
                          </div>

                          <div className="col-md-6 mb-4">
                            {" "}
                            {/* Add margin bottom for spacing */}
                            <label
                              htmlFor="preferredHotel"
                              className="form-label fs-6"
                            >
                              Preferred Hotel (Optional):
                            </label>
                            <input
                              type="text"
                              id="preferredHotel"
                              name="preferredHotel"
                              value={
                                updatehometravelData.accomdation
                                  .preferredHotel || ""
                              } // Adjusted to match state structure
                              disabled
                              className="form-control form-control-lg"
                              pattern="[a-zA-Z ]*"
                              title="Only letters and spaces are allowed"
                            />
                          </div>
                        </div>
                      </div>

                      <table className="table">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              style={{
                                color: "white",
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              Room Type
                            </th>
                            <th
                              scope="col"
                              style={{
                                color: "white",
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              Single
                            </th>
                            <th
                              scope="col"
                              style={{
                                color: "white",
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              Double
                            </th>
                            <th
                              scope="col"
                              style={{
                                color: "white",
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              Triple
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                color: "black",
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              # of Rooms
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={
                                  updatehometravelData.accomdation
                                    .singleRoomCount || ""
                                }
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    accomdation: {
                                      ...updatehometravelData.accomdation,
                                      singleRoomCount: Math.max(0, value),
                                    },
                                  });
                                }}
                                disabled
                                aria-label="Number of Single Rooms"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={
                                  updatehometravelData.accomdation
                                    .doubleRoomCount || ""
                                }
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    accomdation: {
                                      ...updatehometravelData.accomdation,
                                      doubleRoomCount: Math.max(0, value),
                                    },
                                  });
                                }}
                                disabled
                                aria-label="Number of Double Rooms"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={
                                  updatehometravelData.accomdation
                                    .tripleRoomCount || ""
                                }
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    accomdation: {
                                      ...updatehometravelData.accomdation,
                                      tripleRoomCount: Math.max(0, value),
                                    },
                                  });
                                }}
                                disabled
                                aria-label="Number of Triple Rooms"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : null}
                <br />
                {updatehometravelData.hasAllowance == 1 &&
                updatehometravelData.budgetlineType == 1 ? (
                  <>
                    <div className="horizontal-rule mb-4">
                      <hr />
                      <h5 className="horizontal-rule-text fs-5">
                        HR Allowance Section
                      </h5>
                    </div>
                    {updatehometravelData.businessTravellrers.map(
                      (traveller, index) => (
                        <div style={{ gap: "1rem" }} key={index}>
                          <div className="row">
                            {/* Traveler Name */}
                            <div className="col-md-4 mb-4">
                              <div className="form-outline">
                                <label
                                  htmlFor={`requesterName-${index}`}
                                  className="form-label fs-6"
                                >
                                  Traveller Name:
                                </label>
                                <input
                                  type="text"
                                  id={`requesterName-${index}`}
                                  className="form-control-lg w-100"
                                  value={traveller?.requesterName || ""}
                                  disabled
                                  required
                                  name={`requesterName-${index}`}
                                  validators={[
                                    "required",
                                    "matchRegexp:^[a-zA-Z ]*$",
                                  ]}
                                  errorMessages={[
                                    "this field is required",
                                    "only characters are allowed",
                                  ]}
                                />
                              </div>
                            </div>

                            {/* Traveller Level */}
                            <div className="col-md-4 mb-4">
                              <div className="form-outline">
                                <label
                                  htmlFor={`travellerLevel-${index}`}
                                  className="form-label fs-6"
                                >
                                  Traveller Level:
                                </label>
                                <select
                                  className="form-select form-select-lg custom-select"
                                  value={
                                    updatehometravelData
                                      .businessTravellrersAllowance[index]
                                      ?.travellerLevel || ""
                                  }
                                  disabled
                                  name={`travellerLevel-${index}`}
                                >
                                  <option value="">Select an option</option>
                                  <option value="1">Level 1</option>
                                  <option value="2">Level 2</option>
                                  <option value="3">Level 3</option>
                                  <option value="-1">Others</option>
                                </select>
                              </div>
                            </div>

                            {/* Currency */}
                            <div className="col-md-4 mb-4">
                              <div className="form-outline">
                                <label
                                  htmlFor="currency"
                                  className="form-label fs-6"
                                >
                                  Currency:
                                </label>
                                <select
                                  className="form-select form-select-lg custom-select"
                                  value={
                                    updatehometravelData
                                      .businessTravellrersAllowance[index]
                                      ?.currency || ""
                                  }
                                  disabled
                                  name={`currency-${index}`}
                                >
                                  <option value="">Select Currency</option>
                                  {currency.map((data) => (
                                    <option
                                      key={data.currencyId}
                                      value={data.currencyName}
                                    >
                                      {data.currencyName}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4 mb-4">
                              <label className="form-label fs-6">
                                Per Diem/ Night:
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={
                                  updatehometravelData
                                    .businessTravellrersAllowance[index]
                                    ?.diemPerNight || ""
                                }
                                disabled
                                aria-label="Per Diem/ Night:"
                              />
                            </div>

                            <div className="col-md-4 mb-4">
                              <label
                                htmlFor={`numberofNights-${index}`}
                                className="form-label fs-6"
                              >
                                Number of Nights:
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={
                                  updatehometravelData
                                    .businessTravellrersAllowance[index]
                                    ?.numberofNights || ""
                                }
                                disabled
                                aria-label="Number of Nights"
                              />
                            </div>

                            {/* Total Allowance */}
                            <div className="col-md-4 mb-4">
                              <label className="form-label fs-6">
                                Total Allowance:
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={
                                  updatehometravelData
                                    .businessTravellrersAllowance[index]
                                    ?.totalPerDiem || 0
                                }
                                disabled
                                aria-label="Total Allowance"
                              />
                            </div>
                          </div>
                          <div className="modern-separator"></div>
                        </div>
                      )
                    )}
                  </>
                ) : null}

                <br />
                <div className="horizontal-rule mb-4">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">
                    Travel Office Section Entry
                  </h5>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Requested Service</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Currency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatehometravelData.hasTransportation === 1 && (
                      <tr>
                        <td>Transfer</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={
                              updatehometravelData.transportation.amount || ""
                            }
                            required
                            onChange={(e) => {
                              const value = e.target.value;
                              setupdatehometravelData({
                                ...updatehometravelData,
                                transportation: {
                                  ...updatehometravelData.transportation,
                                  amount: Math.max(0, value),
                                },
                              });
                            }}
                          />
                        </td>
                        <td>
                          <select
                            className="form-select"
                            value={
                              updatehometravelData.transportation?.currency ||
                              ""
                            }
                            required
                            onChange={(e) => {
                              const value = e.target.value;
                              setupdatehometravelData({
                                ...updatehometravelData,
                                transportation: {
                                  ...updatehometravelData.transportation,
                                  currency: value,
                                },
                              });
                            }}
                          >
                            <option value="">Select Currency</option>
                            {currency.map((data) => (
                              <option
                                key={data.currencyId}
                                value={data.currencyName}
                              >
                                {data.currencyName}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )}
                    {updatehometravelData.hasAccomdation === 1 && (
                      <tr>
                        <td>Accommodation</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={
                              updatehometravelData.accomdation?.amount || ""
                            }
                            required
                            onChange={(e) => {
                              const value = e.target.value;
                              setupdatehometravelData({
                                ...updatehometravelData,
                                accomdation: {
                                  ...updatehometravelData.accomdation,
                                  amount: Math.max(0, value),
                                },
                              });
                            }}
                          />
                        </td>
                        <td>
                          <select
                            className="form-select"
                            value={
                              updatehometravelData.accomdation?.currency || ""
                            }
                            required
                            onChange={(e) => {
                              const value = e.target.value;
                              setupdatehometravelData({
                                ...updatehometravelData,
                                accomdation: {
                                  ...updatehometravelData.accomdation,
                                  currency: value,
                                },
                              });
                            }}
                          >
                            <option value="">Select Currency</option>
                            {currency.map((data) => (
                              <option
                                key={data.currencyId}
                                value={data.currencyName}
                              >
                                {data.currencyName}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )}
                    {updatehometravelData.hasVisa === 1 && (
                      <tr>
                        <td>Visa</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={updatehometravelData.visaAmount || ""}
                            required
                            onChange={(e) =>
                              setupdatehometravelData((prevState) => ({
                                ...prevState,
                                visaAmount: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td>
                          <select
                            className="form-select"
                            value={updatehometravelData.visaCurrency || ""}
                            required
                            onChange={(e) =>
                              setupdatehometravelData((prevState) => ({
                                ...prevState,
                                visaCurrency: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select Currency</option>
                            {currency.map((data) => (
                              <option
                                key={data.currencyId}
                                value={data.currencyName}
                              >
                                {data.currencyName}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )}
                    {updatehometravelData.hasRegistrationFee === 1 && (
                      <tr>
                        <td>Participation Fee</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={
                              updatehometravelData.registrationFeeAmount || ""
                            }
                            required
                            onChange={(e) =>
                              setupdatehometravelData((prevState) => ({
                                ...prevState,
                                registrationFeeAmount: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td>
                          <select
                            className="form-select"
                            value={
                              updatehometravelData.registrationFeeCurrency || ""
                            }
                            required
                            onChange={(e) =>
                              setupdatehometravelData((prevState) => ({
                                ...prevState,
                                registrationFeeCurrency: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select Currency</option>
                            {currency.map((data) => (
                              <option
                                key={data.currencyId}
                                value={data.currencyName}
                              >
                                {data.currencyName}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )}
                    {/* Add the Traveller List Row */}
                    <tr>
                      <td colSpan="3">
                        <strong>Allowance Traveller List</strong>
                      </td>
                    </tr>
                    {updatehometravelData.hasAllowance === 1 &&
                      updatehometravelData.budgetlineType == 1 &&
                      updatehometravelData.businessTravellrersAllowance.map(
                        (allowance, index) => (
                          <tr key={index}>
                            <td> {allowance.businessTravellerName}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={allowance.totalPerDiem || ""}
                                disabled
                              />
                            </td>
                            <td>
                              <select
                                className="form-select"
                                value={allowance.currency || ""}
                                disabled
                              >
                                <option value="">Select Currency</option>
                                {currency.map((data) => (
                                  <option
                                    key={data.currencyId}
                                    value={data.currencyName}
                                  >
                                    {data.currencyName}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
                <br />
                {updatehometravelData.budgetCode != null ? (
                  <>
                    <div className="horizontal-rule mb-4">
                      <hr />
                      <h5 className="horizontal-rule-text fs-5">
                        Budget Office Section
                      </h5>
                    </div>
                    <div className="mb-4">
                      <div className="mb-4">
                        <div className="row">
                          <div className="col-md-6 mb-4">
                            {/* Add margin bottom for spacing */}
                            <label
                              htmlFor="budgetCode"
                              className="form-label fs-6"
                            >
                              Budget Code
                            </label>
                            <input
                              type="text"
                              id="budgetCode"
                              name="budgetCode"
                              value={updatehometravelData.budgetCode || ""} // Adjusted to match state structure
                              className="form-control form-control-lg"
                              disabled
                            />
                          </div>

                          <div className="col-md-6 mb-4">
                            {" "}
                            {/* Add margin bottom for spacing */}
                            <label
                              htmlFor="preferredHotel"
                              className="form-label fs-6"
                            >
                              Budget Cost Center
                            </label>
                            <input
                              type="text"
                              id="preferredHotel"
                              name="preferredHotel"
                              value={
                                updatehometravelData.budgetCostCenter || ""
                              } // Adjusted to match state structure
                              className="form-control form-control-lg"
                              disabled
                            />
                          </div>
                          <div>
                            {/* Add margin bottom for spacing */}
                            <label
                              htmlFor="preferredHotel"
                              className="form-label fs-6"
                            >
                              Notes (Optional)
                            </label>
                            <input
                              type="text"
                              id="preferredHotel"
                              name="preferredHotel"
                              value={updatehometravelData.budgetNotes || ""} // Adjusted to match state structure
                              className="form-control form-control-lg"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
                <br />
                {status == "Pending" ? (
                  <>
                    <button
                      type="submit"
                      className="btn btn-success btn-lg col-12 mt-4" /* Enlarged button */
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitted Request..." : "Submit"}
                    </button>
                  </>
                ) : (
                  <>
                    <br />
                    <div className="horizontal-rule mb-4">
                      <h5 className="horizontal-rule-text">
                        Approvals Breakdown
                      </h5>
                    </div>
                    <div className="row">
                      <Table responsive>
                        <MDBDataTable
                          className="custom-table"
                          striped
                          bordered
                          hover
                          data={data}
                          paging={false} // Disables pagination
                          scrollX={false} // Disables horizontal scrolling
                          scrollY={false} // Disables vertical scrolling
                          order={["Number", "asc"]}
                          entries={10}
                          searching={false} // Disables the search bar
                        />
                      </Table>
                    </div>
                  </>
                )}
              </ValidatorForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRequestDetailsTO;
