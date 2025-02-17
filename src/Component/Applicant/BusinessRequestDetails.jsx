import React, { useState, useEffect } from "react";
import URL from "../Util/config";
import "./Applicant.css";
import { MDBDataTable } from "mdbreact";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  UpdateBusinessRequest,
  ConfrimBusinessRequest,
} from "../Requests/mutators";
import { getToken } from "../Util/Authenticate";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import jwt from "jwt-decode";
import Select from "react-select";

const defaultTransportaion = {
  planeClassId: 0,
  firstDepartureAirportName: "",
  selfTransferNotes: "",
  firstArrivalAirportName: "",
  departureDate: null,
  secondDepartureAirportName: "",
  secondArrivalAirportName: "",
  arrivalDate: null,
  transportationType: "", // Default to an empty string
};
const defaultAccomdation = {
  eventVenue: "",
  preferredHotel: "",
  singleRoomCount: 0,
  doubleRoomCount: 0,
  tripleRoomCount: 0,
};
const BusinessRequestDetails = () => {
  const userToken = localStorage.getItem("accessToken");
  const [businessClassTravelers, setbusinessClassTravelers] = React.useState(
    []
  );
  const decodedToken = jwt(userToken);
  const empID = decodedToken.nameid;
  const [isLoading, setisLoading] = useState(true);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const [planeClasses, setplaneClasses] = useState([]);
  const [traveltype, settraveltype] = useState([]);
  const [employeelist, setEmployeeList] = React.useState([]);

  // const [selectedOption, setSelectedOption] = useState(null);
  const location = useLocation();
  const history = useHistory();
  if (location.state) {
    let saverequestId = JSON.stringify(location.state.requestId);
    let saverequeststatus = JSON.stringify(location.state.statusName);
    localStorage.setItem("requestId", saverequestId);
    localStorage.setItem("status", saverequeststatus);
  }
  let requestId = JSON.parse(localStorage.getItem("requestId"));
  let status = JSON.parse(localStorage.getItem("status"));
  // Initialize state with proper transportation initialization
  const [updatehometravelData, setupdatehometravelData] = useState({
    requestId: requestId,
    travelType: 0,
    approvingDepartment: "",
    budgetlineType: 0,
    budgetlineName: "",
    travelPurpose: "",
    travellerList: 0,
    eventStartDate: null,
    eventEndDate: null,
    hasTransportation: 0,
    hasAccomdation: 0,
    hasVisa: 0,
    hasRegistrationFee: 0,
    visaCurrency: null,
    visaAmount: null,
    registrationFeeCurrency: null,
    registrationFeeAmount: null,
    budgetCode: null,
    budgetCostCenter: null,
    budgetNotes: null,
    createdAt: null,
    confrimedat: null,
    updateAt: null,
    hasAllowance: 0,
    transportation: defaultTransportaion,
    accomdation: defaultAccomdation,
    businessTravellrers: [
      {
        empId: 0,
        requesterName: "",
        requesterPassportNumber: "",
        passportIssueDate: null,
        passportExpiryDate: null,
        requesterBirthDate: null,
        requestId: 0,
      },
    ],
  });
  const [valid, setisValid] = React.useState(false);

  const empIdList = updatehometravelData.businessTravellrers.map(
    (traveller) => traveller.empId
  );

  const validateEmpIDs = () => {
    if (empIdList.length === 0) {
      setisValid(false);
      return;
    }

    const promises = empIdList.map((empId) => {
      const config = {
        method: "get",
        url: `${URL.BASE_URL}/api/BusinessRequest/validate-businessClass?empId=${empId}`,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      return axios(config)
        .then((response) => response.data)
        .catch((error) => false); // Assume invalid if there's an error
    });

    Promise.all(promises).then((results) => {
      // If at least one empId is valid, set the flag to true
      if (results.some((isValid) => isValid)) {
        setisValid(true);
      } else {
        setisValid(false);
      }
    });
  };

  // Call validateEmpIDs whenever the form changes
  useEffect(() => {
    validateEmpIDs();
  }, [updatehometravelData]);

  const GetEmployeeList = () => {
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/BusinessRequest/get-all-employees-names`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    axios(config)
      .then(function (response) {
        setEmployeeList(
          response.data.map((employee) => ({
            value: employee.empId,
            label: employee.fullname,
          }))
        );
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const GetAllBusinessTravelers = () => {
    var data = "";
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/BusinessRequest/get-all-business-travelers`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        setbusinessClassTravelers(response.data);
      })
      .catch(function (error) {});
  };
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
  // Handler for selecting Air Ticket
  const handleAirTicketChange = () => {
    const newState = { ...updatehometravelData };
    newState.transportation.transportationType =
      newState.transportation.transportationType === "airTicket"
        ? ""
        : "airTicket";
    setupdatehometravelData(newState);
    // setSelectedOption(selectedOption === "airTicket" ? null : "airTicket");
  };

  // Handler for selecting Self Transfer
  const handleSelfTransferChange = () => {
    const newState = { ...updatehometravelData };
    newState.transportation.transportationType =
      newState.transportation.transportationType === "selfTransfer"
        ? ""
        : "selfTransfer";
    setupdatehometravelData(newState);
  };

  const [approvalTracker, setApprovalTracker] = useState([]);

  const GetPlaneClasses = () => {
    axios
      .get(`${URL.BASE_URL}/api/PlaneClass/GetAllPlaneClass`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setplaneClasses(response.data))
      .catch((error) => console.error(error));
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

      const { data } = response;
      setupdatehometravelData({
        ...data,
        transportation: data.transportation || defaultTransportaion,
        accomdation: data.accomdation || defaultAccomdation,
        eventStartDate: formattedeventStartDate,
        eventEndDate: formattedeventEndDate,
        issueDate: formattedissueDate,
        expiryDate: formattedexpiryDate,
        dateOfBirth: formatteddateOfBirth,
        businessTravellrers: formattedbusinessTravellrers,
      });
    } catch (error) {
      console.error("Error fetching home request details:", error);
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

  const UpdateBusinessRequestAsync = async () => {
    try {
      setisLoading(true);
      const empIdList = updatehometravelData.businessTravellrers.map(
        (traveller) => traveller.empId
      );
      // Check for null, undefined, or zero values in the list
      if (
        empIdList.some(
          (id) =>
            (id === null || id === undefined || id === 0 || id === "") &&
            updatehometravelData.travelType != 3
        )
      ) {
        toast.error(
          "Travelers have invalid or missing names. Please check and update them before submitting.",
          {
            position: "top-center",
          }
        );
        setisLoading(false);
      } else {
        await UpdateBusinessRequest({
          ...updatehometravelData,
          updatedAt: null,
        });
        setisLoading(false);
        toast.success("Request Updated successfully", {
          position: "top-center",
        });
      }
      // history.push("/dashboard"); // Redirect to /my-home-requests
    } catch (err) {
      setisLoading(false);
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
      });
    }
  };

  const ConfrimBusinessRequestAsync = async (requestId) => {
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
                    backgroundColor: "green",
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
                    backgroundColor: "#dc3545",
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

        const payload = {
          requestID: requestId || 0,
          depName: updatehometravelData.approvingDepartment || "",
          budgetLine: updatehometravelData.budgetlineType || 0,
          hasAllowance: updatehometravelData.hasAllowance || 0,
        };
        const empIdList = updatehometravelData.businessTravellrers.map(
          (traveller) => traveller.empId
        );
        // Check for null, undefined, or zero values in the list
        if (
          empIdList.some(
            (id) =>
              (id === null || id === undefined || id === 0 || id === "") &&
              updatehometravelData.travelType != 3
          )
        ) {
          toast.error(
            "Travelers have invalid or missing names. Please check and update them before submitting.",
            {
              position: "top-center",
            }
          );
          setisLoading(false);
        } else {
          await ConfrimBusinessRequest(payload);
          setisLoading(false);
          toast.success("Operation completed successfully", {
            position: "top-center",
          });
          history.push("/dashboard");
        }
      } catch (err) {
        setisLoading(false);
        toast.error("An error occurred. Please try again later.", {
          position: "top-center",
        });
      }
    }
  };

  const addTraveller = () => {
    setupdatehometravelData((prevData) => ({
      ...prevData,
      travellerList: prevData.travellerList + 1,
      businessTravellrers: [
        ...prevData.businessTravellrers,
        {
          empId: prevData.empId,
          requesterName: prevData.requesterName,
          requesterPassportNumber: prevData.requesterPassportNumber,
          passportIssueDate: prevData.passportIssueDate,
          passportExpiryDate: prevData.passportExpiryDate,
          requesterBirthDate: prevData.requesterBirthDate,
          requestId: 0,
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
      approvalLevelName:
        data.approvalLevelName == "Business_operation_manager"
          ? "Business Operation Manager"
          : data.approvalLevelName,
      userName: data.userName,
      statusName: data.statusName,
      createdAt: data.createdAt,
    })),
  };
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
  // Function to check if empID exists in the businessClassTravelers list
  const isBusinessClassTraveler = businessClassTravelers.some(
    (traveler) => traveler.businessClassTravelerEmpId == empID
  );

  // Generate options dynamically based on conditions
  const filteredPlaneClasses =
    updatehometravelData.travelType === 3
      ? planeClasses // Allow all plane class choices if travelType is 3
      : isBusinessClassTraveler
      ? planeClasses.filter((data) => data.planeClassId === 2) // Only Business Class
      : planeClasses.filter((data) => data.planeClassId === 4); // Only Economy Class
  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true); // Start loading at the beginning

      try {
        if (updatehometravelData.confrimedat != null) {
          await GetBusinessApprovalsTracker(requestId);
        }

        await Promise.all([
          GetApprovalDepartmentSchema(),
          GetEmployeeList(),
          GetBusinessRequest(requestId),
          GetPlaneClasses(),
          GetAllBusinessTravelers(),
          GetTravelTypes(),
        ]);
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setisLoading(false); // Stop loading after all calls complete
      }
    };

    fetchData();
  }, [requestId, updatehometravelData.confrimedat]);

  // console.log(updatehometravelData);
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
            <ValidatorForm
              onSubmit={UpdateBusinessRequestAsync}
              className="px-md-8" /* Added more padding */
            >
              <div className="horizontal-rule mb-4">
                <hr />
                <h5 className="horizontal-rule-text fs-5">Travel Details</h5>
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
                  >
                    <option value="">Select your First Level Up Department</option>
                    {approvalDepartments.map((data) => (
                      <option key={data.depName} value={data.depName}>
                        {data.depName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2" style={{ flex: "1 1 48%" }}>
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
                      if (
                        /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(
                          value
                        ) &&
                        value.trim() !== ""
                      ) {
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
                    // pattern="[a-zA-Z ]+"
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
                  pattern="[a-zA-Z ]+"
                />
              </div>
              <div className="horizontal-rule mb-4">
                <hr />
                <h5 className="horizontal-rule-text fs-5">Travellers List</h5>
              </div>
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
                <p style={{ color: "black", fontSize: "1.2rem", margin: 0 }}>
                  Add Traveler(s)
                </p>
              </div>
              {updatehometravelData.travellerList > 0 ? (
                <>
                  {updatehometravelData.travelType != 3 ? (
                    <>
                      <p
                        style={{
                          color: "black",
                          fontSize: "12px",
                          backgroundColor: "rgb(255 255 220)",
                          padding: "10px",
                          borderRadius: "5px",
                          display: "flex",
                          textAlign: "left",
                          marginTop: "20px",
                        }}
                      >
                        Choose the traveler's name from the dropdown by typing
                        it or searching by their code. If the name isn't listed,
                        select 'Others' from the dropdown
                      </p>
                    </>
                  ) : null}
                  {Array.from({
                    length: updatehometravelData.travellerList,
                  }).map((_, index) => (
                    <>
                      <div style={{ gap: "1rem" }} key={index}>
                        {updatehometravelData.travelType != 3 ? (
                          <>
                            <div className="mb-3 flex-grow-1">
                              <Select
                                className="basic-single"
                                classNamePrefix="select"
                                isClearable
                                isSearchable
                                required
                                name="approvingDepartment"
                                options={[
                                  ...employeelist,
                                  { value: -1, label: "Others" }, // Add the "Others" option
                                ]}
                                value={
                                  // Find the selected option in the combined list
                                  [
                                    ...employeelist,
                                    { value: -1, label: "Others" },
                                  ].find(
                                    (option) =>
                                      option.value ===
                                      updatehometravelData.businessTravellrers[
                                        index
                                      ]?.empId
                                  ) || null
                                }
                                onChange={(selectedOption) => {
                                  const newBusinessTravellers = [
                                    ...updatehometravelData.businessTravellrers,
                                  ];
                                  newBusinessTravellers[index] = {
                                    ...newBusinessTravellers[index],
                                    empId: selectedOption
                                      ? selectedOption.value
                                      : "",
                                  };
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    businessTravellrers: newBusinessTravellers,
                                  });
                                }}
                                styles={{
                                  option: (provided) => ({
                                    ...provided,
                                    textAlign: "left", // Aligns the dropdown options to the left
                                  }),
                                  singleValue: (provided) => ({
                                    ...provided,
                                    textAlign: "left", // Aligns the selected value to the left
                                  }),
                                }}
                                placeholder="Select Traveler Name"
                              />
                            </div>
                          </>
                        ) : null}
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
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    /^[a-zA-Z ]*$/.test(value) &&
                                    value.trim() !== ""
                                  ) {
                                    const newBusinessTravellers = [
                                      ...updatehometravelData.businessTravellrers,
                                    ];
                                    newBusinessTravellers[index] = {
                                      ...newBusinessTravellers[index],
                                      requesterName: value,
                                    };
                                    setupdatehometravelData({
                                      ...updatehometravelData,
                                      businessTravellrers:
                                        newBusinessTravellers,
                                    });
                                  } else if (value === "") {
                                    const newBusinessTravellers = [
                                      ...updatehometravelData.businessTravellrers,
                                    ];
                                    newBusinessTravellers[index] = {
                                      ...newBusinessTravellers[index],
                                      requesterName: value,
                                    };
                                    setupdatehometravelData({
                                      ...updatehometravelData,
                                      businessTravellrers:
                                        newBusinessTravellers,
                                    });
                                  }
                                }}
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
                                label="Name (As Per Passport)"
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
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^[a-zA-Z0-9]*$/.test(value)) {
                                    const newBusinessTravellers = [
                                      ...updatehometravelData.businessTravellrers,
                                    ];
                                    newBusinessTravellers[index] = {
                                      ...newBusinessTravellers[index],
                                      requesterPassportNumber: value,
                                    };
                                    setupdatehometravelData({
                                      ...updatehometravelData,
                                      businessTravellrers:
                                        newBusinessTravellers,
                                    });
                                  } else if (value === "") {
                                    const newBusinessTravellers = [
                                      ...updatehometravelData.businessTravellrers,
                                    ];
                                    newBusinessTravellers[index] = {
                                      ...newBusinessTravellers[index],
                                      requesterPassportNumber: value,
                                    };
                                    setupdatehometravelData({
                                      ...updatehometravelData,
                                      businessTravellrers:
                                        newBusinessTravellers,
                                    });
                                  }
                                }}
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
                                updatehometravelData.businessTravellrers[index]
                                  ?.passportIssueDate || ""
                              }
                              onChange={(e) => {
                                const newBusinessTravellers = [
                                  ...updatehometravelData.businessTravellrers,
                                ];
                                newBusinessTravellers[index] = {
                                  ...newBusinessTravellers[index],
                                  passportIssueDate: e.target.value,
                                };
                                setupdatehometravelData({
                                  ...updatehometravelData,
                                  businessTravellrers: newBusinessTravellers,
                                });
                              }}
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
                                updatehometravelData.businessTravellrers[index]
                                  ?.passportExpiryDate || ""
                              }
                              onChange={(e) => {
                                const newBusinessTravellers = [
                                  ...updatehometravelData.businessTravellrers,
                                ];
                                newBusinessTravellers[index] = {
                                  ...newBusinessTravellers[index],
                                  passportExpiryDate: e.target.value,
                                };
                                setupdatehometravelData({
                                  ...updatehometravelData,
                                  businessTravellrers: newBusinessTravellers,
                                });
                              }}
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
                                updatehometravelData.businessTravellrers[index]
                                  ?.requesterBirthDate || ""
                              }
                              onChange={(e) => {
                                const newBusinessTravellers = [
                                  ...updatehometravelData.businessTravellrers,
                                ];
                                newBusinessTravellers[index] = {
                                  ...newBusinessTravellers[index],
                                  requesterBirthDate: e.target.value,
                                };
                                setupdatehometravelData({
                                  ...updatehometravelData,
                                  businessTravellrers: newBusinessTravellers,
                                });
                              }}
                              className="form-control form-control-lg"
                              required
                              //max={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          className="btn btn-lg"
                          style={{
                            color: "darkred",
                            borderRadius: "50%",
                            padding: "10px",
                            width: "48px",
                            height: "48px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={() => {
                            const newBusinessTravellers =
                              updatehometravelData.businessTravellrers.filter(
                                (_, i) => i !== index
                              );

                            setupdatehometravelData({
                              ...updatehometravelData,
                              businessTravellrers: newBusinessTravellers,
                              travellerList: newBusinessTravellers.length, // Update the traveller count
                            });
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
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
                    onChange={(e) => {
                      setupdatehometravelData({
                        ...updatehometravelData,
                        eventStartDate: e.target.value,
                      });
                    }}
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
                    onChange={(e) => {
                      setupdatehometravelData({
                        ...updatehometravelData,
                        eventEndDate: e.target.value,
                      });
                    }}
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
                    onChange={(e) =>
                      setupdatehometravelData({
                        ...updatehometravelData,
                        hasTransportation: e.target.checked ? 1 : 0,
                      })
                    }
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
                    onChange={(e) =>
                      setupdatehometravelData({
                        ...updatehometravelData,
                        hasAccomdation: e.target.checked ? 1 : 0,
                      })
                    }
                    id="accommodationCheckbox"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="accommodationCheckbox"
                  >
                    Accommodation
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={updatehometravelData.hasAllowance === 1}
                    onChange={(e) =>
                      setupdatehometravelData({
                        ...updatehometravelData,
                        hasAllowance: e.target.checked ? 1 : 0,
                      })
                    }
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
                    onChange={(e) =>
                      setupdatehometravelData({
                        ...updatehometravelData,
                        hasVisa: e.target.checked ? 1 : 0,
                      })
                    }
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
                    onChange={(e) =>
                      setupdatehometravelData({
                        ...updatehometravelData,
                        hasRegistrationFee: e.target.checked ? 1 : 0,
                      })
                    }
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
                          updatehometravelData?.transportation
                            ?.transportationType === "airTicket"
                        }
                        // checked={selectedOption == "airTicket"}
                        onChange={handleAirTicketChange}
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
                        onChange={handleSelfTransferChange}
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
                  {updatehometravelData.transportation.transportationType ===
                    "airTicket" && (
                    <div>
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
                            Flight Class:
                          </label>
                          <select
                            className="form-select form-select-lg custom-select"
                            value={
                              updatehometravelData.transportation.planeClassId
                            } // Access the planeClassId inside transportation
                            onChange={(e) => {
                              setupdatehometravelData({
                                ...updatehometravelData,
                                transportation: {
                                  ...updatehometravelData.transportation,
                                  planeClassId: e.target.value, // Update the planeClassId in transportation
                                },
                              });
                            }}
                            name="planeClassId"
                            required
                          >
                            <option value="">Select Flight Class</option>
                            {updatehometravelData.travelType === 3
                              ? // Show all options if Traveltype is 3
                                planeClasses.map((data) => (
                                  <option
                                    key={data.planeClassId}
                                    value={data.planeClassId}
                                  >
                                    {data.planeClassName}
                                  </option>
                                ))
                              : valid
                              ? // Show only planeClassId 3 if valid is true
                                planeClasses
                                  .filter((data) => data.planeClassId === 2)
                                  .map((data) => (
                                    <option
                                      key={data.planeClassId}
                                      value={data.planeClassId}
                                    >
                                      {data.planeClassName}
                                    </option>
                                  ))
                              : // Show only planeClassId 2 if valid is false
                                planeClasses
                                  .filter((data) => data.planeClassId === 4)
                                  .map((data) => (
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
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow only letters and spaces, but not only spaces
                                if (
                                  /^[a-zA-Z ]*$/.test(value) &&
                                  value.trim() !== ""
                                ) {
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    transportation: {
                                      ...updatehometravelData.transportation,
                                      firstDepartureAirportName: value, // Update the value inside transportation
                                    },
                                  });
                                } else if (value === "") {
                                  // Allow clearing the input
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    transportation: {
                                      ...updatehometravelData.transportation,
                                      firstDepartureAirportName: value, // Update the value to empty
                                    },
                                  });
                                }
                              }}
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
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow only letters and spaces, but not only spaces
                                if (
                                  /^[a-zA-Z ]*$/.test(value) &&
                                  value.trim() !== ""
                                ) {
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    transportation: {
                                      ...updatehometravelData.transportation,
                                      firstArrivalAirportName: value, // Update the value inside transportation
                                    },
                                  });
                                } else if (value === "") {
                                  // Allow clearing the input
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    transportation: {
                                      ...updatehometravelData.transportation,
                                      firstArrivalAirportName: value, // Update the value to empty
                                    },
                                  });
                                }
                              }}
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
                              onChange={(e) => {
                                setupdatehometravelData({
                                  ...updatehometravelData,
                                  transportation: {
                                    ...updatehometravelData.transportation,
                                    departureDate: e.target.value, // Update the departure date inside transportation
                                  },
                                });
                              }}
                              className="form-control form-control-lg custom-date-input"
                              required
                              // min={
                              //   new Date(
                              //     new Date().setDate(new Date().getDate() + 1)
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
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow only letters and spaces, but not only spaces
                                if (
                                  /^[a-zA-Z ]*$/.test(value) &&
                                  value.trim() !== ""
                                ) {
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    transportation: {
                                      ...updatehometravelData.transportation,
                                      secondDepartureAirportName: value,
                                    },
                                  });
                                } else if (value === "") {
                                  // Allow clearing the input
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    transportation: {
                                      ...updatehometravelData.transportation,
                                      secondDepartureAirportName: value,
                                    },
                                  });
                                }
                              }}
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
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow only letters and spaces, but not only spaces
                                if (
                                  /^[a-zA-Z ]*$/.test(value) &&
                                  value.trim() !== ""
                                ) {
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    transportation: {
                                      ...updatehometravelData.transportation,
                                      secondArrivalAirportName: value,
                                    },
                                  });
                                } else if (value === "") {
                                  // Allow clearing the input
                                  setupdatehometravelData({
                                    ...updatehometravelData,
                                    transportation: {
                                      ...updatehometravelData.transportation,
                                      secondArrivalAirportName: value,
                                    },
                                  });
                                }
                              }}
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
                                updatehometravelData.transportation.arrivalDate?.split(
                                  "T"
                                )[0] || ""
                              }
                              onChange={(e) => {
                                setupdatehometravelData({
                                  ...updatehometravelData,
                                  transportation: {
                                    ...updatehometravelData.transportation,
                                    arrivalDate: e.target.value,
                                  },
                                });
                              }}
                              className="form-control form-control-lg custom-date-input"
                              min={
                                updatehometravelData.transportation
                                  .departureDate
                                  ? updatehometravelData.transportation
                                      .departureDate
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      </>
                    </div>
                  )}
                  {updatehometravelData.transportation.transportationType ===
                    "selfTransfer" && (
                    <div>
                      <br />
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
                            updatehometravelData.transportation.otherTransferId
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
                          required
                        >
                          <option value="">Select Transfer Method</option>
                          {traveltype.map((data) => (
                            <option key={data.rowid} value={data.rowid}>
                              {data.transferTypeName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4 flex-grow-1">
                        <label htmlFor="notes" className="form-label fs-6">
                          Notes
                        </label>
                        <input
                          type="text"
                          id="selfTransferNotes"
                          name="selfTransferNotes"
                          value={
                            updatehometravelData.transportation
                              .selfTransferNotes || ""
                          } // Assuming you have a notes property in your state
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only letters and spaces, but not only spaces
                            if (/^[a-zA-Z ]*$/.test(value) || value === "") {
                              setupdatehometravelData({
                                ...updatehometravelData,
                                transportation: {
                                  ...updatehometravelData.transportation,
                                  selfTransferNotes: value,
                                },
                              });
                            }
                          }}
                          className="form-control form-control-lg"
                          pattern="[a-zA-Z ]*"
                          title="Only letters and spaces are allowed" // Optional: Add a title for clarity
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : null}
              <br />
              {updatehometravelData.hasAccomdation == 1 ? (
                <>
                  <div className="horizontal-rule mb-4">
                    <hr />
                    <h5 className="horizontal-rule-text fs-5">Accommodation</h5>
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
                              updatehometravelData.accomdation.eventVenue || ""
                            } // Adjusted to match state structure
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow only letters and spaces, but allow empty input
                              if (/^[a-zA-Z ]*$/.test(value) || value === "") {
                                setupdatehometravelData({
                                  ...updatehometravelData,
                                  accomdation: {
                                    ...updatehometravelData.accomdation,
                                    eventVenue: value, // Update the eventVenue property
                                  },
                                });
                              }
                            }}
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
                              updatehometravelData.accomdation.preferredHotel ||
                              ""
                            } // Adjusted to match state structure
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow only letters and spaces, but allow empty input
                              if (/^[a-zA-Z ]*$/.test(value) || value === "") {
                                setupdatehometravelData({
                                  ...updatehometravelData,
                                  accomdation: {
                                    ...updatehometravelData.accomdation,
                                    preferredHotel: value, // Update the preferredHotel property
                                  },
                                });
                              }
                            }}
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

              {updatehometravelData.confrimedat == null ? (
                <>
                  <p
                    style={{
                      color: "#7f0008",
                      fontWeight: "bold",
                      fontSize: "16px",
                      backgroundColor: "#ffe6e6",
                      padding: "10px",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ marginRight: "8px", fontSize: "18px" }}>
                      ⚠️
                    </span>
                    Note: Once you click on Confirm, no further changes will be
                    allowed.
                  </p>
                  <div className="row">
                    <div className="col-md-6">
                      <button
                        type="button"
                        className="btn btn-primary btn-lg col-12 mt-4"
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "16px",
                          backgroundColor: "#57636f",
                        }}
                        disabled={isLoading}
                        onClick={() => ConfrimBusinessRequestAsync(requestId)} // Use your dynamic ID here
                      >
                        {isLoading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                    <div className="col-md-6">
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
                        {isLoading ? "Saving Draft..." : "Save Draft"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="horizontal-rule mb-4">
                    <h5 className="horizontal-rule-text">
                      Approvals Breakdown
                    </h5>
                  </div>
                  <div className="row">
                    <Table responsive>
                      <MDBDataTable
                        // className="text-left"
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

export default BusinessRequestDetails;
