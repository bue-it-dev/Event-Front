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
import EventInfo from "../shared_components/EventPassportInfo";
import EventSelections from "../shared_components/EventSelections";
import EventFilesSection from "../shared_components/EventFilesSection";
import EventBuildingVenueListInfo from "../shared_components/eventBuildingVenueListInfo";
import EventBuildingVenueListUpdate from "../shared_components/EventBuildingVenueListUpdate";
import Select from "react-select";
import {
  UpdateEventRequest,
  UpdateFiles,
  ConfrimEventRequest,
} from "../Requests/mutators";
import UpdateEventFilesSection from "../shared_components/UpdateEventFilesSection";
const HomeRequestDetails = () => {
  const history = useHistory();
  const [roomTypes, setRoomTypes] = useState([]);
  const [transportationTypes, setTransportationTypes] = useState([]);
  const [itComponentsList, setItComponentsList] = useState([]);
  const [isLoading, setisLoading] = React.useState(true);
  const [errors, setErrors] = useState({});
  const [natureofevents, setnatureofEvents] = useState([]);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const [passportFiles, setPassportFiles] = useState([[]]);
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
    // let saverequeststatus = JSON.stringify(location.state.statusname);
    localStorage.setItem("requestId", saverequestId);
    // localStorage.setItem("status", saverequeststatus);
  }
  let requestId = JSON.parse(localStorage.getItem("requestId"));
  // let status = JSON.parse(localStorage.getItem("status"));
  const [eventData, seteventData] = React.useState({
    eventId: 0,
    approvingDepTypeId: 0,
    eventTitle: "",
    nomParticipants: 0,
    eventStartDate: null,
    natureOfEventId: 0,
    eventEndDate: null,
    agendaFile: null,
    presidentFile: null,
    universityFile: null,
    rejectionReason: null,
    hasIt: 0,
    hasAccomdation: 0,
    hasTransportation: 0,
    endDateTime: null,
    startDateTime: null,
    organizerName: "",
    organizerMobile: "",
    organizerEmail: "",
    organizerPosition: "",
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
  const [empsettings, setEmpsettings] = React.useState([]);
  const employeeEmailAndPositionByEmpId = (empId) => {
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/EventEntity/get-employeeEmailAndPositionByEmpId?empId=${empId}`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    axios(config)
      .then(function (response) {
        setEmpsettings(response.data.data);
        console.log("Settings", response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // const handleOrgChange = (selectedOption) => {
  //   console.log("selected Option", selectedOption.label);
  //   const fullLabel = selectedOption.label;
  //   const empId = selectedOption ? selectedOption.value : "";
  //   const firstPart = fullLabel.split("(")[0].trim(); // Extract only the first part before '('
  //   console.log("Emp Id", empId);
  //   employeeEmailAndPositionByEmpId(empId);
  //   // const firstPart = fullLabel.split("(")[0].trim(); // Extract only the first part before '('

  //   seteventData((prevState) => ({
  //     ...prevState,
  //     organizerName: String(fullLabel), // Ensure it's a string
  //   }));
  // };
  const handleOrgChange = async (selectedOption) => {
    const fullLabel = selectedOption ? selectedOption.label : "";
    const empId = selectedOption ? selectedOption.value : "";
    employeeEmailAndPositionByEmpId(empId);
    console.log("Emp Id", empId);
    try {
      // Wait for employee details to be fetched
      const config = {
        method: "get",
        url: `${URL.BASE_URL}/api/EventEntity/get-employeeEmailAndPositionByEmpId?empId=${empId}`,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios(config);
      const employeeData = response.data.data;

      console.log("Fetched settings:", employeeData);

      // Now, safely update eventData with fetched employee details
      seteventData((prevState) => ({
        ...prevState,
        organizerName: fullLabel,
        organizerEmail: employeeData.email || "", // Ensure a fallback value
        organizerPosition: employeeData.position || "", // Ensure a fallback value
      }));
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };
  const [employeelist, setEmployeeList] = React.useState([]);
  // Get List of Approval Department Schema
  const GetEmployeeList = () => {
    var config = {
      method: "get",
      url: `https://hcms.bue.edu.eg/TravelBE/api/BusinessRequest/get-all-employees-names`,
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

      // Extract file-related fields separately
      const {
        ledOfTheUniversityOrganizerFilePath,
        officeOfPresedentFilePath,
        visitAgendaFilePath,
        passports,
        ...filteredEventDetails
      } = eventDetails;

      // ✅ Ensure `passports` contains valid file data
      const processedPassports =
        passports?.map((passport, index) => {
          if (passport.fileUrl) {
            return new File(
              [passport.fileData],
              passport.fileName || `passport_${index}.pdf`,
              {
                type: passport.fileType || "application/pdf",
              }
            );
          }
          return passport; // Keep the existing structure if no file conversion needed
        }) ?? [];

      // ✅ Update eventData state
      seteventData((prevState) => ({
        ...prevState,
        ...filteredEventDetails,
        passports: processedPassports,
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
        // Handle file paths properly
        ledOfTheUniversityOrganizerFilePath,
        officeOfPresedentFilePath,
        visitAgendaFilePath,
      }));

      console.log("✅ Updated Event Data:", eventData);
    } catch (error) {
      console.error("❌ Error fetching event Details:", error);
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
  // const [approvalTracker, setApprovalTracker] = useState([]);
  const GetEventApprovalsTracker = async (requestId) => {
    try {
      const response = await axios.post(
        `${URL.BASE_URL}/api/EventEntity/GetEventApprovalsbyRequestID`,
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
  const addBuildingVenue = () => {
    seteventData((prevData) => ({
      ...prevData,
      travellerList: prevData.travellerList + 1,
      buildingVenues: [
        ...prevData.buildingVenues,
        {
          eventId: prevData.eventId, // Initialize empty
          venueId: prevData.venueId, // Initialize empty
          buildingId: prevData.buildingId, // Initialize empty
        },
      ],
    }));
  };
  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);
    const newPassportFiles = [...passportFiles];
    newPassportFiles[index] = files;
    setPassportFiles(newPassportFiles);
  };
  // const onSubmit = async () => {
  //   try {
  //     setisLoading(true);
  //     await UpdateEventRequest(requestId, eventData);
  //     if (requestId) {
  //       await UpdateFiles(
  //         requestId,
  //         eventData.passports || [],
  //         eventData.presidentFile,
  //         eventData.universityFile,
  //         eventData.agendaFile
  //       );
  //     }
  //     setisLoading(false);
  //     toast.success("Form Updated!", { position: "top-center" });
  //     window.location.reload();
  //   } catch (err) {
  //     setisLoading(false);
  //     toast.error("An error occurred. Please try again later.", {
  //       position: "top-center",
  //     });
  //   }
  // };
  const getOriginalFileName = (fileName) => {
    const parts = fileName.split("_");
    return parts.length > 1 ? parts.slice(-1)[0] : fileName; // Get only the last part after all UUIDs
  };
  const onSubmit = async () => {
    try {
      setisLoading(true);

      await UpdateEventRequest(requestId, eventData);

      if (requestId) {
        // Convert backend response to actual File objects
        const presidentFile = createFileObject(eventData.presidentFile);
        const universityFile = createFileObject(eventData.universityFile);
        const agendaFile = createFileObject(eventData.agendaFile);

        await UpdateFiles(
          requestId,
          eventData.passports || [],
          presidentFile || eventData.presidentFile,
          universityFile || eventData.universityFile,
          agendaFile || eventData.agendaFile
        );
      }

      setisLoading(false);
      toast.success("Form Updated!", { position: "top-center" });
      window.location.reload();
    } catch (err) {
      setisLoading(false);
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
      });
    }
  };

  // Helper function to create a File object
  const createFileObject = (fileData) => {
    if (!fileData || !fileData.fileName || !fileData.contentType) return null;

    return new File(
      [new Blob([], { type: fileData.contentType })], // Empty Blob (since we don't have the actual binary data)
      fileData.fileName,
      { type: fileData.contentType }
    );
  };

  const ConfrimBusinessRequestAsync = async (requestId) => {
    const confirmAction = () =>
      new Promise((resolve) => {
        // const toastId = toast.info(
        //   <>
        //     <div style={{ textAlign: "center" }}>
        //       <p>Are you sure you want to confirm this request?</p>
        //       <div style={{ marginTop: "10px" }}>
        //         <button
        //           onClick={() => {
        //             toast.dismiss(toastId); // Dismiss the toast
        //             resolve(true); // Proceed with confirmation
        //           }}
        //           style={{
        //             marginRight: "10px",
        //             backgroundColor: "green",
        //             color: "white",
        //             border: "none",
        //             padding: "5px 10px",
        //             cursor: "pointer",
        //           }}
        //         >
        //           Confirm
        //         </button>
        //         <button
        //           onClick={() => {
        //             toast.dismiss(toastId); // Dismiss the toast
        //             resolve(false); // Cancel the operation
        //           }}
        //           style={{
        //             backgroundColor: "#dc3545",
        //             color: "white",
        //             border: "none",
        //             padding: "5px 10px",
        //             cursor: "pointer",
        //           }}
        //         >
        //           Cancel
        //         </button>
        //       </div>
        //     </div>
        //   </>,
        //   {
        //     autoClose: false,
        //     closeOnClick: false,
        //     draggable: false,
        //     position: "top-center", // Center the toast
        //   }
        // );
      });

    // const userConfirmed = await confirmAction();
    const userConfirmed = true;
    if (userConfirmed) {
      try {
        setisLoading(true);
        await ConfrimEventRequest(requestId);
        setisLoading(false);
        history.push("/my-event-requests");
      } catch (err) {
        setisLoading(false);
        toast.error("An error occurred. Please try again later.", {
          position: "top-center",
        });
      }
    }
  };
  const data = {
    columns: [
      // { label: "#", field: "Number", sort: "asc" },
      { label: "Name", field: "userName", sort: "asc" },
      { label: "Role", field: "approvalLevelName", sort: "asc" },
      { label: "Status", field: "statusName", sort: "asc" },
      { label: "Date", field: "createdAt", sort: "asc" },
    ],
    rows: approvalTracker.map((data, i) => ({
      Number: i + 1,
      approvalLevelName:
        data.approvalLevelName == "BOM"
          ? "BO Manager"
          : data.approvalLevelName == "EAF"
          ? "Estates and Facilities"
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
  // useEffect(() => {
  //   if (updatehometravelData.confrimedat != null) {
  //     await GetEventApprovalsTracker(requestId);
  //   }
  //   setisLoading(false);
  //   GetEventDetails(requestId);
  //   GetApprovalDepartmentSchema();
  //   GetNatureofEvents();
  //   getRoomTypes();
  //   getTransportationTypes();
  //   getItComponents();
  //   console.log("Event Data", eventData);
  // }, [requestId]);
  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true); // Start loading at the beginning

      try {
        if (eventData.confirmedAt != null) {
          await GetEventApprovalsTracker(requestId);
        }
        await Promise.all([
          GetEventDetails(requestId),
          GetEmployeeList(),
          GetApprovalDepartmentSchema(),
          GetNatureofEvents(),
          getRoomTypes(),
          getTransportationTypes(),
          getItComponents(),
          console.log("Name", eventData.organizerName),
          console.log(
            "Emp Label list:",
            employeelist.find(
              (e) => e.label.includes("Omar Mohamed Sherif Al Kotb Mohamed") // Checks if label contains the name
            ).label
          ),
        ]);
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setisLoading(false); // Stop loading after all calls complete
      }
    };

    fetchData();
  }, [requestId, eventData.confirmedAt]);

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
                >
                  <option value="">Choose your department</option>
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
              <div className="card shadow-sm px-5 py-4 w-150 mx-auto">
                <div className="row g-4">
                  {/* Event Title */}
                  <div className="col-lg-6">
                    <label
                      htmlFor="eventTitle"
                      className="form-label font-weight-bold"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="eventTitle"
                      name="eventTitle"
                      value={eventData.eventTitle}
                      onChange={handleChange}
                      className="form-control form-control-lg w-100"
                      required
                    />
                    {errors.eventTitle && (
                      <small className="text-danger">{errors.eventTitle}</small>
                    )}
                  </div>
                  {/* Number of Participants */}
                  <div className="col-lg-6">
                    <label
                      htmlFor="nomParticipants"
                      className="form-label font-weight-bold"
                    >
                      Number of Participants
                    </label>
                    <input
                      type="number"
                      id="nomParticipants"
                      name="nomParticipants"
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
                      htmlFor="eventStartDate"
                      className="form-label font-weight-bold"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="eventStartDate"
                      name="eventStartDate"
                      value={
                        eventData.eventStartDate?.split("T")[0] || "" || ""
                      }
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
                      End Date
                    </label>
                    <input
                      type="date"
                      id="eventEndDate"
                      name="eventEndDate"
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
                  {/* Organizer Email */}
                  <div className="col-lg-6">
                    <label
                      htmlFor="natureOfEventId"
                      className="form-label font-weight-bold"
                    >
                      Nature
                    </label>
                    <select
                      className="form-select form-select-lg"
                      value={eventData.natureOfEventId}
                      onChange={(e) => {
                        seteventData({
                          ...eventData,
                          natureOfEventId: Number(e.target.value),
                        });
                      }}
                      name="natureOfEventId"
                      required
                    >
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
                  {/* Organizer Email */}
                  <div className="col-lg-6">
                    <label
                      htmlFor="eventType"
                      className="form-label font-weight-bold"
                    >
                      Type
                    </label>
                    <select
                      className="form-select form-select-lg"
                      value={eventData.eventType}
                      onChange={(e) => {
                        seteventData({
                          ...eventData,
                          eventType: e.target.value,
                        });
                      }}
                      name="eventType"
                      required
                    >
                      <option value="Internal">Internal</option>
                      <option value="External">External</option>
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label
                      htmlFor="budgetEstimatedCost"
                      className="form-label font-weight-bold"
                    >
                      Estimated Cost
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={eventData.budgetEstimatedCost}
                      required
                      onChange={(e) => {
                        seteventData({
                          ...eventData,
                          budgetEstimatedCost: Number(e.target.value),
                        });
                      }}
                    />
                  </div>
                  {/* Organizer Email */}
                  <div className="col-lg-6">
                    <label
                      htmlFor="budgetCostCurrency"
                      className="form-label font-weight-bold"
                    >
                      Cost Currency
                    </label>
                    <select
                      className="form-select form-select-lg"
                      value={eventData.budgetCostCurrency}
                      onChange={(e) => {
                        seteventData({
                          ...eventData,
                          budgetCostCurrency: e.target.value,
                        });
                      }}
                      name="budgetCostCurrency"
                      required
                    >
                      <option value="EGP">EGP</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <br />

                  <div className="horizontal-rule mb-4">
                    <hr className="border-secondary" />
                    <h5 className="horizontal-rule-text fs-5 text-dark">
                      Organizer Info
                    </h5>
                  </div>
                  {eventData.eventType == "Internal" ? (
                    <>
                      {/* Organizer Name */}
                      <div className="col-lg-6">
                        <label
                          htmlFor="organizerName"
                          className="form-label font-weight-bold"
                        >
                          Organizer Name
                        </label>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isClearable
                          isSearchable
                          options={[
                            ...employeelist,
                            { value: -1, label: "Others" },
                          ]}
                          onChange={handleOrgChange}
                          // value={eventData.organizerName}
                          value={
                            // Find the selected option in the combined list
                            [
                              ...employeelist,
                              { value: -1, label: "Others" },
                            ].find(
                              (option) =>
                                option.label === eventData.organizerName
                            ) || null
                          }
                          required
                          placeholder="Choose organizer name"
                          styles={{
                            option: (provided) => ({
                              ...provided,
                              textAlign: "left",
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              textAlign: "left",
                            }),
                          }}
                        />
                      </div>
                      {/* Organizer Email */}
                      <div className="col-lg-6">
                        <label
                          htmlFor="organizerEmail"
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
                            id="organizerEmail"
                            name="organizerEmail"
                            disabled
                            value={
                              empsettings.email || eventData.organizerEmail
                            }
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
                          value={
                            empsettings.position || eventData.organizerPosition
                          }
                          onChange={handleChange}
                          className="form-control form-control-lg w-100"
                        />
                        {errors.organizerPosition && (
                          <small className="text-danger">
                            {errors.organizerPosition}
                          </small>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Organizer Name */}
                      <div className="col-lg-6">
                        <label
                          htmlFor="organizerName"
                          className="form-label font-weight-bold"
                        >
                          Organizer Name
                        </label>
                        {}
                        <input
                          type="text"
                          id="organizerName"
                          name="organizerName"
                          value={eventData.organizerName || ""}
                          onChange={handleChange}
                          className="form-control form-control-lg w-100"
                        />
                      </div>
                      {/* Organizer Email */}
                      <div className="col-lg-6">
                        <label
                          htmlFor="organizerEmail"
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
                            id="organizerEmail"
                            name="organizerEmail"
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
                    </>
                  )}
                  {/* Organizer Mobile */}
                  <div className="col-lg-6">
                    <label
                      htmlFor="organizerMobile"
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
                </div>
              </div>
              {/* <EventInfo eventData={eventData} seteventData={seteventData} /> */}
              <div className="horizontal-rule mb-4">
                <hr className="border-secondary" />
                <h5 className="horizontal-rule-text fs-5 text-dark">Venues</h5>
              </div>
              {eventData.confirmedAt == null ? (
                <div className="d-flex align-items-center mb-3">
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
                      backgroundColor: "#57636f",
                    }}
                    onClick={addBuildingVenue}
                  >
                    +
                  </button>
                  <p className="text-dark mb-0 fs-6">Add Venue(s)</p>
                </div>
              ) : null}

              {eventData?.buildingVenues?.map((_, index) => (
                <EventBuildingVenueListUpdate
                  key={index}
                  index={index}
                  eventData={eventData}
                  seteventData={seteventData}
                />
              ))}
              <div className="horizontal-rule mb-4">
                <hr className="border-secondary" />
                <h5 className="horizontal-rule-text fs-6  text-dark">
                  Services
                </h5>
              </div>

              <ValidatorForm>
                <div className="container-fluid">
                  <div
                    // className="card shadow-lg px-5 py-4 w-100 mx-auto"
                    className="card shadow-lg px-4 py-2 modern-card w-100 mx-auto"
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
                          checked={eventData.hasAccomdation === 1}
                          onChange={handleAccommodationCheckbox}
                        />
                        <label
                          className="form-check-label font-weight-bold text-dark"
                          htmlFor="hasAccomdation"
                          style={{ fontSize: "14px" }}
                        >
                          Accommodation (Optional)
                        </label>
                      </div>

                      {eventData.hasAccomdation === 1 && (
                        <div className="mt-3">
                          {/* Room Type Selection */}
                          <div className="row g-2">
                            {roomTypes.map((type) => (
                              <div
                                key={type.roomTypeId}
                                className="col-12 col-md-4"
                              >
                                <div className="form-check d-flex align-items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`Rooms-${type.roomTypeId}`}
                                    value={type.roomTypeId}
                                    checked={eventData?.accommodations?.some(
                                      (t) => t.roomTypeId === type.roomTypeId
                                    )}
                                    onChange={handleAccommodatitonTypeCheckbox}
                                  />
                                  <label
                                    className="form-check-label text-dark fw-semibold text-truncate"
                                    htmlFor={`Rooms-${type.roomTypeId}`}
                                    style={{
                                      fontSize: "14px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {type.roomTypeName}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Accommodation Details (All Inputs on the Same Row) */}
                          {eventData.accommodations.map((accom, index) => (
                            <div
                              key={index}
                              className="row g-2 mt-3 d-flex align-items-center"
                            >
                              <div className="col-3">
                                <label
                                  className="form-label fw-semibold text-dark text-truncate"
                                  style={{
                                    fontSize: "14px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {
                                    roomTypes.find(
                                      (room) =>
                                        room.roomTypeId === accom.roomTypeId
                                    )?.roomTypeName
                                  }
                                </label>
                              </div>
                              <div className="col-3">
                                <input
                                  type="date"
                                  className="form-control form-control-sm rounded shadow-sm"
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
                              <div className="col-3">
                                <input
                                  type="date"
                                  className="form-control form-control-sm rounded shadow-sm"
                                  value={accom.endDate?.split("T")[0] || ""}
                                  onChange={(e) =>
                                    handleAcommodationChange(
                                      index,
                                      "endDate",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="col-3">
                                <input
                                  type="number"
                                  className="form-control form-control-sm rounded shadow-sm"
                                  placeholder="No. of rooms"
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
                          Transportation (Optional)
                        </label>
                      </div>

                      {eventData.hasTransportation === 1 && (
                        <div className="mt-3">
                          {/* Transportation Type Selection */}
                          <div className="row g-2">
                            {transportationTypes.map((type) => (
                              <div
                                key={type.transportationTypeId}
                                className="col-12 col-md-4"
                              >
                                <div className="form-check d-flex align-items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`transportation-${type.transportationTypeId}`}
                                    value={type.transportationTypeId}
                                    checked={eventData?.transportations?.some(
                                      (t) =>
                                        t.transportationTypeId ===
                                        type.transportationTypeId
                                    )}
                                    onChange={handleTransportationTypeCheckbox}
                                  />
                                  <label
                                    className="form-check-label text-dark fw-semibold text-truncate"
                                    htmlFor={`transportation-${type.transportationTypeId}`}
                                    style={{
                                      fontSize: "14px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {type.transportationType1}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Transportation Details (All Inputs on the Same Row) */}
                          {eventData?.transportations?.map(
                            (transport, index) => (
                              <div
                                key={index}
                                className="row g-2 mt-3 d-flex align-items-center"
                              >
                                <div className="col-3">
                                  <label
                                    className="form-label fw-semibold text-dark text-truncate"
                                    style={{
                                      fontSize: "14px",
                                      whiteSpace: "nowrap",
                                    }}
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
                                <div className="col-3">
                                  <input
                                    type="date"
                                    className="form-control form-control-sm rounded shadow-sm"
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
                                <div className="col-3">
                                  <input
                                    type="date"
                                    className="form-control form-control-sm rounded shadow-sm"
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
                                <div className="col-3">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm rounded shadow-sm"
                                    placeholder="Number"
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
                          checked={eventData.hasIt === 1}
                          onChange={handleItComponentsCheckbox}
                        />
                        <label
                          className="form-check-label font-weight-bold text-dark"
                          htmlFor="hasIt"
                          style={{ fontSize: "14px" }}
                        >
                          IT Services (Optional)
                        </label>
                      </div>

                      {eventData.hasIt === 1 && (
                        <div className="mt-3">
                          <div className="row g-2">
                            {itComponentsList?.map((component) => (
                              <div
                                key={component.itcomponentId}
                                className="col-6 col-md-3"
                              >
                                <div className="form-check d-flex align-items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`itcomponent-${component.itcomponentId}`}
                                    value={component.itcomponentId}
                                    checked={eventData?.itcomponentEvents?.some(
                                      (item) =>
                                        item.itcomponentId ===
                                        component.itcomponentId
                                    )}
                                    onChange={handleItComponentCheckbox}
                                  />
                                  <label
                                    className="form-check-label text-dark fw-semibold text-truncate"
                                    htmlFor={`itcomponent-${component.itcomponentId}`}
                                    style={{
                                      fontSize: "14px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {component.component}
                                  </label>
                                </div>

                                {eventData?.itcomponentEvents?.some(
                                  (item) =>
                                    item.itcomponentId ===
                                    component.itcomponentId
                                ) && (
                                  <div className="mt-2 d-flex align-items-center gap-2">
                                    <input
                                      type="number"
                                      className="form-control form-control-sm w-80 rounded shadow-sm"
                                      style={{ maxWidth: "200px" }}
                                      placeholder="Number"
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
                                  </div>
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
                    Attendance
                  </h5>
                </div>

                <UpdateEventFilesSection
                  eventData={eventData}
                  setEventData={seteventData}
                  handleFileChange={handleFileChange}
                />
                <br />
                {eventData.confirmedAt == null ? (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <button
                          type="submit"
                          className="btn btn-dark btn-lg col-12 mt-3"
                          disabled={isLoading}
                          style={{
                            transition: "0.3s ease",
                            backgroundColor: "#57636f",
                            padding: "6px 10px",
                            fontSize: "14px",
                          }}
                          onClick={() => onSubmit()}
                        >
                          {isLoading ? "Saving Draft..." : "Save Draft"}
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          type="submit"
                          className="btn btn-dark btn-lg col-12 mt-3"
                          disabled={isLoading}
                          style={{
                            transition: "0.3s ease",
                            backgroundColor: "#57636f",
                            padding: "6px 10px",
                            fontSize: "14px",
                          }}
                          onClick={() => ConfrimBusinessRequestAsync(requestId)}
                        >
                          {isLoading
                            ? "Submitting Request..."
                            : "Submit Request"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="horizontal-rule mb-4">
                      <h5 className="horizontal-rule-text">
                        Approvals hierarchy
                      </h5>
                    </div>
                    <div className="row">
                      <Table responsive>
                        <MDBDataTable
                          // className="text-left"
                          className="custom-table"
                          autoWidth={true}
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
                    {eventData.rejectionReason != null ? (
                      <>
                        <div className="horizontal-rule mb-4">
                          <h5 className="horizontal-rule-text">
                            Rejection Comment
                          </h5>
                        </div>
                        <textarea
                          id="rejectionReason"
                          name="rejectionReason"
                          value={eventData.rejectionReason}
                          onChange={(e) => {
                            const value = e.target.value;
                            seteventData({
                              ...eventData,
                              rejectionReason: value,
                            });
                          }}
                          className="form-control form-control-lg"
                          disabled
                          rows="5" // Adjust rows to define how many lines of text are visible
                          placeholder="Enter the reject comments"
                        />
                      </>
                    ) : null}
                  </>
                )}
              </ValidatorForm>
            </div>
          </div>
        </div>
      </div>
      {/* Modern Styling */}
      <style jsx>{`
        .modern-card {
          border-radius: 10px;
          background: #f8f9fa;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
        }

        .section-card {
          border-radius: 6px;
          background: white;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
        }

        .passport-card {
          border-radius: 6px;
          background: #eef2f5;
          padding: 10px;
        }

        .btn {
          transition: all 0.2s ease-in-out;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .form-label {
          font-size: 14px;
        }

        .file-name {
          font-size: 12px;
          color: #333;
        }

        .form-check-label {
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default HomeRequestDetails;
