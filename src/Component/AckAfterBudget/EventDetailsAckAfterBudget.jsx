import React, { useState, useEffect, useCallback, useRef } from "react";
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
import EventBuildingVenueListGetinfo from "../shared_components/EventBuildingVenueListGetinfo";
import EventInfo from "../shared_components/EventPassportInfo";
import EventSelections from "../shared_components/EventSelections";
import EventFilesSection from "../shared_components/EventFilesSection";
import EventBuildingVenueListInfo from "../shared_components/eventBuildingVenueListInfo";
import Select from "react-select";
import {
  UpdateEventRequest,
  UpdateFiles,
  ConfrimEventRequest,
  UpdateEventApproval,
  UpdateEventAcknowledge,
} from "../Requests/mutators";
import GetEventFilesSection from "../shared_components/GetEventFilesSection";
import EventBuildingVenueListGET from "../shared_components/EventBuildingVenueListGET";
import EventFilesSectionGET from "../shared_components/EventFilesSectionGET";
import GetEventPassportInfo from "../shared_components/GetEventPassportInfo";
import GETEventSelections from "../shared_components/GETEventSelections";
const EventDetailsAckAfterBudget = () => {
  const history = useHistory();
  const [roomTypes, setRoomTypes] = useState([]);
  const [transportationTypes, setTransportationTypes] = useState([]);
  const [itComponentsList, setItComponentsList] = useState([]);
  const [isLoading, setisLoading] = React.useState(true);
  const [errors, setErrors] = useState({});
  const [natureofevents, setnatureofEvents] = useState([]);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const [passportFiles, setPassportFiles] = useState([[]]);
  const [openrejectnotes, setOpenRejectNotes] = useState(false);
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
          newErrors[name] = "Start date is disabled.";
        } else {
          delete newErrors[name];
        }
        break;

      case "EventEndDate":
        if (!value) {
          newErrors[name] = "End date is disabled.";
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
    agendaFile: null,
    presidentFile: null,
    universityFile: null,
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
    rejectionReason: "",
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
  // const handleApproval = useCallback(
  //   async (statusId) => {
  //     try {
  //       setisLoading(true);
  //       // Create a new object with the updated status
  //       const payload = {
  //         status: statusId,
  //         userTypeId: 1,
  //         eventId: requestId,
  //         rejectionReason: eventData.rejectionReason,
  //       };
  //       // Wait for the backend response
  //       console.log("payload", payload);
  //       await UpdateEventApproval(payload);
  //       setisLoading(false);
  //       // if (statusId == 1) {
  //       //   toast.success("Request Approved successfully", {
  //       //     position: "top-center",
  //       //   });
  //       // } else {
  //       //   toast.error("Request Rejected!", {
  //       //     position: "top-center",
  //       //   });
  //       // }
  //       // // Ensure UI navigation only happens after the toast is shown
  //       // setTimeout(() => {
  //       //   history.push("/hod-event-approvals");
  //       // }, 1000); // Give users time to see the message
  //     } catch (error) {
  //       setisLoading(false);
  //       console.error("Error while updating user details:", error);
  //       toast.error("Error while updating user details, please try again", {
  //         position: "top-center",
  //       });
  //     }
  //   },
  //   [setisLoading]
  // );
  const handleApproval = useCallback(
    async (statusId) => {
      try {
        setisLoading(true);
        // Create a new object with the updated status
        const payload = {
          status: statusId,
          userTypeId: 10,
          eventId: requestId,
          rejectionReason: eventData.rejectionReason, // This will now have the latest value
        };
        // Debugging log
        console.log("Updated payload:", payload);
        await UpdateEventAcknowledge(payload);
        setisLoading(false);
        // if (statusId == 1) {
        //   toast.success("Request Approved successfully", {
        //     position: "top-center",
        //   });
        // } else {
        //   toast.error("Request Rejected!", {
        //     position: "top-center",
        //   });
        // }
        // Ensure UI navigation only happens after the toast is shown
        setTimeout(() => {
          history.push("/event-approval-list-ack");
        }, 1000); // Give users time to see the message
      } catch (error) {
        setisLoading(false);
        console.error("Error while updating user details:", error);
        toast.error("Error while updating user details, please try again", {
          position: "top-center",
        });
      }
    },
    [eventData, requestId] // Add eventData as a dependency
  );

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
          : data.approvalLevelName == "BudgetOffice"
          ? "Budget Office"
          : data.approvalLevelName == "OfficeOfThePresident"
          ? "Office of the President"
          : data.approvalLevelName == "public Affairs"
          ? "Public Affairs"
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
        // if (eventData.confirmedAt != null) {
        // }
        await Promise.all([
          GetEventApprovalsTracker(requestId),
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
  const [employeeSelected, setemployeeSelected] = useState(true);
  const [ITChoice, setITChoice] = useState(false);
  const [TransportChoice, setTransportChoice] = useState(false);
  const [AccommodationChoice, setAccommodationChoice] = useState(false);
  const eventInfoRef = useRef(null);
  const venueSectionRef = useRef(null);
  const ServiceSectionRef = useRef(null);
  return (
    <div>
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
                  Event Info
                </h5>
              </div>
              <div>
                <div>
                  <GetEventPassportInfo
                    eventData={eventData}
                    seteventData={seteventData}
                    employeeSelected={employeeSelected}
                    setemployeeSelected={setemployeeSelected}
                  />
                </div>
                <div className="horizontal-rule mb-4">
                  <hr className="border-secondary" />
                  <h5 className="horizontal-rule-text fs-5 text-dark">
                    Venues
                  </h5>
                </div>
              </div>
              <div className="justify-content-center">
                {eventData?.buildingVenues?.map((_, index) => (
                  <EventBuildingVenueListGET
                    key={index}
                    index={index}
                    eventData={eventData}
                    seteventData={seteventData}
                  />
                ))}
              </div>
              <div>
                <div className="horizontal-rule mb-4">
                  <hr className="border-secondary" />
                  <h5 className="horizontal-rule-text fs-6  text-dark">
                    Services
                  </h5>
                </div>
                <GETEventSelections
                  eventData={eventData}
                  seteventData={seteventData}
                  setITChoice={setITChoice}
                  setTransportChoice={setTransportChoice}
                  setAccommodationChoice={setAccommodationChoice}
                />
                <br />
                <br />
              </div>
              <div className="horizontal-rule mb-4">
                <hr className="border-secondary" />
                <h5 className="horizontal-rule-text fs-5 text-dark">
                  Attendance
                </h5>
              </div>

              <EventFilesSectionGET
                eventData={eventData}
                setEventData={seteventData}
                handleFileChange={handleFileChange}
              />
              {eventData.budgetCode != null ? (
                <>
                  <div className="horizontal-rule mb-4">
                    <hr />
                    <h5 className="horizontal-rule-text fs-5">Budget Office</h5>
                  </div>
                  <div className="mb-4">
                    <div className="mb-4">
                      <div className="row">
                        <div className="col-md-4 mb-4">
                          <input
                            type="text"
                            placeholder="Enter budget code"
                            id="budgetCode"
                            name="budgetCode"
                            value={eventData.budgetCode || ""} // Adjusted to match state structure
                            onChange={(e) => {
                              const value = e.target.value;
                              seteventData({
                                ...eventData,
                                budgetCode: value,
                              });
                            }}
                            className="form-control form-control-lg"
                            style={{ fontSize: "0.7rem" }}
                            disabled
                          />
                        </div>
                        <div className="col-md-4 mb-4">
                          <input
                            placeholder="Enter budget cost center"
                            type="text"
                            id="budgetCostCenter"
                            name="budgetCostCenter"
                            value={eventData.budgetCostCenter || ""} // Adjusted to match state structure
                            onChange={(e) => {
                              const value = e.target.value;
                              seteventData({
                                ...eventData,
                                budgetCostCenter: value,
                              });
                            }}
                            className="form-control form-control-lg"
                            style={{ fontSize: "0.7rem" }}
                            disabled
                          />
                        </div>
                        <div className="col-md-4 mb-4">
                          <input
                            type="text"
                            placeholder="Enter budget line name"
                            id="budgetlineName"
                            name="budgetlineName"
                            value={eventData.budgetlineName || ""} // Adjusted to match state structure
                            onChange={(e) => {
                              const value = e.target.value;
                              seteventData({
                                ...eventData,
                                budgetlineName: value,
                              });
                            }}
                            className="form-control form-control-lg"
                            style={{ fontSize: "0.7rem" }}
                            disabled
                            title="Only letters and spaces are allowed"
                            // pattern="[a-zA-Z ]*"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 mb-4">
                          <textarea
                            type="text"
                            placeholder="Enter notes if needed"
                            id="notes"
                            name="notes"
                            value={eventData.notes || ""} // Adjusted to match state structure
                            onChange={(e) => {
                              const value = e.target.value;
                              seteventData({
                                ...eventData,
                                notes: value,
                              });
                            }}
                            className="form-control form-control-lg"
                            style={{ fontSize: "0.7rem" }}
                            disabled
                            rows={2}
                            title="Only letters and spaces are allowed"
                            // pattern="[a-zA-Z ]*"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              <div
                className="horizontal-rule"
                style={{ marginBottom: "0.25rem", marginTop: "2.0rem" }}
              >
                <hr />
                <h5
                  className="horizontal-rule-text"
                  style={{ marginBottom: "0" }}
                >
                  Approvals Hierarchy
                </h5>
              </div>
              <div className="row" style={{ marginTop: "0", paddingTop: "0" }}>
                <Table responsive style={{ marginTop: "0" }}>
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
              <div className="horizontal-rule mb-4">
                <hr />
                <h5 className="horizontal-rule-text fs-5">Acknowledge</h5>
              </div>
              {status == "Pending" ? (
                <>
                  <div className="row">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <button
                        type="submit"
                        className="btn btn-success-approve btn-sm"
                        style={{
                          transition: "0.3s ease",
                          backgroundColor: "#57636f",
                          color: "white",
                          padding: "4px 8px",
                          fontSize: "0.7rem",
                          minWidth: "110px",
                          height: "28px",
                        }}
                        onClick={() => handleApproval(1)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Acknowledge" : "Acknowledge"}
                      </button>
                      {/* <button
                        type="submit"
                        className="btn btn-danger btn-sm"
                        style={{
                          transition: "0.3s ease",
                          backgroundColor: "darkred",
                          color: "white",
                          padding: "4px 8px",
                          fontSize: "0.7rem",
                          minWidth: "110px",
                          height: "28px",
                        }}
                        disabled={isLoading}
                        onClick={() => setOpenRejectNotes(true)}
                      >
                        Reject
                      </button> */}
                    </div>

                    {/* Dialog Box Overlay */}
                    {openrejectnotes && (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: 1050,
                        }}
                      >
                        {/* Dialog Box */}
                        <div
                          style={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            padding: "20px",
                            width: "90%",
                            maxWidth: "500px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {/* Dialog Header */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "15px",
                              borderBottom: "1px solid #dee2e6",
                              paddingBottom: "10px",
                            }}
                          >
                            <h5
                              style={{
                                margin: 0,
                                fontSize: "0.7rem",
                                fontWeight: "bold",
                                color: "#333",
                              }}
                            >
                              Reject Request
                            </h5>
                            <button
                              type="button"
                              style={{
                                background: "none",
                                border: "none",
                                fontSize: "0.7rem",
                                cursor: "pointer",
                                color: "#999",
                              }}
                              onClick={() => setOpenRejectNotes(false)}
                            >
                              ×
                            </button>
                          </div>

                          {/* Dialog Body */}
                          <div style={{ marginBottom: "20px" }}>
                            {/* <label
                              htmlFor="rejectionReason"
                              style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "0.7rem",
                                fontWeight: "500",
                                color: "#333",
                              }}
                            >
                              Reject Notes
                            </label> */}
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
                              style={{
                                width: "100%",
                                padding: "8px",
                                border: "1px solid #ced4da",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                resize: "vertical",
                                // minHeight: "100px",
                              }}
                              required
                              rows="3"
                              placeholder="Enter the reject comments"
                            />
                          </div>

                          {/* Dialog Footer */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: "10px",
                            }}
                          >
                            <button
                              type="button"
                              style={{
                                padding: "6px 12px",
                                fontSize: "0.7rem",
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "0.3s ease",
                              }}
                              onClick={() => setOpenRejectNotes(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              style={{
                                padding: "6px 12px",
                                fontSize: "0.7rem",
                                backgroundColor: "darkred",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "0.3s ease",
                              }}
                              disabled={isLoading}
                              onClick={() => {
                                handleApproval(0);
                                setOpenRejectNotes(false);
                              }}
                            >
                              {isLoading ? "Save" : "Save"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    {status == "Rejected" ? (
                      <>
                        <div className="mb-2 mt-2 flex-grow-1">
                          <label
                            htmlFor="rejectionReason"
                            className="form-label"
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: "500",
                              color: "#333",
                            }}
                          >
                            Reject Notes
                          </label>
                          <textarea
                            id="rejectionReason"
                            name="rejectionReason"
                            value={eventData.rejectionReason}
                            disabled
                            onChange={(e) => {
                              const value = e.target.value;
                              seteventData({
                                ...eventData,
                                rejectionReason: value,
                              });
                            }}
                            className="form-control"
                            required
                            rows="3"
                            placeholder="Enter the reject comments"
                            style={{
                              fontSize: "0.7rem",
                              textAlign: "justify",
                              lineHeight: "1.4",
                              padding: "8px",
                              maxWidth: "85%",
                              margin: "0 auto",
                              display: "block",
                            }}
                          />
                          <button
                            className="btn btn-lg w-50 mt-3"
                            disabled
                            style={{
                              transition: "0.3s ease",
                              // backgroundColor: "lightgrey",
                              // color: "black",
                              padding: "4px 8px",
                              fontSize: "0.7rem",
                              minWidth: "110px",
                              height: "28px",
                            }}
                          >
                            Acknowledged
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          // className="btn btn-danger btn-sm"
                          className="btn btn-lg w-50 mt-3"
                          disabled
                          style={{
                            transition: "0.3s ease",
                            // backgroundColor: "lightgrey",
                            // color: "black",
                            padding: "4px 8px",
                            fontSize: "0.7rem",
                            minWidth: "110px",
                            height: "28px",
                          }}
                        >
                          Acknowledged
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
              {/* </ValidatorForm> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsAckAfterBudget;
