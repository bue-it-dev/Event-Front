import { AddFiles, SaveEvent } from "../Requests/mutators";
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
  const [isLoading, setisLoading] = React.useState(true);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const [buildings, setbuildings] = React.useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [venuse, setvenuse] = React.useState([]);
  const [passportFiles, setPassportFiles] = useState([[]]);
  const [eventData, seteventData] = React.useState({
    eventId: 0,
    EventTitle: "",
    NomParticipants: null,
    EventStartDate: null,
    EventEndDate: null,
    HasIt: 0,
    HasAccomodation: 0,
    HasTransportation: 0,
    OrganizerName: "",
    OrganizerMobile: "",
    organizerEmail: "",
    OrganizerExtention: "",
    approvingDepName: "",
    DeptId: null,
    IsOthers: null,
    IsOthersNOTVIP: null,
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
      toast.success("Event added successfully", { position: "top-center" });
      history.push("/my-event-requests");
    } catch (err) {
      setisLoading(false);
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
      });
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
        <div className="col-lg-8 col-xl-8">
          <div className="card rounded-3">
            <div className="card-body p-6 p-md-5">
              <h5 className="card-header">Request Event</h5>
              <br />
              <div className="horizontal-rule mb-4">
                <hr />
                <h5 className="horizontal-rule-text fs-5">Department Info</h5>
              </div>

              <div className="mb-4 flex-grow-1">
                <select
                  className="form-select form-select-lg custom-select"
                  onChange={(e) => {
                    seteventData({
                      ...eventData,
                      approvingDepName: e.target.value,
                    });
                  }}
                  name="approvingDepName"
                  required
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
                <hr />
                <h5 className="horizontal-rule-text fs-5">Event Info</h5>
              </div>
              <EventInfo eventData={eventData} seteventData={seteventData} />
              <div className="horizontal-rule mb-4">
                <hr />
                <h5 className="horizontal-rule-text fs-5">
                  Requested Services
                </h5>
              </div>
              <ValidatorForm onSubmit={onSubmit} className="px-md-2">
                <EventSelections
                  eventData={eventData}
                  setEventData={seteventData}
                />
                <div className="horizontal-rule mb-4">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">
                    Requested Venues
                  </h5>
                  <br />
                  <div className="d-flex align-items-center mb-1">
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{
                        backgroundColor: "#57636f",
                        borderColor: "black",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        color: "white",
                        width: "32px", // Adjusted width to match font-size
                        height: "32px", // Ensures a proportional button
                        fontSize: "16px", // Matches the text font-size
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "10px",
                        borderRadius: "5px", // Slightly rounded corners for aesthetics
                      }}
                      onClick={addBuildingVenue}
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
                      Add Venue(s)
                    </p>
                  </div>
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
                <div className="horizontal-rule mb-4">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">
                    Event Attendance Section
                  </h5>
                </div>
                <EventFilesSection
                  eventData={eventData}
                  setEventData={seteventData}
                  handleFileChange={handleFileChange}
                />
                <button
                  type="submit"
                  className="btn btn-success btn-lg col-12"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting Request..." : "Submit"}
                </button>
              </ValidatorForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHomeTravelRequest;
