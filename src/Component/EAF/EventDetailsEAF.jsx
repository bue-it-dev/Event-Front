import React, { useState, useEffect, useCallback } from "react";
import URL from "../Util/config";
import "../Applicant/Applicant.css";
import { MDBDataTable } from "mdbreact";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { UpdateHomeRequest } from "../Requests/mutators";
import { getToken } from "../Util/Authenticate";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import EventInfo from "../shared_components/EventPassportInfo";
import EventSelections from "../shared_components/EventSelections";
import EventFilesSection from "../shared_components/EventFilesSection";
import EventBuildingVenueListInfo from "../shared_components/eventBuildingVenueListInfo";
import EventBuildingVenueListUpdate from "../shared_components/EventBuildingVenueListUpdate";
import {
  UpdateEventRequest,
  UpdateFiles,
  UpdateEventApproval,
} from "../Requests/mutators";
import GetEventFilesSection from "../shared_components/GetEventFilesSection";
const EventDetailsEAF = () => {
  const history = useHistory();
  const [passportFiles, setPassportFiles] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [transportationTypes, setTransportationTypes] = useState([]);
  const [itComponentsList, setItComponentsList] = useState([]);
  const [isLoading, setisLoading] = React.useState(true);
  const [errors, setErrors] = useState({});
  const [natureofevents, setnatureofEvents] = useState([]);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const [approvalTracker, setApprovalTracker] = useState([]);
  const location = useLocation();
  // Validate input and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    switch (name) {
      case "eventTitle":
        if (!/^[a-zA-Z ]+$/.test(value.trim())) {
          newErrors[name] = "Event title must contain only letters.";
        } else {
          delete newErrors[name];
        }
        break;

      case "nomParticipants":
        if (!/^\d+$/.test(value) || parseInt(value, 10) < 1) {
          newErrors[name] = "Participants must be a positive number.";
        } else {
          delete newErrors[name];
        }
        break;

      case "eventStartDate":
        if (!value) {
          newErrors[name] = "Start date is required.";
        } else {
          delete newErrors[name];
        }
        break;

      case "EventEndDate":
        if (!value) {
          newErrors[name] = "End date is required.";
        } else if (
          eventData.EventStartDate &&
          value < eventData.EventStartDate
        ) {
          newErrors[name] = "End date cannot be before start date.";
        } else {
          delete newErrors[name];
        }
        break;

      case "OrganizerMobile":
        if (!/^01(0|1|2|5)\d{8}$/.test(value) && value !== "") {
          newErrors[name] = "Enter a valid Egyptian phone number (11 digits).";
        } else {
          delete newErrors[name];
        }
        break;

      case "OrganizerExtention":
        if (!/^\d{4}$/.test(value) && value !== "") {
          newErrors[name] = "Extension must be exactly 4 digits.";
        } else {
          delete newErrors[name];
        }
        break;

      case "organizerPosition":
        if (!/^[a-zA-Z ]+$/.test(value.trim())) {
          newErrors[name] = "Organizer Position must contain only letters.";
        } else {
          delete newErrors[name];
        }
        break;

      default:
        break;
    }

    seteventData({ ...eventData, [name]: value });
    setErrors(newErrors);
  };
  if (location.state) {
    let saverequestId = JSON.stringify(location.state.requestId);
    let saverequeststatus = JSON.stringify(location.state.statusName);
    localStorage.setItem("requestId", saverequestId);
    localStorage.setItem("status", saverequeststatus);
  }
  let requestId = JSON.parse(localStorage.getItem("requestId"));
  let status = JSON.parse(localStorage.getItem("status"));
  const [eventData, seteventData] = React.useState({
    eventId: 0,
    approvingDepTypeId: 0,
    eventTitle: "",
    nomParticipants: 0,
    eventStartDate: null,
    natureOfEventId: 0,
    eventEndDate: null,
    hasIt: 0,
    hasAccomdation: 0,
    hasTransportation: 0,
    endDateTime: null,
    startDateTime: null,
    organizerName: "",
    organizerMobile: "",
    organizerExtention: "",
    approvingDeptName: null,
    deptId: null,
    isOthers: 0,
    isStaffStudents: 0,
    isChairBoardPrisidentVcb: 0,
    ledOfTheUniversityOrganizerFilePath: null,
    officeOfPresedentFilePath: null,
    visitAgendaFilePath: null,
    confirmedAt: null,
    isVip: 0,
    passports: [],
    itcomponentEvents: [
      {
        id: 0,
        eventId: 0,
        itcomponentId: 0,
        quantity: 0,
      },
    ],
    transportations: [
      {
        transportationTypeId: 0,
        eventId: 0,
        startDate: null,
        endDate: null,
        quantity: 0,
      },
    ],
    accommodations: [
      {
        roomTypeId: 0,
        eventId: 0,
        startDate: null,
        endDate: null,
        numOfRooms: 0,
      },
    ],
    buildingVenues: [
      {
        eventId: 0,
        venueId: 0,
        buildingId: 0,
      },
    ],
    Venues: null,
    travellerList: 0,
  });

  const GetEventDetails = async (eventId) => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/details/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const eventDetails = response.data.data;

      // Ensure file-related fields are not directly assigned
      const {
        ledOfTheUniversityOrganizerFilePath,
        officeOfPresedentFilePath,
        visitAgendaFilePath,
        ...filteredEventDetails
      } = eventDetails;

      seteventData({
        ...filteredEventDetails,
        buildingVenues: eventDetails.buildingVenues ?? [],
        transportations: eventDetails.transportations
          ? [...eventDetails.transportations]
          : [],
        accommodations: eventDetails.accommodations
          ? [...eventDetails.accommodations]
          : [],
        itcomponentEvents: eventDetails.itcomponentEvents
          ? [...eventDetails.itcomponentEvents]
          : [],
        // Set file-related fields to null or handle them appropriately
        ledOfTheUniversityOrganizerFilePath:
          eventDetails.ledOfTheUniversityOrganizerFilePath,
        officeOfPresedentFilePath: eventDetails.officeOfPresedentFilePath,
        visitAgendaFilePath: visitAgendaFilePath,
      });
    } catch (error) {
      console.error("Error fetching event Details:", error);
    }
  };

  // Get List of GetNatureofEvents
  const GetNatureofEvents = () => {
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/EventEntity/get-naturesOfEvent`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    axios(config)
      .then(function (response) {
        setnatureofEvents(response.data.data);
      })
      .catch(function (error) {
        console.error("Error fetching departments:", error);
      });
  };
  // Get List of Approval Department Schema
  const GetApprovalDepartmentSchema = () => {
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/EventEntity/get-approval-departments-schema`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    axios(config)
      .then(function (response) {
        setapprovalDepartments(response.data.data);
      })
      .catch(function (error) {
        console.error("Error fetching departments:", error);
      });
  };
  // Fetch room types
  const getRoomTypes = async () => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-rooms`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setRoomTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

  // Fetch transportation types
  const getTransportationTypes = async () => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-transportationType`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setTransportationTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching transportation types:", error);
    }
  };

  // Fetch IT components
  const getItComponents = async () => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-itComponents`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setItComponentsList(response.data.data);
    } catch (error) {
      console.error("Error fetching IT components:", error);
    }
  };

  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);
    const newPassportFiles = [...passportFiles];
    newPassportFiles[index] = files;
    setPassportFiles(newPassportFiles);
  };
  const onSubmit = async () => {
    try {
      setisLoading(true);
      await UpdateEventRequest(eventData);

      if (requestId) {
        await UpdateFiles(
          requestId,
          passportFiles || [],
          eventData.OfficeOfPresedentFile,
          eventData.LedOfTheUniversityOrganizerFile,
          eventData.VisitAgendaFile
        );
      }
      setisLoading(false);
      toast.success("Event added successfully", { position: "top-center" });
      history.push("/my-event-requests");
    } catch (err) {
      setisLoading(false);
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
      });
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
  // --- Toggle Handlers ---

  // Accommodation toggle
  const handleAccommodationCheckbox = (e) => {
    const isChecked = e.target.checked;
    seteventData((prevData) => ({
      ...prevData,
      hasAccomdation: isChecked ? 1 : 0,
      accommodations: isChecked ? [] : [],
    }));
  };

  // IT Components toggle
  const handleItComponentsCheckbox = (e) => {
    const isChecked = e.target.checked;
    seteventData((prevData) => ({
      ...prevData,
      hasIt: isChecked ? 1 : 0,
      ItComponents: isChecked ? [] : [],
    }));
  };

  // --- Change Handlers ---
  // Transportation: when a checkbox is toggled, add/remove a transportation object
  const handleAccommodatitonTypeCheckbox = (e) => {
    const { value, checked } = e.target;
    const roomTypeId = Number(value); // Ensure ID is a number

    seteventData((prevData) => {
      let updatedaccommodations = [...prevData.accommodations];

      if (checked) {
        // Add only if it doesn't already exist
        if (!updatedaccommodations.some((t) => t.roomTypeId === roomTypeId)) {
          updatedaccommodations.push({
            roomTypeId: roomTypeId,
            startDate: "",
            endDate: "",
            numOfRooms: "",
          });
        }
      } else {
        // Remove the item if unchecked
        updatedaccommodations = updatedaccommodations.filter(
          (t) => t.roomTypeId !== roomTypeId
        );
      }

      return { ...prevData, accommodations: updatedaccommodations };
    });
  };

  // Update fields (StartDate, EndDate, Quantity) for a transportation object
  const handleAcommodationChange = (index, field, value) => {
    const updatedaccommodations = eventData.accommodations.map((accomm, i) =>
      i === index ? { ...accomm, [field]: value } : accomm
    );
    seteventData({ ...eventData, accommodations: updatedaccommodations });
  };

  // Transportation: when a checkbox is toggled, add/remove a transportation object
  const handleTransportationTypeCheckbox = (e) => {
    const { value, checked } = e.target;
    const transportationTypeId = Number(value); // Ensure ID is a number

    seteventData((prevData) => {
      let updatedtransportations = [...prevData.transportations];

      if (checked) {
        // Add only if it doesn't already exist
        if (
          !updatedtransportations.some(
            (t) => t.transportationTypeId === transportationTypeId
          )
        ) {
          updatedtransportations.push({
            transportationTypeId: transportationTypeId,
            startDate: "",
            endDate: "",
            quantity: "",
          });
        }
      } else {
        // Remove the item if unchecked
        updatedtransportations = updatedtransportations.filter(
          (t) => t.transportationTypeId !== transportationTypeId
        );
      }

      return { ...prevData, transportations: updatedtransportations };
    });
  };

  // Update fields (StartDate, EndDate, Quantity) for a transportation object
  const handleTransportationChange = (index, field, value) => {
    const updatedtransportations = eventData.transportations.map(
      (transport, i) =>
        i === index ? { ...transport, [field]: value } : transport
    );
    seteventData({ ...eventData, transportations: updatedtransportations });
  };

  const handleItComponentCheckbox = (e) => {
    const { value, checked } = e.target;
    const itcomponentId = Number(value); // Ensure ID is a number

    seteventData((prevData) => {
      let updatedItComponents = [...prevData.itcomponentEvents];

      if (checked) {
        // Add only if it doesn't already exist
        if (
          !updatedItComponents.some(
            (item) => item.itcomponentId === itcomponentId
          )
        ) {
          updatedItComponents.push({ itcomponentId, Quantity: "" });
        }
      } else {
        // Remove the item if unchecked
        updatedItComponents = updatedItComponents.filter(
          (item) => item.itcomponentId !== itcomponentId
        );
      }

      return { ...prevData, itcomponentEvents: updatedItComponents };
    });
  };

  const handleItComponentQuantityChange = (itcomponentId, value) => {
    seteventData((prevData) => {
      const updatedItComponents = prevData.itcomponentEvents.map((item) =>
        item.itcomponentId === itcomponentId
          ? { ...item, quantity: value }
          : item
      );

      return { ...prevData, itcomponentEvents: updatedItComponents };
    });
  };
  const handleApproval = useCallback(
    async (statusId) => {
      try {
        setisLoading(true);
        // Create a new object with the updated status
        const payload = {
          status: statusId,
          userTypeId: 15,
          eventId: requestId,
        };
        // Wait for the backend response
        const response = await UpdateEventApproval(payload);
        setisLoading(false);
        if (statusId == 1) {
          toast.success("Request Approved successfully", {
            position: "top-center",
          });
        } else {
          toast.error("Request Rejected!", {
            position: "top-center",
          });
        }
        // Ensure UI navigation only happens after the toast is shown
        setTimeout(() => {
          history.push("/event-approval-list-eaf");
        }, 1000); // Give users time to see the message
      } catch (error) {
        setisLoading(false);
        console.error("Error while updating user details:", error);
        toast.error("Error while updating user details, please try again", {
          position: "top-center",
        });
      }
    },
    [setisLoading]
  );

  // Get List of Buildings
  const Getbuildings = async () => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-buildings`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setBuildings(response.data.data);
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  // Get List of Venues for Selected Building
  const getVenues = async (buildingId) => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-venuse?buildinId=${buildingId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setVenues(response.data.data);
      console.log("venues", venues);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const getBuildingVenues = async () => {
    try {
      console.log("buildings", buildings);
      // Assuming `buildings` is an array
      for (const b of buildings) {
        await getVenues(b.buildingId); // Await the async function
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };
  useEffect(() => {
    if (buildings.length > 0) {
      getBuildingVenues();
    }
  }, [buildings]);
  useEffect(() => {
    setisLoading(false);
    GetEventDetails(requestId);
    GetApprovalDepartmentSchema();
    GetNatureofEvents();
    getRoomTypes();
    getTransportationTypes();
    getItComponents();
    Getbuildings();
    getBuildingVenues();
  }, [requestId]);

  return (
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-lg-6 col-xl-6">
          <div className="card rounded-3 shadow-lg border-0">
            <div className="card-body p-4 p-md-5">
              <h5 className="card-header bg-white text-white border-bottom pb-3 fs-4">
                Event Details
              </h5>

              <div className="horizontal-rule mb-4">
                <hr className="border-secondary" />
                <h5 className="horizontal-rule-text fs-5 text-dark">
                  Department Info
                </h5>
              </div>

              <div className="mb-4 flex-grow-1">
                <select
                  className="form-select form-select-lg"
                  value={eventData.approvingDepTypeId}
                  onChange={(e) => {
                    seteventData({
                      ...eventData,
                      approvingDepTypeId: Number(e.target.value),
                    });
                  }}
                  name="approvingDepTypeId"
                  required
                  disabled
                >
                  <option value="">
                    Select your First Level Up Department
                  </option>
                  {approvalDepartments.map((data) => (
                    <option key={data.rowId} value={data.rowId}>
                      {data.depName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="horizontal-rule mb-4">
                <hr className="border-secondary" />
                <h5 className="horizontal-rule-text fs-5 text-dark">
                  Event Info
                </h5>
              </div>
              <div className="container-fluid">
                <div className="card shadow-sm px-5 py-4 w-150 mx-auto">
                  <div className="row g-4">
                    {/* Event Title */}
                    <div className="col-lg-6">
                      <label
                        htmlFor="EventTitle"
                        className="form-label font-weight-bold"
                      >
                        Event Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="eventTitle"
                        name="eventTitle"
                        value={eventData.eventTitle}
                        disabled
                        onChange={handleChange}
                        className="form-control form-control-lg w-100"
                        required
                      />
                      {errors.eventTitle && (
                        <small className="text-danger">
                          {errors.eventTitle}
                        </small>
                      )}
                    </div>

                    {/* Number of Participants */}
                    <div className="col-lg-6">
                      <label
                        htmlFor="NomParticipants"
                        className="form-label font-weight-bold"
                      >
                        Number of Participants
                      </label>
                      <input
                        type="number"
                        id="nomParticipants"
                        name="nomParticipants"
                        disabled
                        value={eventData.nomParticipants || ""}
                        onChange={handleChange}
                        className="form-control form-control-lg w-100"
                        min="1"
                      />
                      {errors.nomParticipants && (
                        <small className="text-danger">
                          {errors.nomParticipants}
                        </small>
                      )}
                    </div>

                    {/* Event Start Date */}
                    <div className="col-lg-6">
                      <label
                        htmlFor="EventStartDate"
                        className="form-label font-weight-bold"
                      >
                        Event Start Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        id="eventStartDate"
                        name="eventStartDate"
                        disabled
                        value={eventData.eventStartDate?.split("T")[0] || ""}
                        onChange={handleChange}
                        className="form-control form-control-lg w-100"
                        required
                      />
                      {errors.eventStartDate && (
                        <small className="text-danger">
                          {errors.eventStartDate}
                        </small>
                      )}
                    </div>

                    {/* Event End Date */}
                    <div className="col-lg-6">
                      <label
                        htmlFor="EventEndDate"
                        className="form-label font-weight-bold"
                      >
                        Event End Date
                      </label>
                      <input
                        type="date"
                        id="eventEndDate"
                        name="eventEndDate"
                        disabled
                        value={eventData.eventEndDate?.split("T")[0] || ""}
                        onChange={handleChange}
                        className="form-control form-control-lg w-100"
                      />
                      {errors.eventEndDate && (
                        <small className="text-danger">
                          {errors.eventEndDate}
                        </small>
                      )}
                    </div>

                    {/* Organizer Name */}
                    <div className="col-lg-6">
                      <label
                        htmlFor="OrganizerName"
                        className="form-label font-weight-bold"
                      >
                        Organizer Name
                      </label>
                      <input
                        type="text"
                        id="organizerName"
                        name="organizerName"
                        disabled
                        value={eventData.organizerName || ""}
                        onChange={handleChange}
                        className="form-control form-control-lg w-100"
                      />
                    </div>

                    {/* Organizer Mobile */}
                    <div className="col-lg-6">
                      <label
                        htmlFor="OrganizerMobile"
                        className="form-label font-weight-bold"
                      >
                        Organizer Mobile
                      </label>
                      <div className="input-group w-100">
                        <div className="input-group-prepend">
                          <span className="input-group-text">📞</span>
                        </div>
                        <input
                          type="tel"
                          id="organizerMobile"
                          name="organizerMobile"
                          disabled
                          value={eventData.organizerMobile || ""}
                          onChange={handleChange}
                          maxLength={11}
                          className="form-control form-control-lg"
                          placeholder="Enter valid Egyptian phone number"
                        />
                      </div>
                      {errors.organizerMobile && (
                        <small className="text-danger">
                          {errors.organizerMobile}
                        </small>
                      )}
                    </div>

                    {/* Organizer Extension */}
                    <div className="col-lg-6">
                      <label
                        htmlFor="OrganizerExtention"
                        className="form-label font-weight-bold"
                      >
                        Organizer Extension
                      </label>
                      <input
                        type="text"
                        id="organizerExtention"
                        disabled
                        name="organizerExtention"
                        value={eventData.organizerExtention || ""}
                        onChange={handleChange}
                        className="form-control form-control-lg w-100"
                      />
                      {errors.organizerExtention && (
                        <small className="text-danger">
                          {errors.organizerExtention}
                        </small>
                      )}
                    </div>

                    {/* Organizer Email */}
                    <div className="col-lg-6">
                      <label
                        htmlFor="OrganizerEmail"
                        className="form-label font-weight-bold"
                      >
                        Organizer Email
                      </label>
                      <div className="input-group w-100">
                        <div className="input-group-prepend">
                          <span className="input-group-text">@</span>
                        </div>
                        <input
                          type="email"
                          id="OrganizerEmail"
                          name="organizerEmail"
                          disabled
                          value={eventData.organizerEmail || ""}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                        />
                      </div>
                    </div>
                    {/* Organizer Extension */}
                    <div className="col-lg-6">
                      <label
                        htmlFor="organizerPosition"
                        className="form-label font-weight-bold"
                      >
                        Organizer Position
                      </label>
                      <input
                        type="text"
                        id="organizerPosition"
                        name="organizerPosition"
                        disabled
                        value={eventData.organizerPosition || ""}
                        onChange={handleChange}
                        className="form-control form-control-lg w-100"
                      />
                      {errors.organizerPosition && (
                        <small className="text-danger">
                          {errors.organizerPosition}
                        </small>
                      )}
                    </div>

                    {/* Organizer Email */}
                    <div className="col-lg-6">
                      <label
                        htmlFor="natureOfEventId"
                        className="form-label font-weight-bold"
                      >
                        Nature of Event
                      </label>
                      <select
                        className="form-select form-select-lg"
                        value={eventData.natureOfEventId}
                        disabled
                        onChange={(e) => {
                          seteventData({
                            ...eventData,
                            natureOfEventId: Number(e.target.value),
                          });
                        }}
                        name="natureOfEventId"
                        required
                      >
                        <option value="">Select nature of event</option>
                        {natureofevents.map((data) => (
                          <option
                            key={data.natureOfEventId}
                            value={data.natureOfEventId}
                          >
                            {data.natureOfEvent}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* <EventInfo eventData={eventData} seteventData={seteventData} /> */}

              <div className="horizontal-rule mb-4">
                <hr className="border-secondary" />
                <h5 className="horizontal-rule-text fs-5 text-dark">
                  Requested Services
                </h5>
              </div>

              <ValidatorForm onSubmit={onSubmit} className="px-md-2">
                <div className="container-fluid">
                  <div
                    className="card shadow-lg px-5 py-4 w-100 mx-auto"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    {/* Accommodation Section */}
                    <div
                      className="card shadow-sm p-3 mt-3"
                      style={{ backgroundColor: "#f1f3f5" }}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          id="hasAccomdation"
                          className="form-check-input me-2"
                          disabled
                          checked={eventData.hasAccomdation === 1}
                          onChange={handleAccommodationCheckbox}
                        />
                        <label
                          className="form-check-label font-weight-bold text-dark"
                          htmlFor="hasAccomdation"
                          style={{ fontSize: "14px" }}
                        >
                          Requires Accommodation
                        </label>
                      </div>

                      {eventData.hasAccomdation === 1 && (
                        <div className="mt-3">
                          <div className="row g-3">
                            <div className="row g-3">
                              {roomTypes.map((type) => (
                                <div key={type.roomTypeId} className="col-md-3">
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      disabled
                                      id={`Rooms-${type.roomTypeId}`}
                                      value={type.roomTypeId}
                                      checked={eventData?.accommodations?.some(
                                        (t) => t.roomTypeId === type.roomTypeId
                                      )}
                                      onChange={
                                        handleAccommodatitonTypeCheckbox
                                      }
                                    />
                                    <label
                                      className="form-check-label text-dark"
                                      htmlFor={`transportation-${type.roomTypeId}`}
                                      style={{ fontSize: "14px" }}
                                    >
                                      {type.roomTypeName}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {eventData.accommodations.map((accom, index) => (
                              <div key={index} className="row g-3 mt-3">
                                <div className="col-md-3">
                                  <label
                                    className="form-label font-weight-bold text-dark"
                                    disabled
                                    style={{ fontSize: "14px" }}
                                  >
                                    {
                                      roomTypes.find(
                                        (room) =>
                                          room.roomTypeId === accom.roomTypeId
                                      )?.roomTypeName
                                    }
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="date"
                                    className="form-control form-control-sm rounded shadow-sm"
                                    disabled
                                    value={accom.startDate?.split("T")[0] || ""}
                                    onChange={(e) =>
                                      handleAcommodationChange(
                                        index,
                                        "startDate",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="date"
                                    className="form-control form-control-sm rounded shadow-sm"
                                    value={accom.endDate?.split("T")[0] || ""}
                                    disabled
                                    onChange={(e) =>
                                      handleAcommodationChange(
                                        index,
                                        "endDate",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm rounded shadow-sm"
                                    placeholder="Quantity"
                                    disabled
                                    value={accom.numOfRooms || ""}
                                    onChange={(e) =>
                                      handleAcommodationChange(
                                        index,
                                        "numOfRooms",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Transportation Section */}
                    <div
                      className="card shadow-sm p-3 mt-3"
                      style={{ backgroundColor: "#f1f3f5" }}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          id="hasTransportation"
                          className="form-check-input me-2"
                          disabled
                          checked={eventData.hasTransportation === 1}
                          onChange={() =>
                            seteventData((prev) => ({
                              ...prev,
                              hasTransportation:
                                prev.hasTransportation === 1 ? 0 : 1, // Toggle state
                            }))
                          }
                        />
                        <label
                          className="form-check-label font-weight-bold text-dark"
                          htmlFor="hasTransportation"
                          style={{ fontSize: "14px" }}
                        >
                          Requires Transportation
                        </label>
                      </div>

                      {eventData.hasTransportation === 1 && (
                        <div className="mt-3">
                          <div className="row g-3">
                            {transportationTypes.map((type) => (
                              <div
                                key={type.transportationTypeId}
                                className="col-md-3"
                              >
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`transportation-${type.transportationTypeId}`}
                                    disabled
                                    value={type.transportationTypeId}
                                    checked={eventData?.transportations?.some(
                                      (t) =>
                                        t.transportationTypeId ===
                                        type.transportationTypeId
                                    )}
                                    onChange={handleTransportationTypeCheckbox}
                                  />
                                  <label
                                    className="form-check-label text-dark"
                                    htmlFor={`transportation-${type.transportationTypeId}`}
                                    style={{ fontSize: "14px" }}
                                  >
                                    {type.transportationType1}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>

                          {eventData?.transportations?.map(
                            (transport, index) => (
                              <div key={index} className="row g-3 mt-3">
                                <div className="col-md-3">
                                  <label
                                    className="form-label font-weight-bold text-dark"
                                    disabled
                                    style={{ fontSize: "14px" }}
                                  >
                                    {
                                      transportationTypes.find(
                                        (item) =>
                                          item.transportationTypeId ===
                                          transport.transportationTypeId
                                      )?.transportationType1
                                    }
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="date"
                                    className="form-control form-control-sm rounded shadow-sm"
                                    disabled
                                    value={
                                      transport.startDate?.split("T")[0] || ""
                                    }
                                    onChange={(e) =>
                                      handleTransportationChange(
                                        index,
                                        "startDate",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="date"
                                    className="form-control form-control-sm rounded shadow-sm"
                                    disabled
                                    value={
                                      transport.endDate?.split("T")[0] || ""
                                    }
                                    onChange={(e) =>
                                      handleTransportationChange(
                                        index,
                                        "endDate",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm rounded shadow-sm"
                                    placeholder="Quantity"
                                    disabled
                                    value={transport.quantity || ""}
                                    onChange={(e) =>
                                      handleTransportationChange(
                                        index,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* IT Components Section */}
                    <div
                      className="card shadow-sm p-3 mt-3"
                      style={{ backgroundColor: "#f1f3f5" }}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          id="hasIt"
                          className="form-check-input me-2"
                          disabled
                          checked={eventData.hasIt === 1}
                          onChange={handleItComponentsCheckbox}
                        />
                        <label
                          className="form-check-label font-weight-bold text-dark"
                          htmlFor="hasIt"
                          style={{ fontSize: "14px" }}
                        >
                          Requires IT Components
                        </label>
                      </div>

                      {eventData.hasIt === 1 && (
                        <div className="mt-3">
                          <div className="row g-3">
                            {itComponentsList?.map((component) => (
                              <div
                                key={component.itcomponentId}
                                className="col-md-3"
                              >
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`itcomponent-${component.itcomponentId}`}
                                    disabled
                                    value={component.itcomponentId}
                                    checked={eventData?.itcomponentEvents?.some(
                                      (item) =>
                                        item.itcomponentId ===
                                        component.itcomponentId
                                    )}
                                    onChange={handleItComponentCheckbox}
                                  />
                                  <label
                                    className="form-check-label text-dark"
                                    htmlFor={`itcomponent-${component.itcomponentId}`}
                                    style={{ fontSize: "14px" }}
                                  >
                                    {component.component}
                                  </label>
                                </div>
                                {eventData?.itcomponentEvents?.some(
                                  (item) =>
                                    item.itcomponentId ===
                                    component.itcomponentId
                                ) && (
                                  <input
                                    type="number"
                                    className="form-control form-control-sm rounded shadow-sm mt-2"
                                    placeholder="Quantity"
                                    value={
                                      eventData.itcomponentEvents.find(
                                        (item) =>
                                          item.itcomponentId ===
                                          component.itcomponentId
                                      )?.quantity || ""
                                    }
                                    onChange={(e) =>
                                      handleItComponentQuantityChange(
                                        component.itcomponentId,
                                        e.target.value
                                      )
                                    }
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <div className="horizontal-rule mb-4">
                  <hr className="border-secondary" />
                  <h5 className="horizontal-rule-text fs-5 text-dark">
                    Requested Venues
                  </h5>
                </div>

                {/* <div className="d-flex align-items-center mb-3">
                  <button
                    type="button"
                    className="btn btn-dark btn-sm d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      fontSize: "18px",
                      borderRadius: "50%",
                      marginRight: "10px",
                      transition: "0.3s ease",
                    }}
                    onClick={addBuildingVenue}
                  >
                    +
                  </button>
                  <p className="text-dark mb-0 fs-6">Add Venue(s)</p>
                </div> */}

                {eventData?.buildingVenues?.map((_, index) => (
                  <div className="row align-items-center">
                    {/* Building Select */}
                    <div className="col-md-6">
                      <label className="form-label font-weight-bold">
                        Building
                      </label>
                      <select
                        className="form-control custom-select custom-select-lg"
                        value={
                          eventData.buildingVenues[index]?.buildingId || ""
                        }
                        name="buildings"
                        disabled
                      >
                        <option value="">Select building</option>
                        {buildings.map((data) => (
                          <option key={data.buildingId} value={data.buildingId}>
                            {data.building}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Venue Select (Shown Only When Building is Selected) */}
                    <div className="col-md-5 mt-3 mt-md-0">
                      <label className="form-label font-weight-bold">
                        Venue
                      </label>
                      <select
                        className="form-control custom-select custom-select-lg"
                        value={eventData.buildingVenues[index]?.venueId || ""}
                        name="venues"
                        disabled
                      >
                        <option value="">Select venue</option>
                        {venues.map((venue) => (
                          <option key={venue.venueId} value={venue.venueId}>
                            {venue.venueName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                <br />
                <div className="horizontal-rule mb-4">
                  <hr className="border-secondary" />
                  <h5 className="horizontal-rule-text fs-5 text-dark">
                    Event Attendance Section
                  </h5>
                </div>

                <GetEventFilesSection
                  eventData={eventData}
                  setEventData={seteventData}
                  handleFileChange={handleFileChange}
                />
                <div className="horizontal-rule mb-4">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">
                    Budget Office Section Entry
                  </h5>
                </div>
                <div className="mb-4">
                  <div className="mb-4">
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        {/* Add margin bottom for spacing */}
                        <label htmlFor="budgetCode" className="form-label fs-6">
                          Budget Code
                        </label>
                        <input
                          type="text"
                          id="budgetCode"
                          name="budgetCode"
                          disabled
                          value={eventData.budgetCode || ""} // Adjusted to match state structure
                          onChange={(e) => {
                            const value = e.target.value;
                            seteventData({
                              ...eventData,
                              budgetCode: value,
                            });
                          }}
                          className="form-control form-control-lg"
                          required
                          // pattern="[a-zA-Z ]*"
                          // title="Only letters and spaces are allowed"
                        />
                      </div>

                      <div className="col-md-6 mb-4">
                        {" "}
                        {/* Add margin bottom for spacing */}
                        <label
                          htmlFor="budgetCostCenter"
                          className="form-label fs-6"
                        >
                          Budget Cost Center
                        </label>
                        <input
                          type="text"
                          id="budgetCostCenter"
                          name="budgetCostCenter"
                          disabled
                          value={eventData.budgetCostCenter || ""} // Adjusted to match state structure
                          onChange={(e) => {
                            const value = e.target.value;
                            seteventData({
                              ...eventData,
                              budgetCostCenter: value,
                            });
                          }}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                      <div>
                        {" "}
                        {/* Add margin bottom for spacing */}
                        <label
                          htmlFor="budgetlineName"
                          className="form-label fs-6"
                        >
                          Budget Line name
                        </label>
                        <input
                          type="text"
                          id="budgetlineName"
                          name="budgetlineName"
                          disabled
                          value={eventData.budgetlineName || ""} // Adjusted to match state structure
                          onChange={(e) => {
                            const value = e.target.value;
                            seteventData({
                              ...eventData,
                              budgetlineName: value,
                            });
                          }}
                          className="form-control form-control-lg"
                          // pattern="[a-zA-Z ]*"
                          required
                          title="Only letters and spaces are allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {status == "Pending" ? (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <button
                          type="submit"
                          className="btn btn-success-approve btn-lg col-12 mt-4"
                          style={{ backgroundColor: "green", color: "white" }}
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
                ) : status == "Acknowledgement" ? null : (
                  <>
                    <div>
                      <label
                        // type="submit"
                        // disabled
                        className="btn btn-danger btn-lg col-12 mt-4"
                        style={{ backgroundColor: "#57636f" }}
                        disabled={isLoading}
                        // onClick={() => handleApproval(0)}
                      >
                        Already {status}
                      </label>
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

export default EventDetailsEAF;
