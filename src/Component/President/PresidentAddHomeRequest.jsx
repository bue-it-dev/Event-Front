import { SaveHomeTravel } from "../Requests/mutators";
import React, { useState, useEffect } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import TextField from "@material-ui/core/TextField";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import "../Applicant/Applicant.css";
import { useHistory } from "react-router-dom";
import PassportInfoSection from "../shared_components/RequesterPassportInfo";
import DependantInfo from "../shared_components/DependantInfo";
import PresidentTabs from "./PresidentTabs";
import { toast } from "react-toastify";

const PresidentAddHomeRequest = () => {
  const history = useHistory();

  const [isLoading, setisLoading] = React.useState(true);
  const [rows, setRows] = useState([{ name: "", relation: "" }]);
  const [required, setrequired] = React.useState(false);
  const [planeClasses, setplaneClasses] = React.useState([]);
  const [hometravelData, sethometravelData] = React.useState({
    requestId: 0,
    hasDependent: 0,
    dependentTravelerName: [],
    dependentPassportNumber: [],
    dependentIssueDate: [],
    dependentExpiryDate: [],
    dependentDateOfBirth: [],
    relation: [],
    planeClassId: 0,
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

  // Get List of Plane Classes
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

  const onSubmit = async () => {
    try {
      setisLoading(true);
      if (hometravelData.arrivalDate == null) {
        hometravelData.arrivalDate = "";
      }
      await SaveHomeTravel(hometravelData);
      setisLoading(false);
      toast.success("Addition Occured Successfully", {
        position: "top-center",
      });
      setrequired(false);
      history.push("/president-my-home-travel-request");
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
    GetPlaneClasses();
  }, []);

  return (
    <div>
      {/* <h4>President Office's Portal</h4> */}
      <PresidentTabs />
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-lg-8 col-xl-6">
          <div className="card rounded-3">
            <div className="card-body p-6 p-md-5">
              <h5 className="card-header">Request Home Leave</h5>
              <br />

              <div className="horizontal-rule mb-4">
                <hr />
                <h5 className="horizontal-rule-text fs-5">Passport Info</h5>
              </div>
              <PassportInfoSection
                hometravelData={hometravelData}
                sethometravelData={sethometravelData}
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
                      borderColor: "#7f0008",
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
                <div className="form-outline mb-4">
                  <select
                    className="form-select form-select-lg custom-select"
                    value={hometravelData.planeClassId}
                    onChange={(e) => {
                      sethometravelData({
                        ...hometravelData,
                        planeClassId: e.target.value,
                      });
                    }}
                    name="planeClassId"
                    required
                  >
                    <option value="">Select Plane Class</option>
                    {planeClasses.map((data) => (
                      <option key={data.planeClassId} value={data.planeClassId}>
                        {data.planeClassName}
                      </option>
                    ))}
                  </select>
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
                      min={
                        hometravelData.departureDate
                          ? hometravelData.departureDate
                          : ""
                      }
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

export default PresidentAddHomeRequest;
