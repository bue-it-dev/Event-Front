import { AddFiles, SaveEvent } from "../Requests/mutators";
import React, { useState, useEffect } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import "./Applicant.css"; // Import your CSS file
import ApplicantTabs from "./ApplicantTabs";
import { useHistory } from "react-router-dom";
// import PassportInfoSection from "../shared_components/RequesterPassportInfo";
import DependantInfo from "../shared_components/DependantInfo";
import { toast } from "react-toastify";
import EventInfo from "../shared_components/EventPassportInfo";
import EventSelections from "../shared_components/EventSelections";  
import EventFilesSection from "../shared_components/EventFilesSection";
const AddHomeTravelRequest = () => {
  const history = useHistory();
  const userToken = localStorage.getItem("accessToken");

  const [isLoading, setisLoading] = React.useState(true);
  const [rows, setRows] = useState([{ name: "", relation: "" }]);
  const [required, setrequired] = React.useState(false);
  const [buildings, setbuildings] = React.useState([]);
  const [venuse, setvenuse] = React.useState([]);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const [passportFiles, setPassportFiles] = useState([[]]);  // Inside the component
  const [eventData, seteventData] = React.useState({
    EventTitle: "",
    NomParticipants: null,
    EventStartDate: null,
    EventEndDate: null,
    HasIt: 0,
    HasAccomodation: 0,
    HasTransportation: 0,
    OrganizerName: "",
    OrganizerMobile: "",
    OrganizerExtention: "",
    approvingDepName: "",
    DeptId: null,
    IsOthers: null,
    IsStaffStudents: null,
    IsChairBoardPrisidentVcb: null,
    LedOfTheUniversityOrganizerFile: null,
    OfficeOfPresedentFile: null,
    passportFiles:[],
    VisitAgendaFile: null,
    ItcomponentEvents: [],
    Transportations: [],
    Accommodations: [],
    BuildingVenues: []
  });

  // Get List of Approval Department Schema
  const GetApprovalDepartmentSchema = () => {
    var data = "";
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/EventEntity/get-approval-departments-schema`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      
      data: data,
    };
    axios(config)
      .then(function (response) {
        setapprovalDepartments(response.data.data);
      })
      .catch(function (error) {});
  };

  const Getbuildings = () => {
    var data = "";
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/EventEntity/get-buildings`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        setbuildings(response.data.data);
      })
      .catch(function (error) {});
  };

  const Getvenuse = () => {
    var data = "";
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/EventEntity/get-venuse`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        setvenuse(response.data.data);
      })
      .catch(function (error) {});
  };


  
  const onSubmit = async () => {
    try {
      setisLoading(true);
     
      
      // Send the FormData to the backend
      const data = await SaveEvent(eventData);
      const eventId = data.data
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
     // history.push("/my-home-requests"); // Redirect to the appropriate page
    
      
    } catch (err) {
      setisLoading(false);
      toast.error("An error occurred. Please try again later.", { position: "top-center" });
    }
  };

  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files); 
    const newPassportFiles = [...passportFiles];
    newPassportFiles[index] = files; 
    setPassportFiles(newPassportFiles);
  };
  

 /* const addTraveller = () => {
    sethometravelData((prevData) => ({
      ...prevData,
      hasDependent: prevData.hasDependent + 1,
      dependentTravelerName: [...prevData.dependentTravelerName, ""],
      relation: [...prevData.relation, ""],
      dependentPassportNumber: [...prevData.dependentPassportNumber, ""],
      dependentIssueDate: [...prevData.dependentIssueDate, ""],
      dependentExpiryDate: [...prevData.dependentExpiryDate, ""],
      dependentDateOfBirth: [...prevData.dependentDateOfBirth, ""],
    }));
  };
  */

  useEffect(() => {
    setisLoading(false);
    GetApprovalDepartmentSchema();
    Getbuildings();
    Getvenuse();
  }, []);

  return (
    <div>
      <ApplicantTabs />
      <br />
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-lg-8 col-xl-6">
          <div className="card rounded-3">
            <div className="card-body p-6 p-md-5">
              <h5 className="card-header">Request Event</h5>
              <br />
              <div className="horizontal-rule mb-4">
                <hr />
                <h5 className="horizontal-rule-text fs-5">Department Info</h5>
              </div>

              <div className="mb-4 flex-grow-1">
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
                  <span style={{ marginRight: "8px", fontSize: "16px" }}>
                    ⚠️
                  </span>
                  Once you select your department, further changes to the
                  selected department will not be permitted.
                </p>
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
                      console.log(data);

                    </option>
                  ))}
                </select>
              </div>
             
 
              
              <div>
              <select
                  className="form-select form-select-lg custom-select"
                  onChange={(e) => {
                    seteventData({
                      ...eventData,
                      buildings: e.target.value,
                    });
                  }}
                  name="approvingDepName"
                  required
                >
                  <option value="">
                    Select buildings
                  </option>
                  {buildings.map((data) => (
                    <option key={data.building} value={data.building}>
                      {data.building}
                    </option>
                  ))}
                </select>

              </div>
             
              <div className="horizontal-rule mb-4">
                <hr />
                <h5 className="horizontal-rule-text fs-5">Event Info</h5>
              </div>
              {/* <PassportInfoSection
                eventData={eventData}
                seteventData={seteventData}
              /> */}
              <EventInfo
              eventData={eventData}
              seteventData={seteventData}
              />
              <ValidatorForm onSubmit={onSubmit} className="px-md-2">
               {/* <div className="horizontal-rule mb-4">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">
                    Number of Travelers (If Any)
                  </h5>
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
                      marginRight: "10px", // Adjust the margin to your liking
                    }}
                    onClick={addTraveller}
                  >
                    +
                  </button>
                  <p style={{ color: "black", fontSize: "16px", margin: 0 }}>
                    Add Traveler(s)
                  </p>
                </div>
                {hometravelData.hasDependent > 0 ? (
                  <>
                    {Array.from({ length: hometravelData.hasDependent }).map(
                      (_, index) => (
                        <DependantInfo
                          index={index}
                          hometravelData={hometravelData}
                          sethometravelData={sethometravelData}
                        />
                      )
                    )}
                  </>
                ) : null}
                */}
                <br />
                <div className="horizontal-rule mb-4">
                
                <EventSelections eventData={eventData} setEventData={seteventData} />
                <EventFilesSection 
                eventData={eventData} 
                setEventData={seteventData} 
                handleFileChange={handleFileChange} 

              />

                
                  
                </div>
                <br />
                <button
                  type="submit"
                  className="btn btn-success btn-lg col-12"
                  style={{ backgroundColor: "#57636f", borderColor: "#7f0008" }}
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
