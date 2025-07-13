import {
  AddFiles,
  SaveEvent,
  ConfrimEventRequest,
  UpdateEventRequest,
  UpdateFiles,
} from "../Requests/mutators";
import React, { useState, useEffect, useRef } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import "./Applicant.css";
import ApplicantTabs from "./ApplicantTabs";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import EventInfo from "../shared_components/EventPassportInfo";
import EventSelections from "../shared_components/EventSelections";
import EventFilesSection from "../shared_components/EventFilesSection";
import EventBuildingVenueListInfo from "../shared_components/eventBuildingVenueListInfo";
import { ActionTurnedInNot } from "material-ui/svg-icons";

const AddEventRequest = () => {
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(true);
  const history = useHistory();
  const [isDraft, setisDraft] = React.useState(false);
  const [isLoading, setisLoading] = React.useState(true);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const [passportData, setpassportData] = useState([[]]);
  const [eventData, seteventData] = React.useState({
    eventId: 0,
    EventTitle: "",
    NomParticipants: null,
    EventStartDate: null,
    EventEndDate: null,
    hasBudget: 0,
    hasMarcom: 0,
    hasIt: 0,
    hasAccomdation: 0,
    hasTransportation: 0,
    natureOfEventId: 1,
    OrganizerName: "",
    OrganizerMobile: "",
    organizerEmail: "",
    organizerPosition: "",
    approvingDepTypeId: 0,
    budgetEstimatedCost: 0,
    budgetCostCurrency: "EGP",
    eventType: "Internal",
    DeptId: null,
    IsOthers: null,
    isVip: null,
    isInernationalGuest: null,
    IsStaffStudents: null,
    IsChairBoardPrisidentVcb: null,
    LedOfTheUniversityOrganizerFile: null,
    OfficeOfPresedentFile: null,
    passportData: [],
    VisitAgendaFile: null,
    ItcomponentEvents: [],
    Transportations: [],
    Accommodations: [],
    BuildingVenues: [],
    Venues: null,
    travellerList: 0,
    approvingDeptName: "",
  });
  const addBuildingVenue = () => {
    seteventData((prevData) => ({
      ...prevData,
      travellerList: prevData.travellerList + 1,
      BuildingVenues: [
        ...prevData.BuildingVenues,
        {
          eventId: prevData.eventId, // Initialize empty
          venueId: prevData.venueId, // Initialize empty
        },
      ],
    }));
  };

  // Get List of Approval Department Schema
  // const GetApprovalDepartmentSchema = () => {
  //   var config = {
  //     method: "get",
  //     url: `${URL.BASE_URL}/api/BusinessRequest/get-approval-departments-schema`,
  //     headers: {
  //       Authorization: `Bearer ${getToken()}`,
  //     },
  //   };
  //   axios(config)
  //     .then(function (response) {
  //       setapprovalDepartments(response.data);
  //     })
  //     .catch(function (error) {
  //       console.error("Error fetching departments:", error);
  //     });
  // };
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
  const onSubmit = async () => {
    try {
      setisLoading(true);
      const data = await SaveEvent(eventData);
      const eventId = data.data;
      localStorage.setItem("eventId", eventId);
      const EventId = localStorage.getItem("eventId");
      console.log("PASSPORTDATA", eventData.passportData);
      if (EventId) {
        await AddFiles(
          EventId,
          eventData.passportData || [],
          eventData.OfficeOfPresedentFile,
          eventData.LedOfTheUniversityOrganizerFile,
          eventData.VisitAgendaFile
        );
      }
      setisLoading(false);
      setisDraft(true);
      // toast.success("Form Saved!", { position: "top-center" });
      history.push("/my-event-requests");
    } catch (err) {
      setisLoading(false);
      toast.error("An error occurred. Please try again later");
    }
  };
  const responseRequestIDExtracted = localStorage.getItem("eventId");
  const UpdateDraftEventRequest = async () => {
    try {
      setisLoading(true);
      await UpdateEventRequest(responseRequestIDExtracted, eventData);
      if (responseRequestIDExtracted) {
        await UpdateFiles(
          responseRequestIDExtracted,
          eventData.passportData || [],
          eventData.OfficeOfPresedentFile,
          eventData.LedOfTheUniversityOrganizerFile,
          eventData.VisitAgendaFile
        );
      }
      setisLoading(false);
      toast.success("Form Updated!", { position: "top-center" });
      history.push("/my-event-requests");
    } catch (err) {
      setisLoading(false);
      toast.error("An error occurred. Please try again later.");
    }
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
        // Check for null, undefined, or zero values in the list
        const EventId = localStorage.getItem("eventId");
        await ConfrimEventRequest(EventId);
        // if (EventId) {
        //   await AddFiles(
        //     EventId,
        //     passportData || [],
        //     eventData.OfficeOfPresedentFile,
        //     eventData.LedOfTheUniversityOrganizerFile,
        //     eventData.VisitAgendaFile
        //   );
        // }
        setisLoading(false);
        toast.success("Form Submitted!", {
          position: "top-center",
        });
        history.push("/my-event-requests");
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
    const userConfirmed = ActionTurnedInNot;

    if (userConfirmed) {
      try {
        setisLoading(true);

        var savedeventData = await SaveEvent(eventData);
        var requestId = savedeventData.data;
        localStorage.setItem("eventId", requestId);
        const EventId = localStorage.getItem("eventId");
        await ConfrimEventRequest(EventId);
        if (EventId) {
          await AddFiles(
            EventId,
            eventData.passportData || [],
            eventData.OfficeOfPresedentFile,
            eventData.LedOfTheUniversityOrganizerFile,
            eventData.VisitAgendaFile
          );
        }
        setisLoading(false);
        // toast.success("Form Submitted!", {
        //   position: "top-center",
        // });
        history.push("/my-event-requests");
      } catch (err) {
        setisLoading(false);
        toast.error("Error while updating user details, please try again", {
          position: "top-center",
        });
      }
    }
  };
  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);
    const newpassportData = [...passportData];
    newpassportData[index] = files;
    setpassportData(newpassportData);
  };
  const [employeeSelected, setemployeeSelected] = useState(false);
  const [ITChoice, setITChoice] = useState(false);
  const [TransportChoice, setTransportChoice] = useState(false);
  const [AccommodationChoice, setAccommodationChoice] = useState(false);
  const [clickedButtonId, setClickedButtonId] = useState(null);
  const eventInfoRef = useRef(null);
  const venueSectionRef = useRef(null);
  const ServiceSectionRef = useRef(null);
  const onClickeSubmit = () => {
    let isValidationValid = false;
    if (employeeSelected == true) {
      isValidationValid = true;
    } else {
      toast.error("Employee name is required.");
      // Scroll to EventInfo
      eventInfoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      document.getElementById("EmployeeSelect-Event").focus();
      return;
    }
    if (!eventData.BuildingVenues || eventData.BuildingVenues.length === 0) {
      toast.error("Select the event venue(s).");
      venueSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    if (eventData.hasIt == 1) {
      if (ITChoice == true) {
        isValidationValid = true;
      } else {
        toast.error("Please select at least one IT component.");
        ServiceSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }
    }
    if (eventData.hasTransportation == 1) {
      if (TransportChoice == true) {
        isValidationValid = true;
      } else {
        toast.error("Please select at least one Transportation choice.");
        ServiceSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }
    }
    if (eventData.hasAccomdation == 1) {
      if (AccommodationChoice == true) {
        isValidationValid = true;
      } else {
        toast.error("Please select at least one Accommodation choice.");
        ServiceSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }
    }
    if (!eventData.IsStaffStudents && !eventData.IsOthers) {
      toast.error("Select an option from the attendance section");
      return;
    }
    if (eventData.IsOthers == 1) {
      if (!eventData.isVip && !eventData.isInernationalGuest) {
        toast.error(
          "Please select at least one option from the Others section"
        );
        return;
      }
      if (eventData.isInernationalGuest == 1) {
        console.log("I am here");
        if (!eventData.passportData || eventData.passportData.length === 0) {
          console.log("I am here in passport DATA");
          toast.error(
            "Please upload the passport file for international guests."
          );
          return;
        }
      }
    }
    handleSubmit(clickedButtonId);
  };
  const handleSubmit = (id) => {
    if (id == 1) {
      onSubmit();
    } else if (id == 2) {
      SaveandConfrimBusinessRequestAsync(responseRequestIDExtracted);
    }
  };
  useEffect(() => {
    setisLoading(false);
    GetApprovalDepartmentSchema();
  }, []);

  return (
    <div>
      <ApplicantTabs />
      <br />
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-lg-6 col-xl-6">
          <div className="card rounded-3 shadow-lg border-0">
            <div className="card-body p-4 p-md-5">
              <h5 className="card-header bg-white text-white border-bottom">
                Request Event
              </h5>
              <div className="d-flex justify-content-center">
                <div
                  role="alert"
                  className="align-items-center"
                  style={{
                    backgroundColor: "#e7e7e7",
                    color: "black",
                    fontSize: ".7rem",
                    fontWeight: "bold",
                    borderRadius: "0.25rem",
                    height: "auto",
                    padding: "0.25rem 0.5rem",
                    width: "auto%", // adjust as needed
                    textAlign: "center", // optional: center text inside
                    marginTop: "0.5rem",
                  }}
                >
                  Check venue availability before submitting the event request
                </div>
              </div>
              <ValidatorForm onSubmit={onClickeSubmit} className="px-md-2">
                <div className="horizontal-rule mb-4">
                  <hr className="border-secondary" />
                  <h5 className="horizontal-rule-text fs-5 text-dark">
                    Event Info
                  </h5>
                </div>
                <div ref={venueSectionRef}>
                  <div ref={eventInfoRef}>
                    <EventInfo
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
                  <p className="text-dark mb-0" style={{ fontSize: "0.7rem" }}>
                    Add Venue(s)
                  </p>
                </div>
                <div>
                  {eventData.BuildingVenues.map((_, index) => (
                    <EventBuildingVenueListInfo
                      key={index}
                      index={index}
                      eventData={eventData}
                      seteventData={seteventData}
                    />
                  ))}
                </div>
                <br />
                <div ref={ServiceSectionRef}>
                  <div className="horizontal-rule mt-2">
                    <hr className="border-secondary" />
                    <h5 className="horizontal-rule-text fs-5 text-dark">
                      Services
                    </h5>
                  </div>

                  <EventSelections
                    eventData={eventData}
                    setEventData={seteventData}
                    setITChoice={setITChoice}
                    setTransportChoice={setTransportChoice}
                    setAccommodationChoice={setAccommodationChoice}
                  />
                </div>
                <br />
                <br />
                <div className="horizontal-rule mb-2">
                  <hr className="border-secondary" />
                  <h5 className="horizontal-rule-text fs-5 text-dark">
                    Attendance
                  </h5>
                </div>
                <EventFilesSection
                  eventData={eventData}
                  setEventData={seteventData}
                  handleFileChange={handleFileChange}
                />
                {isDraft == true ? (
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
                          onClick={() => UpdateDraftEventRequest()}
                        >
                          {isLoading ? "Saving Draft..." : "Save Draft"}
                        </button>
                      </div>
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
                        onClick={() =>
                          ConfrimBusinessRequestAsync(
                            responseRequestIDExtracted
                          )
                        }
                      >
                        {isLoading ? "Submitting Request..." : "Submit Request"}
                      </button>
                    </div>
                  </>
                ) : (
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
                )}
              </ValidatorForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventRequest;
