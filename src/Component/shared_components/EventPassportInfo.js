import React, { useState } from "react";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import URL from "../Util/config";
import Select from "react-select";

const EventInfo = ({ eventData, seteventData }) => {
  const [errors, setErrors] = useState({});
  const [natureofevents, setnatureofEvents] = useState([]);
  const [employeelist, setEmployeeList] = React.useState([]);
  const [empsettings, setEmpsettings] = React.useState([]);
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

        // employeeEmailAndPositionByEmpId(employeelist.value);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
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
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  React.useEffect(() => {
    GetEmployeeList();
  }, []);
  // Get List of Approval Department Schema
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
  // const handleOrgChange = (selectedOption) => {
  //   const fullLabel = selectedOption ? selectedOption.label : "";
  //   const empId = selectedOption ? selectedOption.value : "";
  //   console.log("Emp Id", empId);
  //   var settings = employeeEmailAndPositionByEmpId(empId);
  //   console.log("settings", settings);
  //   seteventData((prevState) => ({
  //     ...prevState,
  //     OrganizerName: String(fullLabel),
  //     organizerEmail: empsettings.email, // Ensure it's a string
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
        OrganizerName: fullLabel,
        organizerEmail: employeeData.email || "", // Ensure a fallback value
        organizerPosition: employeeData.position || "", // Ensure a fallback value
      }));
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  // Validate input and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    switch (name) {
      case "EventTitle":
        if (!/^[a-zA-Z ]+$/.test(value.trim())) {
          newErrors[name] = "Event title must contain only letters.";
        } else {
          delete newErrors[name];
        }
        break;

      case "NomParticipants":
        if (!/^\d+$/.test(value) || parseInt(value, 10) < 1) {
          newErrors[name] = "Participants must be a positive number.";
        } else {
          delete newErrors[name];
        }
        break;

      case "EventStartDate":
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
  React.useEffect(() => {
    // setisLoading(false);
    GetNatureofEvents();
    // Getbuildings();
  }, []);
  return (
    <div className="container-fluid">
      <div className="card shadow-sm px-5 py-4 w-150 mx-auto">
        <div className="row g-4">
          {/* Event Title */}
          <div className="col-lg-6">
            <label htmlFor="EventTitle" className="form-label font-weight-bold">
              Title
            </label>
            <input
              type="text"
              id="EventTitle"
              name="EventTitle"
              value={eventData.EventTitle}
              onChange={handleChange}
              className="form-control form-control-lg w-100"
              required
            />
            {errors.EventTitle && (
              <small className="text-danger">{errors.EventTitle}</small>
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
              id="NomParticipants"
              name="NomParticipants"
              value={eventData.NomParticipants || ""}
              onChange={handleChange}
              className="form-control form-control-lg w-100"
              min="1"
            />
            {errors.NomParticipants && (
              <small className="text-danger">{errors.NomParticipants}</small>
            )}
          </div>
          {/* Event Start Date */}
          <div className="col-lg-6">
            <label
              htmlFor="EventStartDate"
              className="form-label font-weight-bold"
            >
              Start Date
            </label>
            <input
              type="date"
              id="EventStartDate"
              name="EventStartDate"
              value={eventData.EventStartDate || ""}
              onChange={handleChange}
              className="form-control form-control-lg w-100"
              required
            />
            {errors.EventStartDate && (
              <small className="text-danger">{errors.EventStartDate}</small>
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
              id="EventEndDate"
              name="EventEndDate"
              value={eventData.EventEndDate || ""}
              onChange={handleChange}
              className="form-control form-control-lg w-100"
            />
            {errors.EventEndDate && (
              <small className="text-danger">{errors.EventEndDate}</small>
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
                <option key={data.natureOfEventId} value={data.natureOfEventId}>
                  {data.natureOfEvent}
                </option>
              ))}
            </select>
          </div>
          {/* Organizer Email */}
          <div className="col-lg-6">
            <label
              htmlFor="natureOfEventId"
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
              name="natureOfEventId"
              required
            >
              <option value="Internal">Internal</option>
              <option value="External">External</option>
            </select>
          </div>
          <div className="col-lg-6">
            <label
              htmlFor="natureOfEventId"
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
              htmlFor="natureOfEventId"
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
              name="natureOfEventId"
              required
            >
              <option value="EGP">EGP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
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
                  htmlFor="OrganizerName"
                  className="form-label font-weight-bold"
                >
                  Organizer Name
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable
                  isSearchable
                  options={[...employeelist, { value: -1, label: "Others" }]}
                  onChange={handleOrgChange}
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
                    name="OrganizerEmail"
                    disabled
                    value={empsettings.email || eventData.organizerEmail}
                    onChange={(e) => {
                      seteventData({
                        ...eventData,
                        organizerEmail: e.target.value,
                      });
                    }}
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
                  value={empsettings.position || ""}
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
                  htmlFor="OrganizerName"
                  className="form-label font-weight-bold"
                >
                  Organizer Name
                </label>
                {}
                <input
                  type="text"
                  id="OrganizerName"
                  name="OrganizerName"
                  value={eventData.OrganizerName || ""}
                  onChange={handleChange}
                  className="form-control form-control-lg w-100"
                />
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
                id="OrganizerMobile"
                name="OrganizerMobile"
                value={eventData.OrganizerMobile || ""}
                onChange={handleChange}
                maxLength={11}
                className="form-control form-control-lg"
                placeholder="Enter valid Egyptian phone number"
              />
            </div>
            {errors.OrganizerMobile && (
              <small className="text-danger">{errors.OrganizerMobile}</small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
