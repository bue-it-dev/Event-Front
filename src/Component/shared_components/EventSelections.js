import React, { useState, useEffect } from "react";
import axios from "axios";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";

const EventSelections = ({ eventData, setEventData }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [transportationTypes, setTransportationTypes] = useState([]);
  const [itComponentsList, setItComponentsList] = useState([]);

  // Fetch room types
  const getRoomTypes = async () => {
    try {
      const response = await axios.get(`${URL.BASE_URL}/api/EventEntity/get-rooms`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setRoomTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

  // Fetch transportation types
  const getTransportationTypes = async () => {
    try {
      const response = await axios.get(`${URL.BASE_URL}/api/EventEntity/get-transportationType`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setTransportationTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching transportation types:", error);
    }
  };

  // Fetch IT components
  const getItComponents = async () => {
    try {
      const response = await axios.get(`${URL.BASE_URL}/api/EventEntity/get-itComponents`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setItComponentsList(response.data.data);

    } catch (error) {
      console.error("Error fetching IT components:", error);
    }
  };

  // Fetch all data when component mounts
  useEffect(() => {
    getRoomTypes();
    getTransportationTypes();
    getItComponents();
  }, []);

  // --- Toggle Handlers ---

  // Accommodation toggle
  const handleAccommodationCheckbox = (e) => {
    const isChecked = e.target.checked;
    setEventData((prevData) => ({
      ...prevData,
      HasAccomdation: isChecked ? 1 : 0,
      Accommodations: isChecked ? [] : [],
    }));
  };

  // Transportation toggle
  const handleTransportationCheckbox = (e) => {
    const isChecked = e.target.checked;
    setEventData((prevData) => ({
      ...prevData,
      HasTransportation: isChecked ? 1 : 0,
      Transportations: isChecked ? [] : [],
    }));
  };

  // IT Components toggle
  const handleItComponentsCheckbox = (e) => {
    const isChecked = e.target.checked;
    setEventData((prevData) => ({
      ...prevData,
      HasIt: isChecked ? 1 : 0,
      ItComponents: isChecked ? [] : [],
    }));
  };

  // --- Change Handlers ---

  // Accommodation: add or remove a room type with quantity
  const handleAccommodationChange = (e, roomTypeId) => {
    const isChecked = e.target.checked;
    setEventData((prevData) => {
      let updatedAccommodations = [...prevData.Accommodations];
      if (isChecked) {
        // If not already added, add a new object with empty quantity
        if (!updatedAccommodations.find(item => item.roomTypeId === roomTypeId)) {
          updatedAccommodations.push({ roomTypeId, Quantity: "" });
        }
      } else {
        updatedAccommodations = updatedAccommodations.filter(item => item.roomTypeId !== roomTypeId);
      }
      return { ...prevData, Accommodations: updatedAccommodations };
    });
  };

  // Update quantity for a specific accommodation (room type)
  const handleAccommodationQuantityChange = (roomTypeId, value) => {
    setEventData((prevData) => {
      const updatedAccommodations = prevData.Accommodations.map(item =>
        item.roomTypeId === roomTypeId ? { ...item, Quantity: value } : item
      );
      return { ...prevData, Accommodations: updatedAccommodations };
    });
  };

  // Transportation: when a checkbox is toggled, add/remove a transportation object
  const handleTransportationTypeCheckbox = (e) => {
    const { value, checked } = e.target;
    const transportationTypeId = Number(value); // Ensure ID is a number

    setEventData((prevData) => {
      let updatedTransportations = [...prevData.Transportations];

      if (checked) {
        // Add only if it doesn't already exist
        if (!updatedTransportations.some(t => t.TransportationTypeId === transportationTypeId)) {
          updatedTransportations.push({ TransportationTypeId: transportationTypeId, StartDate: "", EndDate: "", Quantity: "" });
        }
      } else {
        // Remove the item if unchecked
        updatedTransportations = updatedTransportations.filter(t => t.TransportationTypeId !== transportationTypeId);
      }

      return { ...prevData, Transportations: updatedTransportations };
    });
};


  // Update fields (StartDate, EndDate, Quantity) for a transportation object
  const handleTransportationChange = (index, field, value) => {
    const updatedTransportations = eventData.Transportations.map((transport, i) =>
      i === index ? { ...transport, [field]: value } : transport
    );
    setEventData({ ...eventData, Transportations: updatedTransportations });
  };

  const handleItComponentCheckbox = (e) => {
    const { value, checked } = e.target;
    const itcomponentId = Number(value); // Ensure ID is a number

    setEventData((prevData) => {
      let updatedItComponents = [...prevData.ItcomponentEvents];

      if (checked) {
        // Add only if it doesn't already exist
        if (!updatedItComponents.some(item => item.itcomponentId === itcomponentId)) {
          updatedItComponents.push({ itcomponentId, Quantity: "" });
        }
      } else {
        // Remove the item if unchecked
        updatedItComponents = updatedItComponents.filter(item => item.itcomponentId !== itcomponentId);
      }

      return { ...prevData, ItcomponentEvents: updatedItComponents };
    });
  };


  const handleItComponentQuantityChange = (itcomponentId, value) => {
    setEventData((prevData) => {
      const updatedItComponents = prevData.ItcomponentEvents.map(item =>
        item.itcomponentId === itcomponentId ? { ...item, Quantity: value } : item
      );

      return { ...prevData, ItcomponentEvents: updatedItComponents };
    });
  };

  return (
    <div>
      {/* Accommodation Section */}
      <div className="form-check mb-3">
        <input
          type="checkbox"
          id="HasAccomdation"
          className="form-check-input"
          checked={eventData.HasAccomdation === 1}
          onChange={handleAccommodationCheckbox}
        />
        <label className="form-check-label fs-6" htmlFor="HasAccomdation">
          Requires Accommodation
        </label>
      </div>
      {eventData.HasAccomdation === 1 && (
        <div>
          <div className="horizontal-rule mb-3">
            <hr />
            <h5 className="horizontal-rule-text fs-5">Accommodation</h5>
          </div>
          <div className="row mb-3">
            {roomTypes.map((room) => (
              <div key={room.roomTypeId} className="col-md-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`roomType-${room.roomTypeId}`}
                    value={room.roomTypeId}
                    checked={
                      eventData.Accommodations.some(item => item.roomTypeId === room.roomTypeId)
                    }
                    onChange={(e) => handleAccommodationChange(e, room.roomTypeId)}
                  />
                  <label className="form-check-label" htmlFor={`roomType-${room.roomTypeId}`}>
                    {room.roomTypeName}
                  </label>
                </div>
                {eventData.Accommodations.some(item => item.roomTypeId === room.roomTypeId) && (
                  <div className="mt-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Quantity"
                      value={
                        eventData.Accommodations.find(item => item.roomTypeId === room.roomTypeId)
                          ?.Quantity || ""
                      }
                      onChange={(e) =>
                        handleAccommodationQuantityChange(room.roomTypeId, e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transportation Section */}
      <div className="form-check mb-3">
        <input
          type="checkbox"
          id="HasTransportation"
          className="form-check-input"
          checked={eventData.HasTransportation === 1}
          onChange={handleTransportationCheckbox}
        />
        <label className="form-check-label fs-6" htmlFor="HasTransportation">
          Requires Transportation
        </label>
   <div>
  {eventData.HasTransportation === 1 && (
    <div>
      <div className="horizontal-rule mb-3">
        <hr />
        <h5 className="horizontal-rule-text fs-5">Transportation</h5>
      </div>
      
      {/* Transportation Type Checkboxes */}
      <div className="row mb-3">
        {transportationTypes.map((type) => (
          <div key={type.transportationTypeId} className="col-md-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`transportation-${type.transportationTypeId}`}
                value={type.transportationTypeId} // FIXED: Correct value assignment
                checked={eventData.Transportations.some(
                  (t) => t.TransportationTypeId === type.transportationTypeId // FIXED: Correct comparison
                )}
                onChange={handleTransportationTypeCheckbox}
              />
              <label
                className="form-check-label"
                htmlFor={`transportation-${type.transportationTypeId}`} 
              >
                {type.transportationType1}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

          {/* For each selected transportation type, display date fields and a quantity input */}
          {eventData.Transportations.map((transport, index) => (
            <div key={index} className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">
                  Type: {transport.TransportationTypeId}
                </label>
              </div>
              <div className="col-md-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={transport.StartDate || ""}
                  onChange={(e) =>
                    handleTransportationChange(index, "StartDate", e.target.value)
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={transport.EndDate || ""}
                  onChange={(e) =>
                    handleTransportationChange(index, "EndDate", e.target.value)
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={transport.Quantity || ""}
                  onChange={(e) =>
                    handleTransportationChange(index, "Quantity", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

      {/* IT Components Section */}
      <div className="form-check mb-3">
        <input
          type="checkbox"
          id="HasIt"
          className="form-check-input"
          checked={eventData.HasIt === 1}
          onChange={handleItComponentsCheckbox}
        />
        <label className="form-check-label fs-6" htmlFor="HasIt">
          Requires IT Components
        </label>
      </div>
      {eventData.HasIt === 1 && (
        <div>
          <div className="horizontal-rule mb-3">
            <hr />
            <h5 className="horizontal-rule-text fs-5">IT Components</h5>
          </div>
          <div className="row mb-3">
            {itComponentsList.map((component) => (
              <div key={component.itcomponentId} className="col-md-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`itcomponent-${component.itcomponentId}`}
                    value={component.itcomponentId}
                    checked={eventData.ItcomponentEvents.some(item => item.itcomponentId === component.itcomponentId)}
                    onChange={handleItComponentCheckbox}
                  />
                  <label className="form-check-label" htmlFor={`itcomponent-${component.itcomponentId}`}>
                    {component.component}
                  </label>
                </div>
                {eventData.ItcomponentEvents.some(item => item.itcomponentId === component.itcomponentId) && (
                  <div className="mt-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Quantity"
                      value={
                        eventData.ItcomponentEvents.find(item => item.itcomponentId === component.itcomponentId)?.Quantity || ""
                      }
                      onChange={(e) =>
                        handleItComponentQuantityChange(component.itcomponentId, e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};

export default EventSelections;
