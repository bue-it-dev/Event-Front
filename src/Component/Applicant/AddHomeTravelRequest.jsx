import { SaveHomeTravel } from "../Requests/mutators";
import React, { useState, useEffect } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import TextField from "@material-ui/core/TextField";
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

const AddHomeTravelRequest = () => {
  const history = useHistory();

  const [isLoading, setisLoading] = React.useState(true);
  const [rows, setRows] = useState([{ name: "", relation: "" }]);
  const [required, setrequired] = React.useState(false);
  const [roomTypes, setRoomTypes] = React.useState([]);
  const [transportationType, setransportationType] = React.useState([]);
  const [buildings, setbuildings] = React.useState([]);
  const [venuse, setvenuse] = React.useState([]);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const [hometravelData, sethometravelData] = React.useState({
    requestId: 0,
    hasDependent: 0,
    approvingDepName: "",
    roomTypes: "",
    dependentTravelerName: [],
    dependentPassportNumber: [],
    dependentIssueDate: [],
    dependentExpiryDate: [],
    dependentDateOfBirth: [],
    relation: [],
    firstDepartureAirportName: "",
    firstArrivalAirportName: "",
    secondDepartureAirportName: "",
    secondArrivalAirportName: "",
    departureDate: null,
    arrivalDate: null,
    passportName: "",
    passportNumber: "",
    issueDate: null,
    expiryDate: null,
    dateOfBirth: null,
  });

  const [eventData, seteventData] = React.useState({
    ApprovingDepTypeId: null,
    EventTitle: "",
    NomParticipants: null,
    EventStartDate: null,
    EventEndDate: null,
    HasIt: 0,
    HasAccomdation: 0,
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

  const GetRoomTypes = () => {
    var data = "";
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/EventEntity/get-rooms`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        setRoomTypes(response.data.data);
      })
      .catch(function (error) {});
  };
  
  
  const GettransportationType = () => {
    var data = "";
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/EventEntity/get-transportationType`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        setransportationType(response.data.data);
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
      if (hometravelData.arrivalDate == null) {
        hometravelData.arrivalDate = "";
      }
      if (hometravelData.dependentIssueDate == null) {
        hometravelData.dependentIssueDate = "";
      }
      if (hometravelData.dependentExpiryDate == null) {
        hometravelData.dependentExpiryDate = "";
      }
      if (hometravelData.dependentDateOfBirth == null) {
        hometravelData.dependentDateOfBirth = "";
      }
      await SaveHomeTravel(hometravelData);
      setisLoading(false);
      toast.success("Addition Occured Successfully", {
        position: "top-center",
      });
      setrequired(false);
      history.push("/my-home-requests");
    } catch (err) {
      setisLoading(false);
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
      });
    }
  };

  const addTraveller = () => {
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

  useEffect(() => {
    setisLoading(false);
    GetApprovalDepartmentSchema();
    GetRoomTypes();
    GettransportationType();
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
                    sethometravelData({
                      ...hometravelData,
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
              <div>
              <select
                  className="form-select form-select-lg custom-select"
                  onChange={(e) => {
                    sethometravelData({
                      ...hometravelData,
                      approvingDepName: e.target.value,
                    });
                  }}
                  name="approvingDepName"
                  required
                >
                  <option value="">
                    Select your Room
                  </option>
                  {roomTypes.map((data) => (
                    <option key={data.roomTypeName} value={data.roomTypeName}>
                      {data.roomTypeName}
                    </option>
                  ))}
                </select>

              </div>

              <div>
              <select
                  className="form-select form-select-lg custom-select"
                  onChange={(e) => {
                    sethometravelData({
                      ...hometravelData,
                      approvingDepName: e.target.value,
                    });
                  }}
                  name="approvingDepName"
                  required
                >
                  <option value="">
                    Select your Room
                  </option>
                  {venuse.map((data) => (
                    <option key={data.venueName} value={data.venueName}>
                      {data.venueName}
                    </option>
                  ))}
                </select>

              </div>
              <div>
              <select
                  className="form-select form-select-lg custom-select"
                  onChange={(e) => {
                    sethometravelData({
                      ...hometravelData,
                      approvingDepName: e.target.value,
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
              <div>
              <select
                  className="form-select form-select-lg custom-select"
                  onChange={(e) => {
                    sethometravelData({
                      ...hometravelData,
                      approvingDepName: e.target.value,
                    });
                  }}
                  name="approvingDepName"
                  required
                >
                  <option value="">
                    Select your transportationType
                  </option>
                  {transportationType.map((data) => (
                    <option key={data.transportationType1} value={data.transportationType1}>
                      {data.transportationType1}
                    </option>
                  ))}
                </select>

              </div>
              <div className="horizontal-rule mb-4">
                <hr />
                <h5 className="horizontal-rule-text fs-5">Passport Info</h5>
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
                <div className="horizontal-rule mb-4">
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
                <br />
                <div className="horizontal-rule mb-4">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">Flight Class</h5>
                </div>
                
                    
                <br />
                <div className="horizontal-rule mb-4">
                  <hr />
                  <h5 className="horizontal-rule-text fs-5">
                    Itinerary (Airport)
                  </h5>
                </div>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
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
                      value={hometravelData.firstDepartureAirportName}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters and spaces, but not only spaces
                        if (/^[a-zA-Z ]*$/.test(value) && value.trim() !== "") {
                          sethometravelData({
                            ...hometravelData,
                            firstDepartureAirportName: value,
                          });
                        } else if (value === "") {
                          // Allow clearing the input
                          sethometravelData({
                            ...hometravelData,
                            firstDepartureAirportName: value,
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
                      value={hometravelData.firstArrivalAirportName}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters and spaces, but not only spaces
                        if (/^[a-zA-Z ]*$/.test(value) && value.trim() !== "") {
                          sethometravelData({
                            ...hometravelData,
                            firstArrivalAirportName: value,
                          });
                        } else if (value === "") {
                          // Allow clearing the input
                          sethometravelData({
                            ...hometravelData,
                            firstArrivalAirportName: value,
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
                    <label htmlFor="departureDate" className="form-label fs-6">
                      Departure Date:
                    </label>
                    <input
                      type="date"
                      id="departureDate"
                      name="departureDate"
                      value={hometravelData.departureDate}
                      onChange={(e) => {
                        sethometravelData({
                          ...hometravelData,
                          departureDate: e.target.value,
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
                      value={hometravelData.secondDepartureAirportName}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters and spaces, but not only spaces
                        if (/^[a-zA-Z ]*$/.test(value) && value.trim() !== "") {
                          sethometravelData({
                            ...hometravelData,
                            secondDepartureAirportName: value,
                          });
                        } else if (value === "") {
                          // Allow clearing the input
                          sethometravelData({
                            ...hometravelData,
                            secondDepartureAirportName: value,
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
                      value={hometravelData.secondArrivalAirportName}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters and spaces, but not only spaces
                        if (/^[a-zA-Z ]*$/.test(value) && value.trim() !== "") {
                          sethometravelData({
                            ...hometravelData,
                            secondArrivalAirportName: value,
                          });
                        } else if (value === "") {
                          // Allow clearing the input
                          sethometravelData({
                            ...hometravelData,
                            secondArrivalAirportName: value,
                          });
                        }
                      }}
                      className="form-control form-control-lg"
                      pattern="[a-zA-Z ]+"
                      title="Only letters and spaces are allowed"
                    />
                  </div>
                  <div className="mb-4 flex-grow-1">
                    <label htmlFor="arrivalDate" className="form-label fs-6">
                      Return Date (Optional):
                    </label>
                    <input
                      type="date"
                      id="arrivalDate"
                      name="arrivalDate"
                      value={hometravelData.arrivalDate}
                      onChange={(e) => {
                        sethometravelData({
                          ...hometravelData,
                          arrivalDate: e.target.value,
                        });
                      }}
                      className="form-control form-control-lg custom-date-input"
                  
                    />
                  </div>
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
