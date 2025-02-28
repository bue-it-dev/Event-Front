import {
  AddFiles,
  SaveEvent,
  ConfrimEventRequest,
  UpdateEventRequest,
  UpdateFiles,
} from "../Requests/mutators";
import React, { useState, useEffect } from "react";
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

const AddHomeTravelRequest = () => {
  const history = useHistory();
  const [isDraft, setisDraft] = React.useState(false);
  const [isLoading, setisLoading] = React.useState(true);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const [passportFiles, setPassportFiles] = useState([[]]);
  const [eventData, seteventData] = React.useState({
    eventId: 0,
    EventTitle: "",
    NomParticipants: null,
    EventStartDate: null,
    EventEndDate: null,
    HasIt: 0,
    HasAccomodation: 0,
    natureOfEventId: 0,
    organizerPosition: "",
    HasTransportation: 0,
    OrganizerName: "",
    OrganizerMobile: "",
    organizerEmail: "",
    OrganizerExtention: "",
    approvingDepTypeId: 0,
    DeptId: null,
    IsOthers: null,
    isVIP: null,
    IsStaffStudents: null,
    IsChairBoardPrisidentVcb: null,
    LedOfTheUniversityOrganizerFile: null,
    OfficeOfPresedentFile: null,
    passportFiles: [],
    VisitAgendaFile: null,
    ItcomponentEvents: [],
    Transportations: [],
    Accommodations: [],
    BuildingVenues: [],
    Venues: null,
    travellerList: 0,
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

  const onSubmit = async () => {
    try {
      setisLoading(true);
      const data = await SaveEvent(eventData);
      const eventId = data.data;
      localStorage.setItem("eventId", eventId);
      const EventId = localStorage.getItem("eventId");
      if (EventId) {
        await AddFiles(
          EventId,
          passportFiles || [],
          eventData.OfficeOfPresedentFile,
          eventData.LedOfTheUniversityOrganizerFile,
          eventData.VisitAgendaFile
        );
      }
      setisLoading(false);
      setisDraft(true);
      toast.success("Event added successfully", { position: "top-center" });
    } catch (err) {
      setisLoading(false);
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
      });
    }
  };
  const responseRequestIDExtracted = localStorage.getItem("eventId");
  const UpdateDraftEventRequest = async () => {
    try {
      setisLoading(true);
      const payload = {
        eventId: responseRequestIDExtracted,
        approvingDepTypeId: eventData.approvingDepTypeId,
        eventTitle: eventData.EventTitle, // Different case
        nomParticipants: eventData.NomParticipants ?? 0, // Default to 0
        eventStartDate: eventData.EventStartDate,
        natureOfEventId: eventData.natureOfEventId,
        eventEndDate: eventData.EventEndDate,
        hasIt: eventData.HasIt,
        hasAccomdation: eventData.HasAccomodation, // Different property name
        hasTransportation: eventData.HasTransportation,
        endDateTime: null, // Not present in State 1, set to null
        startDateTime: null, // Not present in State 1, set to null
        organizerName: eventData.OrganizerName,
        organizerMobile: eventData.OrganizerMobile,
        organizerExtention: eventData.OrganizerExtention,
        approvingDeptName: null, // Not present in State 1, set to null
        deptId: eventData.DeptId,
        isOthers: eventData.IsOthers ?? 0,
        isStaffStudents: eventData.IsStaffStudents ?? 0,
        isChairBoardPrisidentVcb: eventData.IsChairBoardPrisidentVcb ?? 0,
        ledOfTheUniversityOrganizerFilePath:
          eventData.LedOfTheUniversityOrganizerFile,
        officeOfPresedentFilePath: eventData.OfficeOfPresedentFile,
        visitAgendaFilePath: eventData.VisitAgendaFile,
        confirmedAt: null, // Not present in State 1, set to null
        isVip: eventData.isVIP ?? 0,
        passports: eventData.passportFiles || [], // Ensure it's an array
        itcomponentEvents: eventData.ItcomponentEvents.map((it) => ({
          id: it.id ?? 0,
          eventId: it.eventId ?? responseRequestIDExtracted,
          itcomponentId: it.itcomponentId ?? 0,
          quantity: it.quantity ?? 0,
        })),
        transportations: eventData.Transportations.map((t) => ({
          transportationTypeId: t.transportationTypeId ?? 0,
          eventId: t.eventId ?? responseRequestIDExtracted,
          startDate: t.startDate ?? null,
          endDate: t.endDate ?? null,
          quantity: t.quantity ?? 0,
        })),
        accommodations: eventData.Accommodations.map((a) => ({
          roomTypeId: a.roomTypeId ?? 0,
          eventId: a.eventId ?? responseRequestIDExtracted,
          startDate: a.startDate ?? null,
          endDate: a.endDate ?? null,
          numOfRooms: a.numOfRooms ?? 0,
        })),
        buildingVenues: eventData.BuildingVenues.map((b) => ({
          eventId: b.eventId ?? responseRequestIDExtracted,
          venueId: b.venueId ?? 0,
          buildingId: b.buildingId ?? 0,
        })),
        Venues: eventData.Venues,
        travellerList: eventData.travellerList ?? 0,
      };

      await UpdateEventRequest(payload);

      if (responseRequestIDExtracted) {
        await UpdateFiles(
          responseRequestIDExtracted,
          passportFiles || [],
          eventData.OfficeOfPresedentFile,
          eventData.LedOfTheUniversityOrganizerFile,
          eventData.VisitAgendaFile
        );
      }
      setisLoading(false);
      toast.success("Event Updated successfully", { position: "top-center" });
      // history.push("/my-event-requests");
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
        // Check for null, undefined, or zero values in the list
        const EventId = localStorage.getItem("eventId");
        await ConfrimEventRequest(EventId);
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

        var savedeventData = await SaveEvent(eventData);
        var requestId = savedeventData.data;
        localStorage.setItem("eventId", requestId);
        const EventId = localStorage.getItem("eventId");
        await ConfrimEventRequest(EventId);
        setisLoading(false);
        toast.success("Request confirmed successfully!", {
          position: "top-center",
        });
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
    const newPassportFiles = [...passportFiles];
    newPassportFiles[index] = files;
    setPassportFiles(newPassportFiles);
  };

  useEffect(() => {
    setisLoading(false);
    GetApprovalDepartmentSchema();
    // Getbuildings();
  }, []);

  return (
    <div>
      <ApplicantTabs />
      <br />
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-lg-6 col-xl-6">
          <div className="card rounded-3 shadow-lg border-0">
            <div className="card-body p-4 p-md-5">
              <h5 className="card-header bg-white text-white border-bottom pb-3 fs-4">
                Request Event
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
                  onChange={(e) => {
                    seteventData({
                      ...eventData,
                      approvingDepTypeId: Number(e.target.value),
                    });
                  }}
                  name="approvingDepTypeId"
                  required
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

              <EventInfo eventData={eventData} seteventData={seteventData} />

              <div className="horizontal-rule mb-4">
                <hr className="border-secondary" />
                <h5 className="horizontal-rule-text fs-5 text-dark">
                  Requested Services
                </h5>
              </div>

              <ValidatorForm className="px-md-2">
                <EventSelections
                  eventData={eventData}
                  setEventData={seteventData}
                />
                <br />
                <br />
                <div className="horizontal-rule mb-4">
                  <hr className="border-secondary" />
                  <h5 className="horizontal-rule-text fs-5 text-dark">
                    Requested Venues
                  </h5>
                </div>

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
                    }}
                    onClick={addBuildingVenue}
                  >
                    +
                  </button>
                  <p className="text-dark mb-0 fs-6">Add Venue(s)</p>
                </div>

                {eventData.BuildingVenues.map((_, index) => (
                  <EventBuildingVenueListInfo
                    key={index}
                    index={index}
                    eventData={eventData}
                    seteventData={seteventData}
                  />
                ))}
                <br />
                <div className="horizontal-rule mb-4">
                  <hr className="border-secondary" />
                  <h5 className="horizontal-rule-text fs-5 text-dark">
                    Event Attendance Section
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
                          style={{ transition: "0.3s ease" }}
                          onClick={() =>
                            ConfrimBusinessRequestAsync(
                              responseRequestIDExtracted
                            )
                          }
                        >
                          {isLoading
                            ? "Confirming Request..."
                            : "Confirm Request"}
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          type="submit"
                          className="btn btn-dark btn-lg col-12 mt-3"
                          disabled={isLoading}
                          style={{ transition: "0.3s ease" }}
                          onClick={() => UpdateDraftEventRequest()}
                        >
                          {isLoading ? "Updating Request..." : "Update Request"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <button
                          type="submit"
                          className="btn btn-dark btn-lg col-12 mt-3"
                          disabled={isLoading}
                          style={{ transition: "0.3s ease" }}
                          onClick={() =>
                            SaveandConfrimBusinessRequestAsync(
                              responseRequestIDExtracted
                            )
                          }
                        >
                          {isLoading
                            ? "Confirming Request..."
                            : "Confirm Request"}
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          type="submit"
                          className="btn btn-dark btn-lg col-12 mt-3"
                          disabled={isLoading}
                          style={{ transition: "0.3s ease" }}
                          onClick={() => onSubmit()}
                        >
                          {isLoading
                            ? "Submitting Request..."
                            : "Submit Request"}
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

export default AddHomeTravelRequest;
