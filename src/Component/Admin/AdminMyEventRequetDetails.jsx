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
import UpdateEventPassportInfo from "../shared_components/UpdateEventPassportInfo";
import UpdateEventSelections from "../shared_components/UpdateEventSelections";
const AdminMyEventRequetDetails = () => {
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(true);
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
    hasBudget: 0,
    hasMarcom: 0,
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
    isInernationalGuest: 0,
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
    var data = "";
    var config = {
      method: "get",
      url: `https://hcms.bue.edu.eg/TravelBE/api/BusinessRequest/get-approval-departments-schema`,
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
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "",
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
  const createPassportFileObject = (fileData) => {
    if (!fileData) return null;

    // Handle plain string (filename)
    if (typeof fileData === "string") {
      const fileName = fileData;
      const extension = fileName.split(".").pop()?.toLowerCase();
      let contentType = "application/octet-stream";

      // Simple type inference
      if (["png", "jpg", "jpeg"].includes(extension)) {
        contentType = `image/${extension === "jpg" ? "jpeg" : extension}`;
      } else if (extension === "pdf") {
        contentType = "application/pdf";
      }

      return new File([new Blob([], { type: contentType })], fileName, {
        type: contentType,
      });
    }

    // Original object format
    const { fileName, contentType } = fileData;
    if (!fileName || !contentType) return null;

    return new File([new Blob([], { type: contentType })], fileName, {
      type: contentType,
    });
  };
  const convertPassportObject = (passportObj) => {
    const result = [];

    Object.values(passportObj).forEach((item) => {
      if (typeof item === "string") {
        // Convert filename to dummy File
        result.push(createPassportFileObject(item));
      } else if (Array.isArray(item) && item[0] instanceof File) {
        // Use the real File object
        result.push(item[0]);
      }
    });

    return result.filter(Boolean); // Clean up any nulls
  };

  const onSubmit = async () => {
    try {
      setisLoading(true);

      await UpdateEventRequest(requestId, eventData);

      if (requestId) {
        // Convert all related data to File objects
        const presidentFile = createFileObject(eventData.presidentFile);
        const universityFile = createFileObject(eventData.universityFile);
        const agendaFile = createFileObject(eventData.agendaFile);

        const convertedPassports = convertPassportObject(
          eventData.passports || {}
        );

        console.log("Event Data converted passports", convertedPassports);
        await UpdateFiles(
          requestId,
          convertedPassports,
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
        await UpdateEventRequest(requestId, eventData);

        if (requestId) {
          // Convert all related data to File objects
          const presidentFile = createFileObject(eventData.presidentFile);
          const universityFile = createFileObject(eventData.universityFile);
          const agendaFile = createFileObject(eventData.agendaFile);

          const convertedPassports = convertPassportObject(
            eventData.passports || {}
          );

          console.log("Event Data converted passports", convertedPassports);
          await UpdateFiles(
            requestId,
            convertedPassports,
            presidentFile || eventData.presidentFile,
            universityFile || eventData.universityFile,
            agendaFile || eventData.agendaFile
          );
        }
        await ConfrimEventRequest(requestId);
        setisLoading(false);
        history.push("/hod-my-events-request");
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
      createdAt: data.statusName == "Pending" ? "N/A" : data.createdAt,
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
  // IT Components toggle
  const handleBudgetComponentsCheckbox = (e) => {
    const isChecked = e.target.checked;
    seteventData((prevData) => ({
      ...prevData,
      hasBudget: isChecked ? 1 : 0,
      // ItComponents: isChecked ? [] : [],
    }));
  };

  // IT Components toggle
  const handleMarcomComponentsCheckbox = (e) => {
    const isChecked = e.target.checked;
    seteventData((prevData) => ({
      ...prevData,
      hasMarcom: isChecked ? 1 : 0,
      // ItComponents: isChecked ? [] : [],
    }));
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
  const [employeeSelected, setemployeeSelected] = useState(true);
  const [ITChoice, setITChoice] = useState(false);
  const [TransportChoice, setTransportChoice] = useState(false);
  const [AccommodationChoice, setAccommodationChoice] = useState(false);
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
  const [clickedButtonId, setClickedButtonId] = useState(null);
  const onClickeSubmit = () => {
    let isValidationValid = false;
    if (employeeSelected == true) {
      isValidationValid = true;
    } else {
      toast.error("Employee name is required.");
      return;
    }
    if (!eventData.buildingVenues || eventData.buildingVenues.length === 0) {
      toast.error("Select the event venue(s).");
      return;
    }
    if (eventData.hasIt == 1) {
      if (ITChoice == true || eventData.itcomponentEvents.length > 0) {
        isValidationValid = true;
      } else {
        toast.error("Please select at least one IT component.");
        return;
      }
    }
    if (eventData.hasTransportation == 1) {
      if (TransportChoice == true || eventData.transportations.length > 0) {
        isValidationValid = true;
      } else {
        toast.error("Please select at least one Transportation choice.");
        return;
      }
    }
    if (eventData.hasAccomdation == 1) {
      if (AccommodationChoice == true || eventData.accommodations.length > 0) {
        isValidationValid = true;
      } else {
        toast.error("Please select at least one Accommodation choice.");
        return;
      }
    }
    if (!eventData.isStaffStudents && !eventData.isOthers) {
      toast.error("Select an option from the attendance section");
      return;
    }

    if (eventData.isOthers == 1) {
      if (eventData.isVip == 0 && eventData.isInernationalGuest == 0) {
        toast.error(
          "Please select at least one option from the Others section"
        );
        return;
      }
    }

    handleSubmit(clickedButtonId);
  };
  const handleSubmit = (id) => {
    if (id == 1) {
      onSubmit();
    } else if (id == 2) {
      ConfrimBusinessRequestAsync(requestId);
    }
  };
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
              <ValidatorForm onSubmit={onClickeSubmit} className="px-md-2">
                <div className="horizontal-rule mb-4">
                  <hr className="border-secondary" />
                  <h5 className="horizontal-rule-text fs-5 text-dark">
                    Event Info
                  </h5>
                </div>
                <UpdateEventPassportInfo
                  eventData={eventData}
                  seteventData={seteventData}
                  employeeSelected={employeeSelected}
                  setemployeeSelected={setemployeeSelected}
                />
                <div className="horizontal-rule mb-4">
                  <hr className="border-secondary" />
                  <h5 className="horizontal-rule-text fs-5 text-dark">
                    Venues
                  </h5>
                </div>
                {eventData.confirmedAt == null ? (
                  <div className="d-flex align-items-center mb-3">
                    <button
                      type="button"
                      className="btn btn-dark btn-sm d-flex align-items-center justify-content-center"
                      style={{
                        width: "24px", // ~1.5rem
                        height: "24px",
                        fontSize: "0.7rem",
                        borderRadius: "50%",
                        marginRight: "10px",
                        transition: "0.3s ease",
                        backgroundColor: "#57636f",
                        padding: "0",
                      }}
                      onClick={addBuildingVenue}
                    >
                      +
                    </button>
                    <p
                      className="text-dark mb-0"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Add Venue(s)
                    </p>
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
                <UpdateEventSelections
                  eventData={eventData}
                  seteventData={seteventData}
                  setITChoice={setITChoice}
                  setTransportChoice={setTransportChoice}
                  setAccommodationChoice={setAccommodationChoice}
                />
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
                {eventData.budgetCode != null ? (
                  <>
                    <div className="horizontal-rule mb-4">
                      <hr />
                      <h5 className="horizontal-rule-text fs-5">
                        Budget Office
                      </h5>
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

                {eventData.confirmedAt == null ? (
                  <>
                    <div className="row justify-content-center mt-3">
                      <div
                        className="d-flex justify-content-center"
                        style={{ gap: "1rem", flexWrap: "wrap" }}
                      >
                        <button
                          type="submit"
                          className="btn btn-dark btn-lg"
                          style={{
                            transition: "0.3s ease",
                            backgroundColor: "#57636f",
                            padding: "6px 16px",
                            fontSize: "0.7rem",
                            whiteSpace: "nowrap",
                          }}
                          disabled={!isSubmitEnabled || isLoading}
                          onClick={() => setClickedButtonId(1)}
                        >
                          {isLoading ? "Save Draft" : "Save Draft"}
                        </button>
                        <button
                          type="submit"
                          className="btn btn-dark btn-lg"
                          style={{
                            transition: "0.3s ease",
                            backgroundColor: "#57636f",
                            padding: "6px 16px",
                            fontSize: "0.7rem",
                            whiteSpace: "nowrap",
                          }}
                          disabled={!isSubmitEnabled || isLoading}
                          onClick={() => setClickedButtonId(2)}
                        >
                          {isLoading ? "Submit" : "Submit"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="horizontal-rule"
                      style={{ marginBottom: "0.25rem", marginTop: "2.5rem" }}
                    >
                      <hr />
                      <h5
                        className="horizontal-rule-text"
                        style={{ marginBottom: "0" }}
                      >
                        Approvals Hierarchy
                      </h5>
                    </div>
                    <div
                      className="row"
                      style={{ marginTop: "0", paddingTop: "0" }}
                    >
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
                    {eventData.rejectionReason != null ? (
                      <>
                        <div className="horizontal-rule mb-4">
                          <h5 className="horizontal-rule-text">
                            Reject Comment
                          </h5>
                        </div>

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

export default AdminMyEventRequetDetails;
