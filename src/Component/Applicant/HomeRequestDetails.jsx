import React, { useState, useEffect } from "react";
import URL from "../Util/config";
import "./Applicant.css";
import { MDBDataTable } from "mdbreact";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { UpdateHomeRequest } from "../Requests/mutators";
import { getToken } from "../Util/Authenticate";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const HomeRequestDetails = () => {
  const [isLoading, setisLoading] = useState(true);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);

  const [planeClasses, setplaneClasses] = useState([]);
  const location = useLocation();
  const history = useHistory();
  if (location.state) {
    let saverequestId = JSON.stringify(location.state.requestId);
    let saverequeststatus = JSON.stringify(location.state.statusname);
    localStorage.setItem("requestId", saverequestId);
    localStorage.setItem("status", saverequeststatus);
  }
  let requestId = JSON.parse(localStorage.getItem("requestId"));
  let status = JSON.parse(localStorage.getItem("status"));
  const [updatehometravelData, setupdatehometravelData] = useState({
    requestId: requestId,
    planeClass: "",
    planeClassID: 0,
    numberOfDependents: 0,
    approvingDepName: "",
    firstDepartureAirportName: "",
    firstArrivalAirportName: "",
    secondDepartureAirportName: "",
    secondArrivalAirportName: "",
    departureDate: null,
    arrivalDate: null,
    updatedAt: null,
    issueDate: null,
    expiryDate: null,
    dateOfBirth: null,
    passportName: "",
    passportNumber: "",
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
  const [approvalTracker, setApprovalTracker] = useState([]);
  // Get List of Approval Department Schema
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
  const GetPlaneClasses = () => {
    axios
      .get(`${URL.BASE_URL}/api/PlaneClass/GetAllPlaneClass`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setplaneClasses(response.data))
      .catch((error) => console.error(error));
  };
  const GetHomeRequestDetails = async (requestId) => {
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
      setupdatehometravelData({
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
  };
  const GetApprovalsTracker = async (requestId) => {
    try {
      const response = await axios.post(
        `${URL.BASE_URL}/api/Approvals/GetHomeRequestApprovalsbyRequestID`,
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

  const UpdateHomeRequestAsync = async () => {
    try {
      setisLoading(true);
      await UpdateHomeRequest({ ...updatehometravelData, updatedAt: null });
      setisLoading(false);
      toast.success("Request Updated successfully", {
        position: "top-center",
      });
      history.push("/dashboard"); // Redirect to /my-home-requests
    } catch (err) {
      setisLoading(false);
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
      });
    }
  };
  const addTraveller = () => {
    setupdatehometravelData((prevData) => ({
      ...prevData,
      numberOfDependents: prevData.numberOfDependents + 1,
      dependentTravellers: [
        ...prevData.dependentTravellers,
        {
          dependentTravellersId: prevData.dependentTravellers.length + 1,
          name: "",
          relation: "",
        },
      ],
    }));
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
      // requesterName: data.requesterName,
      approvalLevelName:
        data.approvalLevelName == "Business_operation_manager"
          ? "Business Operation Manager"
          : data.approvalLevelName,
      userName: data.userName,
      statusName: data.statusName,
      createdAt: data.createdAt,
    })),
  };

  useEffect(() => {
    setisLoading(false);
    GetHomeRequestDetails(requestId);
    GetPlaneClasses();
    GetApprovalDepartmentSchema();
    if (status != "Pending") {
      GetApprovalsTracker(requestId);
    }
  }, [requestId]);
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
              Home Leave Request Details
            </h3>
            <ValidatorForm
              onSubmit={UpdateHomeRequestAsync}
              className="px-md-4" /* Added more padding */
            >
              <div className="mb-4 flex-grow-1">
                <label htmlFor="planeClassId" className="form-label fs-6">
                  Department:
                  <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="form-select form-select-lg custom-select"
                  value={updatehometravelData.approvingDepName} // Access the planeClassId inside transportation
                  onChange={(e) => {
                    setupdatehometravelData({
                      ...updatehometravelData,
                      approvingDepName: e.target.value,
                    });
                  }}
                  name="approvingDepName"
                  disabled
                >
                  <option value="">
                    Select your First Level Up Department
                  </option>
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
                      value={updatehometravelData.passportName}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters and spaces, but not only spaces
                        if (/^[a-zA-Z ]*$/.test(value) && value.trim() !== "") {
                          setupdatehometravelData({
                            ...updatehometravelData,
                            passportName: value,
                          });
                        } else if (value === "") {
                          // Allow clearing the input
                          setupdatehometravelData({
                            ...updatehometravelData,
                            passportName: value,
                          });
                        }
                      }}
                      className="form-control form-control-lg"
                      required
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
                      value={updatehometravelData.passportNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters and numbers
                        if (/^[a-zA-Z0-9]*$/.test(value)) {
                          setupdatehometravelData({
                            ...updatehometravelData,
                            passportNumber: value,
                          });
                        } else if (value === "") {
                          // Allow clearing the input
                          setupdatehometravelData({
                            ...updatehometravelData,
                            passportNumber: value,
                          });
                        }
                      }}
                      className="form-control form-control-lg"
                      required
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
                      value={updatehometravelData.issueDate}
                      onChange={(e) => {
                        setupdatehometravelData({
                          ...updatehometravelData,
                          issueDate: e.target.value,
                        });
                      }}
                      className="form-control form-control-lg custom-date-input"
                      required
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
                      value={updatehometravelData.expiryDate}
                      onChange={(e) => {
                        setupdatehometravelData({
                          ...updatehometravelData,
                          expiryDate: e.target.value,
                        });
                      }}
                      className="form-control form-control-lg custom-date-input"
                      required
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
                      value={updatehometravelData.dateOfBirth}
                      onChange={(e) => {
                        setupdatehometravelData({
                          ...updatehometravelData,
                          dateOfBirth: e.target.value,
                        });
                      }}
                      className="form-control form-control-lg custom-date-input"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="horizontal-rule mb-4">
                {" "}
                {/* Increased bottom margin */}
                <h5 className="horizontal-rule-text">
                  Number of Travelers (If Any)
                </h5>
              </div>
              <div>
                <div className="d-flex align-items-center mb-4">
                  <button
                    type="button"
                    className="btn btn-success btn-lg"
                    style={{
                      backgroundColor: "#57636f",
                      borderColor: "black",
                      border: "2px black",
                      color: "white",
                      // width: "30px",
                      // height: "3opx",
                      // // fontSize: "20px",
                      // textAlign: "center",
                      // alignItems: "center",
                      marginRight: "10px", // Adjust the margin to your liking
                    }}
                    onClick={addTraveller}
                  >
                    +
                  </button>
                  <p
                    style={{
                      color: "black",
                      fontSize: "1.2rem",
                      margin: 0,
                      // fontWeight: "bold",
                    }}
                  >
                    Add Traveler(s)
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1.5rem", // Increased gap
                }}
              >
                {Array.from({
                  length: updatehometravelData.numberOfDependents,
                }).map((_, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "1.5rem", // Increased gap
                      flexWrap: "wrap", // Allows wrapping for responsiveness
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Group the inputs in a div to align them in rows of three */}
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
                        <TextValidator
                          type="text"
                          id={`dependentName-${index}`}
                          className="form-control form-control-lg"
                          value={
                            updatehometravelData.dependentTravellers[index]
                              ?.name || ""
                          }
                          onChange={(e) => {
                            const newTravellers = [
                              ...updatehometravelData.dependentTravellers,
                            ];
                            newTravellers[index] = {
                              ...newTravellers[index],
                              name: e.target.value,
                            };
                            setupdatehometravelData({
                              ...updatehometravelData,
                              dependentTravellers: newTravellers,
                            });
                          }}
                          required
                          validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                          errorMessages={[
                            "This field is required",
                            "Only letters are allowed",
                          ]}
                          name={`dependentName-${index}`}
                          label="Name"
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <TextValidator
                          type="text"
                          id={`passportNumber-${index}`}
                          className="form-control form-control-lg"
                          value={
                            updatehometravelData.dependentTravellers[index]
                              ?.passportNumber || ""
                          }
                          onChange={(e) => {
                            const newTravellers = [
                              ...updatehometravelData.dependentTravellers,
                            ];
                            newTravellers[index] = {
                              ...newTravellers[index],
                              passportNumber: e.target.value,
                            };
                            setupdatehometravelData({
                              ...updatehometravelData,
                              dependentTravellers: newTravellers,
                            });
                          }}
                          required
                          validators={[
                            "required",
                            "matchRegexp:^[a-zA-Z0-9]*$",
                          ]}
                          errorMessages={[
                            "This field is required",
                            "Only letters are allowed",
                          ]}
                          name={`passportNumber-${index}`}
                          label="Passport Number"
                        />
                      </div>
                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <TextValidator
                          type="text"
                          id={`relation-${index}`}
                          className="form-control form-control-lg"
                          value={
                            updatehometravelData.dependentTravellers[index]
                              ?.relation || ""
                          }
                          onChange={(e) => {
                            const newTravellers = [
                              ...updatehometravelData.dependentTravellers,
                            ];
                            newTravellers[index] = {
                              ...newTravellers[index],
                              relation: e.target.value,
                            };
                            setupdatehometravelData({
                              ...updatehometravelData,
                              dependentTravellers: newTravellers,
                            });
                          }}
                          required
                          validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                          errorMessages={[
                            "This field is required",
                            "Only letters are allowed",
                          ]}
                          name={`relation-${index}`}
                          label="Relation"
                        />
                      </div>
                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label
                          htmlFor={`issueDate-${index}`}
                          className="form-label fs-6"
                        >
                          Passport Issue Date:
                        </label>
                        <input
                          type="date"
                          id={`issueDate-${index}`}
                          className="form-control form-control-lg"
                          value={
                            updatehometravelData.dependentTravellers[index]
                              ?.issueDate || ""
                          }
                          onChange={(e) => {
                            const newTravellers = [
                              ...updatehometravelData.dependentTravellers,
                            ];
                            newTravellers[index] = {
                              ...newTravellers[index],
                              issueDate: e.target.value,
                            };
                            setupdatehometravelData({
                              ...updatehometravelData,
                              dependentTravellers: newTravellers,
                            });
                          }}
                          required
                          //max={new Date().toISOString().split("T")[0]}
                          name={`issueDate-${index}`}
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label
                          htmlFor={`expiryDate-${index}`}
                          className="form-label fs-6"
                        >
                          Passport Expiry Date:
                        </label>
                        <input
                          type="date"
                          id={`expiryDate-${index}`}
                          className="form-control form-control-lg"
                          value={
                            updatehometravelData.dependentTravellers[index]
                              ?.expiryDate || ""
                          }
                          onChange={(e) => {
                            const newTravellers = [
                              ...updatehometravelData.dependentTravellers,
                            ];
                            newTravellers[index] = {
                              ...newTravellers[index],
                              expiryDate: e.target.value,
                            };
                            setupdatehometravelData({
                              ...updatehometravelData,
                              dependentTravellers: newTravellers,
                            });
                          }}
                          required
                          //min={new Date().toISOString().split("T")[0]}
                          name={`expiryDate-${index}`}
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label
                          htmlFor={`dateOfBirth-${index}`}
                          className="form-label fs-6"
                        >
                          Date of Birth:
                        </label>
                        <input
                          type="date"
                          id={`dateOfBirth-${index}`}
                          className="form-control form-control-lg"
                          value={
                            updatehometravelData.dependentTravellers[index]
                              ?.dateOfBirth || ""
                          }
                          onChange={(e) => {
                            const newTravellers = [
                              ...updatehometravelData.dependentTravellers,
                            ];
                            newTravellers[index] = {
                              ...newTravellers[index],
                              dateOfBirth: e.target.value,
                            };
                            setupdatehometravelData({
                              ...updatehometravelData,
                              dependentTravellers: newTravellers,
                            });
                          }}
                          required
                          //max={new Date().toISOString().split("T")[0]} // Set max to today's date
                          name={`dateOfBirth-${index}`}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-lg"
                      style={{
                        color: "darkred",
                        borderRadius: "50%", // Perfectly circular
                        padding: "10px",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        const newTravellers =
                          updatehometravelData.dependentTravellers.filter(
                            (_, i) => i !== index
                          );
                        setupdatehometravelData({
                          ...updatehometravelData,
                          dependentTravellers: newTravellers,
                          numberOfDependents: newTravellers.length,
                        });
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="horizontal-rule mb-4">
                {" "}
                {/* Increased bottom margin */}
                <h5 className="horizontal-rule-text">Flight Class</h5>
              </div>
              <div className="form-outline mb-4">
                {" "}
                {/* Increased bottom margin */}
                <select
                  className="form-select form-select-lg" /* Enlarged select field */
                  value={updatehometravelData.planeClassID}
                  onChange={(e) =>
                    setupdatehometravelData({
                      ...updatehometravelData,
                      planeClassID: e.target.value,
                    })
                  }
                  name="planeClassID"
                  required
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
                {" "}
                {/* Increased bottom margin */}
                <h5 className="horizontal-rule-text">Itinerary (Airport)</h5>
              </div>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {" "}
                {/* Increased gap */}
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="firstDepartureAirportName"
                    className="form-label form-label-lg" /* Enlarged label */
                  >
                    From:
                  </label>
                  <input
                    type="text"
                    id="firstDepartureAirportName"
                    name="firstDepartureAirportName"
                    value={updatehometravelData.firstDepartureAirportName}
                    onChange={(e) =>
                      setupdatehometravelData({
                        ...updatehometravelData,
                        firstDepartureAirportName: e.target.value,
                      })
                    }
                    className="form-control form-control-lg" /* Enlarged input fields */
                    required
                    placeholder="Enter airport name"
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="firstArrivalAirportName"
                    className="form-label form-label-lg" /* Enlarged label */
                  >
                    To:
                  </label>
                  <input
                    type="text"
                    id="firstArrivalAirportName"
                    name="firstArrivalAirportName"
                    value={updatehometravelData.firstArrivalAirportName}
                    onChange={(e) =>
                      setupdatehometravelData({
                        ...updatehometravelData,
                        firstArrivalAirportName: e.target.value,
                      })
                    }
                    className="form-control form-control-lg" /* Enlarged input fields */
                    required
                    placeholder="Enter airport name"
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="departureDate"
                    className="form-label form-label-lg" /* Enlarged label */
                  >
                    Departure Date:
                  </label>
                  <input
                    type="date"
                    id="departureDate"
                    name="departureDate"
                    value={updatehometravelData.departureDate}
                    onChange={(e) =>
                      setupdatehometravelData({
                        ...updatehometravelData,
                        departureDate: e.target.value,
                      })
                    }
                    className="form-control form-control-lg"
                    required
                    // min={
                    //   new Date(new Date().setDate(new Date().getDate() + 1))
                    //     .toISOString()
                    //     .split("T")[0]
                    // }
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  marginTop: "24px" /* Increased margin */,
                  flexWrap: "wrap",
                }}
              >
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="secondDepartureAirportName"
                    className="form-label form-label-lg" /* Enlarged label */
                  >
                    From (Optional):
                  </label>
                  <input
                    type="text"
                    id="secondDepartureAirportName"
                    name="secondDepartureAirportName"
                    value={
                      updatehometravelData.secondDepartureAirportName == ""
                        ? "N/A"
                        : updatehometravelData.secondDepartureAirportName
                    }
                    onChange={(e) =>
                      setupdatehometravelData({
                        ...updatehometravelData,
                        secondDepartureAirportName: e.target.value,
                      })
                    }
                    className="form-control form-control-lg" /* Enlarged input fields */
                    placeholder="Enter airport name"
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="secondArrivalAirportName"
                    className="form-label form-label-lg" /* Enlarged label */
                  >
                    To (Optional):
                  </label>
                  <input
                    type="text"
                    id="secondArrivalAirportName"
                    name="secondArrivalAirportName"
                    value={
                      updatehometravelData.secondArrivalAirportName == ""
                        ? "N/A"
                        : updatehometravelData.secondArrivalAirportName
                    }
                    onChange={(e) =>
                      setupdatehometravelData({
                        ...updatehometravelData,
                        secondArrivalAirportName: e.target.value,
                      })
                    }
                    className="form-control form-control-lg" /* Enlarged input fields */
                    placeholder="Enter airport name"
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="arrivalDate"
                    className="form-label form-label-lg" /* Enlarged label */
                  >
                    Return Date
                  </label>
                  <input
                    type="date"
                    id="arrivalDate"
                    name="arrivalDate"
                    value={updatehometravelData.arrivalDate}
                    onChange={(e) =>
                      setupdatehometravelData({
                        ...updatehometravelData,
                        arrivalDate: e.target.value,
                      })
                    }
                    className="form-control form-control-lg" /* Enlarged input fields */
                    min={updatehometravelData.departureDate || ""}
                  />
                </div>
              </div>
              {status == "Pending" ? (
                <>
                  <button
                    type="submit"
                    className="btn btn-success btn-lg col-12 mt-4" /* Enlarged button */
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                      backgroundColor: "#57636f",
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating Request..." : "Update"}
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
  );
};

export default HomeRequestDetails;
