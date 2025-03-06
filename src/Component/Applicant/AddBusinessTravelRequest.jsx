import {
  SaveBusinessTravel,
  ConfrimBusinessRequest,
  UpdateBusinessRequest,
} from "../Requests/mutators";
import React, { useState, useEffect } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import "./Applicant.css"; // Import your CSS file
import ApplicantTabs from "./ApplicantTabs";
import { useHistory } from "react-router-dom";
import TravellersListInfo from "../shared_components/TravellersListInfo";
import { toast } from "react-toastify";
import jwt from "jwt-decode";

const AddBusinessTravelRequest = () => {
  const history = useHistory();
  const userToken = localStorage.getItem("accessToken");
  const decodedToken = jwt(userToken);
  const empID = decodedToken.nameid;
  // State to track the selected option ('airTicket' or 'selfTransfer')
  const [selectedOption, setSelectedOption] = useState(null);
  const [traveltype, settraveltype] = useState([]);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isLoading, setisLoading] = React.useState(true);
  const [rows, setRows] = useState([{ name: "", relation: "" }]);
  const [required, setrequired] = React.useState(false);
  const [isDraft, setisDraft] = React.useState(false);
  const [valid, setisValid] = React.useState(false);
  const [planeClasses, setplaneClasses] = React.useState([]);
  const [businessClassTravelers, setbusinessClassTravelers] = React.useState(
    []
  );
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const [hometravelData, sethometravelData] = React.useState({
    requestId: 0,
    travelType: 0,
    budgetlineType: null,
    approvingDepartment: "",
    budgetlineName: "",
    travelpurpose: "",
    travellerList: 0,
    hasTransportation: 0,
    hasAccomdation: 0,
    hasVisa: 0,
    hasRegistrationFee: 0,
    hasAllowance: 0,
    accomdation: {
      eventVenue: "",
      preferredHotel: "",
      roomType: "",
      singleRoomCount: 0,
      doubleRoomCount: 0,
      tripleRoomCount: 0,
      requestId: 0,
    },
    transportation: {
      transportationType: "",
      planeClassId: 0,
      otherTransferId: 0,
      firstDepartureAirportName: null,
      selfTransferNotes: null,
      firstArrivalAirportName: null,
      departureDate: null,
      secondDepartureAirportName: null,
      secondArrivalAirportName: null,
      arrivalDate: null,
      requestId: 0,
    },
    businessTravellrers: [],
    eventStartDate: null,
    eventEndDate: null,
  });
  // Handler for selecting Air Ticket
  const handleAirTicketChange = () => {
    const type = "airTicket"; // Directly set the intended type

    // Update selectedOption
    setSelectedOption(type);

    console.log("type", type);
    // Update transportationType in transportation
    sethometravelData((prevData) => ({
      ...prevData, // Spread the existing state
      transportation: {
        ...prevData.transportation, // Spread the transportation object
        transportationType: type, // Update transportationType with the new value
      },
    }));
  };

  // Handler for selecting Self Transfer
  const handleSelfTransferChange = () => {
    const type = "selfTransfer"; // Directly set the intended type

    // Update selectedOption
    setSelectedOption(type);

    console.log("type", type);
    // Update transportationType in transportation
    sethometravelData((prevData) => ({
      ...prevData, // Spread the existing state
      transportation: {
        ...prevData.transportation, // Spread the transportation object
        transportationType: type, // Update transportationType with the new value
      },
    }));
  };

  // // Handler for selecting Air Ticket
  // const handleAirTicketChange = () => {
  //   const newState = { ...hometravelData };
  //   newState.transportation.transportationType =
  //     newState.transportation.transportationType === "airTicket"
  //       ? null
  //       : "airTicket";
  //   sethometravelData(newState);
  //   // setSelectedOption(selectedOption === "airTicket" ? null : "airTicket");
  // };

  // // Handler for selecting Self Transfer
  // const handleSelfTransferChange = () => {
  //   const newState = { ...hometravelData };
  //   newState.transportation.transportationType =
  //     newState.transportation.transportationType === "selfTransfer"
  //       ? ""
  //       : "selfTransfer";
  //   sethometravelData(newState);
  // };
  // Get List of Plane Classes
  // Create a list of empIds from the businessTravellers array
  const GetPlaneClasses = () => {
    var data = "";
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/PlaneClass/GetAllPlaneClass`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        setplaneClasses(response.data);
      })
      .catch(function (error) {});
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
  const onSubmit = async () => {
    try {
      setisLoading(true);
      if (hometravelData.arrivalDate == null) {
        hometravelData.arrivalDate = "";
      }
      const empIdList = hometravelData.businessTravellrers.map(
        (traveller) => traveller.empId
      );
      // Check for null, undefined, or zero values in the list
      if (
        empIdList.some(
          (id) =>
            (id === null || id === undefined || id === 0 || id === "") &&
            hometravelData.travelType != 3
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
        var savedbusinessrequest = await SaveBusinessTravel(hometravelData);
        toast.success("Addition Occured Successfully", {
          position: "top-center",
        });
        var requestId = savedbusinessrequest.data;
        localStorage.setItem("responseRequestID", requestId);
        setisDraft(true);
        setisLoading(false);
        setrequired(false);
      }

      // history.push("/my-business-requests");
    } catch (err) {
      setisLoading(false);
      toast.error("An Error Occured while adding", {
        position: "top-center",
      });
    }
  };
  const responseRequestIDExtracted = localStorage.getItem("responseRequestID");
  const UpdateBusinessRequestAsync = async () => {
    try {
      setisLoading(true);

      // Validate and parse the responseRequestIDExtracted
      const validRequestId =
        responseRequestIDExtracted && !isNaN(Number(responseRequestIDExtracted))
          ? Number(responseRequestIDExtracted)
          : null;

      if (!validRequestId) {
        throw new Error("Invalid Request ID retrieved from localStorage");
      }
      console.log("");
      // Update the `requestId` in the state
      sethometravelData((prevData) => ({
        ...prevData, // Spread the previous state
        requestId: validRequestId, // Update requestId
        transportation: {
          ...prevData.transportation, // Spread the existing transportation object
          transportationType: selectedOption, // Update transportationType
        },
      }));
      const empIdList = hometravelData.businessTravellrers.map(
        (traveller) => traveller.empId
      );
      // Check for null, undefined, or zero values in the list
      if (
        empIdList.some(
          (id) =>
            (id === null || id === undefined || id === 0 || id === "") &&
            hometravelData.travelType != 3
        )
      ) {
        setisLoading(false);
      } else {
        // Call the update function with the updated state
        await UpdateBusinessRequest({
          ...hometravelData,
          requestId: validRequestId,
          updatedAt: null,
        });
        toast.success("Update Occured Successfully", {
          position: "top-center",
        });
        setisLoading(false);
      }
    } catch (err) {
      setisLoading(false);
      console.error(err); // Log error for debugging
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
          depName: hometravelData.approvingDepartment || "",
          budgetLine: hometravelData.budgetlineType || 0,
          hasAllowance: hometravelData.hasAllowance || 0,
        };
        const empIdList = hometravelData.businessTravellrers.map(
          (traveller) => traveller.empId
        );
        // Check for null, undefined, or zero values in the list
        if (
          empIdList.some(
            (id) =>
              (id === null || id === undefined || id === 0 || id === "") &&
              hometravelData.travelType != 3
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
          history.push("/my-business-requests");
        }
      } catch (err) {
        setisLoading(false);
        toast.error("An error occurred. Please try again later.", {
          position: "top-center",
        });
      }
    }
  };

  const SaveandConfrimBusinessRequestAsync = async (requestId) => {
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
        const empIdList = hometravelData.businessTravellrers.map(
          (traveller) => traveller.empId
        );
        // Check for null, undefined, or zero values in the list
        if (
          empIdList.some(
            (id) =>
              (id === null || id === undefined || id === 0 || id === "") &&
              hometravelData.travelType != 3
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
          var savedbusinessrequest = await SaveBusinessTravel(hometravelData);
          var requestId = savedbusinessrequest.data;
          localStorage.setItem("responseRequestID", requestId);
          const payload = {
            requestID: requestId || 0,
            depName: hometravelData.approvingDepartment || "",
            budgetLine: hometravelData.budgetlineType || 0,
            hasAllowance: hometravelData.hasAllowance || 0,
          };

          await ConfrimBusinessRequest(payload);
          setisLoading(false);
          toast.success("Request confirmed successfully!", {
            position: "top-center",
          });
          history.push("/my-business-requests");
        }
      } catch (err) {
        setisLoading(false);
        toast.error("Error while updating user details, please try again", {
          position: "top-center",
        });
      }
    }
  };

  const addTraveller = () => {
    sethometravelData((prevData) => ({
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
  // Function to check if empID exists in the businessClassTravelers list
  const isBusinessClassTraveler = businessClassTravelers.some(
    (traveler) => traveler.businessClassTravelerEmpId == empID
  );

  const empIdList = hometravelData.businessTravellrers.map(
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
  }, [hometravelData]);

  // Generate options dynamically based on conditions
  const filteredPlaneClasses =
    hometravelData.travelType != 3
      ? planeClasses // Allow all plane class choices if travelType is 3
      : isBusinessClassTraveler
      ? planeClasses.filter((data) => data.planeClassId === 2) // Only Business Class
      : planeClasses.filter((data) => data.planeClassId === 4); // Only Economy Class

  useEffect(() => {
    setisLoading(false);
    GetPlaneClasses();
    GetApprovalDepartmentSchema();
    setIsSubmitEnabled(hometravelData.travellerList > 0);
    GetTravelTypes();
    GetAllBusinessTravelers();
  }, [hometravelData.travellerList]);

  return (
    <div>
      <ApplicantTabs />
      <br />
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-lg-8 col-xl-6">
          <div className="card rounded-3">
            <div className="card-body p-6 p-md-5">
              <h5 className="card-header">Request Business Leave</h5>
              <br />
              <ValidatorForm onSubmit={onSubmit} className="px-md-2">
                <div className="horizontal-rule mb-1">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">Travel Details</h5>
                  <br />
                </div>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div className="mb-1 flex-grow-1">
                    <label htmlFor="planeClassId" className="form-label fs-6">
                      Department:
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-select form-select-lg custom-select"
                      value={hometravelData.approvingDepartment} // Access the planeClassId inside transportation
                      onChange={(e) => {
                        sethometravelData({
                          ...hometravelData,
                          approvingDepartment: e.target.value,
                        });
                      }}
                      name="approvingDepartment"
                      required
                    >
                      <option value="">Choose your department</option>
                      {approvalDepartments.map((data) => (
                        <option key={data.depName} value={data.depName}>
                          {data.depName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-1 flex-grow-1">
                    <label htmlFor="departureDate" className="form-label fs-6">
                      Travel Type: <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-select form-select-lg custom-select"
                      value={hometravelData.travelType} // Ensure value is a string
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        sethometravelData((prevState) => ({
                          ...prevState,
                          travelType: value,
                        }));
                      }}
                      name="travelType"
                      required
                    >
                      <option value="">Select an option</option>
                      {/* Default empty option */}
                      <option value="1">Domestic </option>
                      <option value="2">International</option>
                      <option value="3">Guest</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div className="mb-1 flex-grow-1">
                    <label htmlFor="departureDate" className="form-label fs-6">
                      Budget Line Name:<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="budgetlineName"
                      name="budgetlineName"
                      value={hometravelData.budgetlineName}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters and spaces, but not only spaces
                        if (
                          /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(
                            value
                          ) &&
                          value.trim() !== ""
                        ) {
                          sethometravelData({
                            ...hometravelData,
                            budgetlineName: value,
                          });
                        } else if (value === "") {
                          // Allow clearing the input
                          sethometravelData({
                            ...hometravelData,
                            budgetlineName: value,
                          });
                        }
                      }}
                      className="form-control form-control-lg"
                      required
                      // pattern="[a-zA-Z ]+"
                    />
                  </div>
                  <div className="mb-1 flex-grow-1">
                    <label htmlFor="departureDate" className="form-label fs-6">
                      Budget Line Type:<span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-select form-select-lg custom-select"
                      value={hometravelData.budgetlineType} // Ensure value is a string
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        sethometravelData((prevState) => ({
                          ...prevState,
                          budgetlineType: value,
                        }));
                      }}
                      name="budgetlineType"
                      required
                    >
                      <option value="">Select an option</option>{" "}
                      {/* Default empty option */}
                      <option value="1">Business Budget</option>
                      <option value="0">Research Budget</option>
                    </select>
                  </div>
                </div>
                <div className="mb-1 flex-grow-1">
                  <label htmlFor="travelpurpose" className="form-label fs-6">
                    Purpose of travel/ Mission:
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    id="travelpurpose"
                    name="travelpurpose"
                    value={hometravelData.travelpurpose}
                    onChange={(e) => {
                      const value = e.target.value;
                      sethometravelData({
                        ...hometravelData,
                        travelpurpose: value,
                      });
                    }}
                    className="form-control form-control-lg"
                    required
                    rows="5" // Adjust rows to define how many lines of text are visible
                    placeholder="Enter the purpose of your travel or mission"
                  />
                </div>
                <div className="horizontal-rule mb-3">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">Travellers List</h5>
                </div>
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
                  To submit your request, you must include at least one
                  traveler, even if the request is for yourself.
                </p>

                <div className="d-flex align-items-center mb-1">
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
                      fontSize: "16px",
                      margin: 0,
                    }}
                  >
                    Add Traveler(s)
                  </p>
                </div>
                {hometravelData.travellerList > 0 ? (
                  <>
                    {hometravelData.travelType != 3 ? (
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
                          it or searching by their code. If the name isn't
                          listed, select 'Others' from the dropdown
                        </p>
                      </>
                    ) : null}

                    {Array.from({ length: hometravelData.travellerList }).map(
                      (_, index) => (
                        <TravellersListInfo
                          index={index}
                          hometravelData={hometravelData}
                          sethometravelData={sethometravelData}
                        />
                      )
                    )}
                  </>
                ) : null}

                <br />
                <div className="horizontal-rule mb-1">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">Event Dates</h5>
                </div>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div className="mb-1 flex-grow-1">
                    <label htmlFor="departureDate" className="form-label fs-6">
                      From Date:<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="date"
                      id="eventStartDate"
                      name="eventStartDate"
                      value={hometravelData.eventStartDate}
                      onChange={(e) => {
                        sethometravelData({
                          ...hometravelData,
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
                  <div className="mb-1 flex-grow-1">
                    <label htmlFor="departureDate" className="form-label fs-6">
                      To Date:<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="date"
                      id="eventEndDate"
                      name="eventEndDate"
                      value={hometravelData.eventEndDate}
                      onChange={(e) => {
                        sethometravelData({
                          ...hometravelData,
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
                <div className="horizontal-rule mb-3">
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
                      value={hometravelData.hasTransportation}
                      onChange={(e) =>
                        sethometravelData({
                          ...hometravelData,
                          hasTransportation: e.target.checked ? 1 : 0,
                        })
                      }
                      id="transportationCheckbox"
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
                      value={hometravelData.hasAccomdation}
                      onChange={(e) =>
                        sethometravelData({
                          ...hometravelData,
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
                      value={hometravelData.hasAllowance}
                      onChange={(e) =>
                        sethometravelData({
                          ...hometravelData,
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
                      value={hometravelData.hasVisa}
                      onChange={(e) =>
                        sethometravelData({
                          ...hometravelData,
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
                      value={hometravelData.hasRegistrationFee}
                      onChange={(e) =>
                        sethometravelData({
                          ...hometravelData,
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
                <br />
                {hometravelData.hasTransportation == 1 ? (
                  <>
                    <div className="horizontal-rule mb-1">
                      <hr />
                      <h5 className="horizontal-rule-text fs-5">Transfer</h5>
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
                          checked={selectedOption === "airTicket"}
                          onChange={handleAirTicketChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="transportationCheckbox"
                        >
                          Air Ticket
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="accommodationCheckbox"
                          checked={selectedOption === "selfTransfer"}
                          onChange={handleSelfTransferChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="accommodationCheckbox"
                        >
                          Other
                        </label>
                      </div>
                    </div>

                    {/* Conditional rendering based on checkbox state */}
                    {selectedOption === "airTicket" && (
                      <div>
                        <>
                          <br />
                          <div className="horizontal-rule mb-1">
                            <hr />
                            <h5 className="horizontal-rule-text fs-5">
                              Air Ticket Details
                            </h5>
                          </div>
                          <div className="form-outline mb-1">
                            <label
                              htmlFor="planeClassId"
                              className="form-label fs-6"
                            >
                              Flight Class:
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              className="form-select form-select-lg custom-select"
                              value={hometravelData.transportation.planeClassId} // Access the planeClassId inside transportation
                              onChange={(e) => {
                                sethometravelData({
                                  ...hometravelData,
                                  transportation: {
                                    ...hometravelData.transportation,
                                    planeClassId: e.target.value, // Update the planeClassId in transportation
                                  },
                                });
                              }}
                              name="planeClassId"
                              required
                            >
                              <option value="">Select Flight Class</option>
                              {hometravelData.travelType === 3
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
                            <div className="mb-1 flex-grow-1">
                              <label
                                htmlFor="firstDepartureAirportName"
                                className="form-label fs-6"
                              >
                                From:<span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                id="firstDepartureAirportName"
                                name="firstDepartureAirportName"
                                value={
                                  hometravelData.transportation
                                    .firstDepartureAirportName
                                } // Access the value inside transportation
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow only letters and spaces, but not only spaces
                                  if (
                                    /^[a-zA-Z ]*$/.test(value) &&
                                    value.trim() !== ""
                                  ) {
                                    sethometravelData({
                                      ...hometravelData,
                                      transportation: {
                                        ...hometravelData.transportation,
                                        firstDepartureAirportName: value, // Update the value inside transportation
                                      },
                                    });
                                  } else if (value === "") {
                                    // Allow clearing the input
                                    sethometravelData({
                                      ...hometravelData,
                                      transportation: {
                                        ...hometravelData.transportation,
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
                            <div className="mb-1 flex-grow-1">
                              <label
                                htmlFor="firstArrivalAirportName"
                                className="form-label fs-6"
                              >
                                To:<span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                id="firstArrivalAirportName"
                                name="firstArrivalAirportName"
                                value={
                                  hometravelData.transportation
                                    .firstArrivalAirportName
                                } // Access the value inside transportation
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow only letters and spaces, but not only spaces
                                  if (
                                    /^[a-zA-Z ]*$/.test(value) &&
                                    value.trim() !== ""
                                  ) {
                                    sethometravelData({
                                      ...hometravelData,
                                      transportation: {
                                        ...hometravelData.transportation,
                                        firstArrivalAirportName: value, // Update the value inside transportation
                                      },
                                    });
                                  } else if (value === "") {
                                    // Allow clearing the input
                                    sethometravelData({
                                      ...hometravelData,
                                      transportation: {
                                        ...hometravelData.transportation,
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
                            <div className="mb-1 flex-grow-1">
                              <label
                                htmlFor="departureDate"
                                className="form-label fs-6"
                              >
                                Departure Date:
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="date"
                                id="departureDate"
                                name="departureDate"
                                value={
                                  hometravelData.transportation.departureDate ||
                                  ""
                                } // Access the value inside transportation
                                onChange={(e) => {
                                  sethometravelData({
                                    ...hometravelData,
                                    transportation: {
                                      ...hometravelData.transportation,
                                      departureDate: e.target.value, // Update the departure date inside transportation
                                    },
                                  });
                                }}
                                className="form-control form-control-lg custom-date-input"
                                required
                                // max={
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
                            <div className="mb-1 flex-grow-1">
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
                                  hometravelData.transportation
                                    .secondDepartureAirportName || ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow only letters and spaces, but not only spaces
                                  if (
                                    /^[a-zA-Z ]*$/.test(value) &&
                                    value.trim() !== ""
                                  ) {
                                    sethometravelData({
                                      ...hometravelData,
                                      transportation: {
                                        ...hometravelData.transportation,
                                        secondDepartureAirportName: value,
                                      },
                                    });
                                  } else if (value === "") {
                                    // Allow clearing the input
                                    sethometravelData({
                                      ...hometravelData,
                                      transportation: {
                                        ...hometravelData.transportation,
                                        secondDepartureAirportName: value,
                                      },
                                    });
                                  }
                                }}
                                className="form-control form-control-lg"
                                pattern="[a-zA-Z ]+"
                              />
                            </div>

                            <div className="mb-1 flex-grow-1">
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
                                  hometravelData.transportation
                                    .secondArrivalAirportName || ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow only letters and spaces, but not only spaces
                                  if (
                                    /^[a-zA-Z ]*$/.test(value) &&
                                    value.trim() !== ""
                                  ) {
                                    sethometravelData({
                                      ...hometravelData,
                                      transportation: {
                                        ...hometravelData.transportation,
                                        secondArrivalAirportName: value,
                                      },
                                    });
                                  } else if (value === "") {
                                    // Allow clearing the input
                                    sethometravelData({
                                      ...hometravelData,
                                      transportation: {
                                        ...hometravelData.transportation,
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

                            <div className="mb-1 flex-grow-1">
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
                                  hometravelData.transportation.arrivalDate ||
                                  ""
                                }
                                onChange={(e) => {
                                  sethometravelData({
                                    ...hometravelData,
                                    transportation: {
                                      ...hometravelData.transportation,
                                      arrivalDate: e.target.value,
                                    },
                                  });
                                }}
                                className="form-control form-control-lg custom-date-input"
                                // min={
                                //   hometravelData.transportation.departureDate
                                //     ? hometravelData.transportation
                                //         .departureDate
                                //     : ""
                                // }
                              />
                            </div>
                          </div>
                        </>
                      </div>
                    )}
                    {selectedOption === "selfTransfer" && (
                      <div>
                        <br />
                        <div className="form-outline mb-1">
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
                              hometravelData.transportation.otherTransferId
                            } // Access the planeClassId inside transportation
                            onChange={(e) => {
                              sethometravelData({
                                ...hometravelData,
                                transportation: {
                                  ...hometravelData.transportation,
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
                        <div className="mb-1 flex-grow-1">
                          <label
                            htmlFor="selfTransferNotes"
                            className="form-label fs-6"
                          >
                            Notes
                          </label>
                          <input
                            type="text"
                            id="selfTransferNotes"
                            name="selfTransferNotes"
                            value={
                              hometravelData.transportation.selfTransferNotes ||
                              ""
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow only letters and spaces, but not only spaces
                              if (
                                /^[a-zA-Z ]*$/.test(value) &&
                                value.trim() !== ""
                              ) {
                                sethometravelData({
                                  ...hometravelData,
                                  transportation: {
                                    ...hometravelData.transportation,
                                    selfTransferNotes: value,
                                  },
                                });
                              } else if (value === "") {
                                // Allow clearing the input
                                sethometravelData({
                                  ...hometravelData,
                                  transportation: {
                                    ...hometravelData.transportation,
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
                {hometravelData.hasAccomdation == 1 ? (
                  <>
                    <div className="horizontal-rule mb-1">
                      <hr />
                      <h5 className="horizontal-rule-text fs-5">
                        Accommodation
                      </h5>
                    </div>
                    {/* Table for Room Type and Number of Rooms */}
                    <div className="mb-1">
                      <div className="mb-1">
                        <div className="row">
                          <div className="col-md-6 mb-1">
                            {" "}
                            {/* Add margin bottom for spacing */}
                            <label
                              htmlFor="eventVenue"
                              className="form-label fs-6"
                            >
                              Event Venue<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              id="eventVenue"
                              name="eventVenue"
                              value={
                                hometravelData.accomdation.eventVenue || ""
                              } // Adjusted to match state structure
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow only letters and spaces, but allow empty input
                                if (
                                  /^[a-zA-Z ]*$/.test(value) ||
                                  value === ""
                                ) {
                                  sethometravelData({
                                    ...hometravelData,
                                    accomdation: {
                                      ...hometravelData.accomdation,
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

                          <div className="col-md-6 mb-1">
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
                                hometravelData.accomdation.preferredHotel || ""
                              } // Adjusted to match state structure
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow only letters and spaces, but allow empty input
                                if (
                                  /^[a-zA-Z ]*$/.test(value) ||
                                  value === ""
                                ) {
                                  sethometravelData({
                                    ...hometravelData,
                                    accomdation: {
                                      ...hometravelData.accomdation,
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
                                  hometravelData.accomdation.singleRoomCount ||
                                  ""
                                }
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  sethometravelData({
                                    ...hometravelData,
                                    accomdation: {
                                      ...hometravelData.accomdation,
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
                                  hometravelData.accomdation.doubleRoomCount ||
                                  ""
                                }
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  sethometravelData({
                                    ...hometravelData,
                                    accomdation: {
                                      ...hometravelData.accomdation,
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
                                  hometravelData.accomdation.tripleRoomCount ||
                                  ""
                                }
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  sethometravelData({
                                    ...hometravelData,
                                    accomdation: {
                                      ...hometravelData.accomdation,
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

                {isDraft == true ? (
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
                      Note: Once you click on Submit for Review, no further
                      changes will be allowed.
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
                          onClick={() =>
                            ConfrimBusinessRequestAsync(
                              responseRequestIDExtracted
                            )
                          } // Use your dynamic ID here
                        >
                          {isLoading
                            ? "Submitting for review..."
                            : "Submit for review"}
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
                          onClick={() =>
                            UpdateBusinessRequestAsync(
                              responseRequestIDExtracted
                            )
                          } // Use your dynamic ID here
                        >
                          {isLoading ? "Updating Draft..." : "Update Draft"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
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
                      Note: Once you click on Submit for Review, no further
                      changes will be allowed.
                    </p>
                    <div className="row">
                      <div className="col-md-6">
                        <button
                          type="button"
                          className="btn btn-primary btn-lg col-12"
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "16px",
                            backgroundColor: "#57636f",
                          }}
                          disabled={!isSubmitEnabled || isLoading}
                          onClick={() =>
                            SaveandConfrimBusinessRequestAsync(
                              responseRequestIDExtracted
                            )
                          } // Use your dynamic ID here
                        >
                          {isLoading ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          type="submit"
                          className="btn btn-success btn-lg col-12"
                          style={{
                            backgroundColor: "#57636f",
                            borderColor: "#7f0008",
                          }}
                          disabled={!isSubmitEnabled || isLoading}
                        >
                          {isLoading ? "Saving Draft..." : "Save Draft"}
                        </button>
                      </div>
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

export default AddBusinessTravelRequest;
