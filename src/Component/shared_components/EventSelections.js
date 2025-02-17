import React, { useState, useEffect } from "react";
import axios from "axios";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";

const EventSelections = ({ eventData, setEventData }) => {
  const [transportationTypes, setTransportationTypes] = useState([]);
  const [itComponents, setItComponents] = useState([]);

  // Fetch transportation types
  const getTransportationTypes = () => {
    axios
      .get(`${URL.BASE_URL}/api/EventEntity/get-transportationType`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setTransportationTypes(response.data.data))
      .catch((error) => console.error("Error fetching transportation types:", error));
  };

  // Fetch IT components
  const getItComponents = () => {
    axios
      .get(`${URL.BASE_URL}/api/EventEntity/get-itComponents`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        console.log("IT Components fetched:", response.data.data); // Log IT components to confirm
        setItComponents(response.data.data);
      })
      .catch((error) => console.error("Error fetching IT components:", error));
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setEventData((prevData) => ({
      ...prevData,
      HasTransportation: isChecked ? 1 : 0,
      Transportations: isChecked
        ? [{ TransportationTypeId: null, StartDate: "", EndDate: "" }]
        : [],
    }));
  };

  const handleItCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setEventData((prevData) => ({
      ...prevData,
      HasIt: isChecked ? 1 : 0,
      ItComponents: isChecked ? [{ ItcomponentId: null }] : [],
    }));
  };

  // Handle changes in transport details
  const handleTransportationChange = (index, field, value) => {
    const updatedTransportations = eventData.Transportations.map((transport, i) =>
      i === index ? { ...transport, [field]: value } : transport
    );
    setEventData({ ...eventData, Transportations: updatedTransportations });
  };

  // Handle changes in IT component details
  const handleItComponentChange = (index, value) => {
    const updatedItComponents = eventData.ItComponents.map((itComp, i) =>
      i === index ? { ...itComp, ItcomponentId: value } : itComp
    );
    setEventData({ ...eventData, ItComponents: updatedItComponents });
  };

  useEffect(() => {
    getTransportationTypes();
    getItComponents(); 
  }, []); 

  return (
    <div>
      {/* Transportation Checkbox */}
      <div className="form-check mb-3">
        <input
          type="checkbox"
          id="HasTransportation"
          className="form-check-input"
          checked={eventData.HasTransportation === 1}
          onChange={handleCheckboxChange}
        />
        <label className="form-check-label fs-6" htmlFor="HasTransportation">
          Requires Transportation
        </label>
      </div>

      {/* Transportation selection (Only shows when checked) */}
      {eventData.HasTransportation === 1 && (
        <>
          <div className="horizontal-rule mb-3">
            <hr />
            <h5 className="horizontal-rule-text fs-5">Transportation</h5>
          </div>

          {eventData.Transportations.map((transport, index) => (
            <div key={index} className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Transportation Type</label>
                <select
                  className="form-select"
                  value={transport.TransportationTypeId || ""}
                  onChange={(e) => handleTransportationChange(index, "TransportationTypeId", e.target.value)}
                >
                  <option value="">Select Transportation Type</option>
                  {transportationTypes.map((type) => (
                    <option key={type.transportationType1} value={type.transportationType1}>
                      {type.transportationType1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={transport.StartDate || ""}
                  onChange={(e) => handleTransportationChange(index, "StartDate", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={transport.EndDate || ""}
                  onChange={(e) => handleTransportationChange(index, "EndDate", e.target.value)}
                />
              </div>
            </div>
          ))}
        </>
      )}

      {/* IT Component Checkbox */}
      <div className="form-check mb-3">
        <input
          type="checkbox"
          id="HasIt"
          className="form-check-input"
          checked={eventData.HasIt === 1}
          onChange={handleItCheckboxChange}
        />
        <label className="form-check-label fs-6" htmlFor="HasIt">
          Requires IT Components
        </label>
      </div>

      {/* IT Component selection (Only shows when checked) */}
      {eventData.HasIt === 1 && itComponents.length > 0 && (
        <>
          <div className="horizontal-rule mb-3">
            <hr />
            <h5 className="horizontal-rule-text fs-5">IT Components</h5>
          </div>

          {eventData.ItComponents.map((itComp, index) => (
            <div key={index} className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">IT Component</label>
                <select
                  className="form-select"
                  value={itComp.ItcomponentId || ""}
                  onChange={(e) => handleItComponentChange(index, e.target.value)}
                >
                  <option value="">Select IT Component</option>
                  {itComponents.map((component) => (
                    <option key={component.itcomponentId} value={component.itcomponentId}>
                      {component.component}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default EventSelections;
