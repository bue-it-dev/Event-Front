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
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-rooms`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setRoomTypes(response.data.data);
      // console.log("Rooms", roomTypes[0].roomTypeName);
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
      hasAccomdation: isChecked ? 1 : 0,
      Accommodations: isChecked ? [] : [],
    }));
  };

  // Transportation toggle
  const handleTransportationCheckbox = (e) => {
    const isChecked = e.target.checked;
    setEventData((prevData) => ({
      ...prevData,
      hasTransportation: isChecked ? 1 : 0,
      Transportations: isChecked ? [] : [],
    }));
  };

  // IT Components toggle
  const handleItComponentsCheckbox = (e) => {
    const isChecked = e.target.checked;
    setEventData((prevData) => ({
      ...prevData,
      hasIt: isChecked ? 1 : 0,
      ItComponents: isChecked ? [] : [],
    }));
  };

  // IT Components toggle
  const handleBudgetComponentsCheckbox = (e) => {
    const isChecked = e.target.checked;
    setEventData((prevData) => ({
      ...prevData,
      hasBudget: isChecked ? 1 : 0,
      // ItComponents: isChecked ? [] : [],
    }));
  };

  // IT Components toggle
  const handleMarcomComponentsCheckbox = (e) => {
    const isChecked = e.target.checked;
    setEventData((prevData) => ({
      ...prevData,
      hasMarcom: isChecked ? 1 : 0,
      // ItComponents: isChecked ? [] : [],
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
        if (
          !updatedAccommodations.find((item) => item.roomTypeId === roomTypeId)
        ) {
          updatedAccommodations.push({ roomTypeId, Quantity: "" });
        }
      } else {
        updatedAccommodations = updatedAccommodations.filter(
          (item) => item.roomTypeId !== roomTypeId
        );
      }
      return { ...prevData, Accommodations: updatedAccommodations };
    });
  };

  // Update quantity for a specific accommodation (room type)
  const handleAccommodationQuantityChange = (roomTypeId, value) => {
    setEventData((prevData) => {
      const updatedAccommodations = prevData.Accommodations.map((item) =>
        item.roomTypeId === roomTypeId ? { ...item, Quantity: value } : item
      );
      return { ...prevData, Accommodations: updatedAccommodations };
    });
  };

  // Transportation: when a checkbox is toggled, add/remove a transportation object
  const handleAccommodatitonTypeCheckbox = (e) => {
    const { value, checked } = e.target;
    const roomTypeId = Number(value); // Ensure ID is a number

    setEventData((prevData) => {
      let updatedAccommodations = [...prevData.Accommodations];

      if (checked) {
        // Add only if it doesn't already exist
        if (!updatedAccommodations.some((t) => t.roomTypeId === roomTypeId)) {
          updatedAccommodations.push({
            roomTypeId: roomTypeId,
            startDate: "",
            endDate: "",
            numOfRooms: "",
          });
        }
      } else {
        // Remove the item if unchecked
        updatedAccommodations = updatedAccommodations.filter(
          (t) => t.roomTypeId !== roomTypeId
        );
      }

      return { ...prevData, Accommodations: updatedAccommodations };
    });
  };

  // Update fields (StartDate, EndDate, Quantity) for a transportation object
  const handleAcommodationChange = (index, field, value) => {
    const updatedAccommodations = eventData.Accommodations.map((accomm, i) =>
      i === index ? { ...accomm, [field]: value } : accomm
    );
    setEventData({ ...eventData, Accommodations: updatedAccommodations });
  };

  // Transportation: when a checkbox is toggled, add/remove a transportation object
  const handleTransportationTypeCheckbox = (e) => {
    const { value, checked } = e.target;
    const transportationTypeId = Number(value); // Ensure ID is a number

    setEventData((prevData) => {
      let updatedTransportations = [...prevData.Transportations];

      if (checked) {
        // Add only if it doesn't already exist
        if (
          !updatedTransportations.some(
            (t) => t.TransportationTypeId === transportationTypeId
          )
        ) {
          updatedTransportations.push({
            TransportationTypeId: transportationTypeId,
            startDate: "",
            endDate: "",
            quantity: "",
          });
        }
      } else {
        // Remove the item if unchecked
        updatedTransportations = updatedTransportations.filter(
          (t) => t.TransportationTypeId !== transportationTypeId
        );
      }

      return { ...prevData, Transportations: updatedTransportations };
    });
  };

  // Update fields (StartDate, EndDate, Quantity) for a transportation object
  const handleTransportationChange = (index, field, value) => {
    const updatedTransportations = eventData.Transportations.map(
      (transport, i) =>
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

      return { ...prevData, ItcomponentEvents: updatedItComponents };
    });
  };

  const handleItComponentQuantityChange = (itcomponentId, value) => {
    setEventData((prevData) => {
      const updatedItComponents = prevData.ItcomponentEvents.map((item) =>
        item.itcomponentId === itcomponentId
          ? { ...item, Quantity: value }
          : item
      );

      return { ...prevData, ItcomponentEvents: updatedItComponents };
    });
  };

  return (
    <div className="container-fluid">
      <div
        className="card shadow-lg px-4 py-2 w-100 mx-auto"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        {/* IT Components Section */}
        <div
          className="card shadow-sm p-3 mt-3"
          style={{ backgroundColor: "#f1f3f5" }}
        >
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              id="hasBudget"
              className="form-check-input me-2"
              checked={eventData.hasBudget === 1}
              onChange={handleBudgetComponentsCheckbox}
            />
            <label
              className="form-check-label font-weight-bold text-dark"
              htmlFor="hasIt"
              style={{ fontSize: "0.7rem" }}
            >
              Budget (if needed)
            </label>
          </div>

          {eventData.hasBudget === 1 && (
            <div className="mt-2">
              <>
                <style>
                  {`
                  #budgetEstimatedCost::placeholder {
                    text-align: left;
                  }
                `}
                </style>

                <div
                  className="col-lg-6"
                  style={{
                    fontSize: "0.7rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="number"
                    id="budgetEstimatedCost"
                    style={{ fontSize: "0.7rem" }}
                    value={
                      eventData.budgetEstimatedCost === 0
                        ? ""
                        : eventData.budgetEstimatedCost
                    }
                    required
                    className="form-control form-control-lg w-100"
                    placeholder="Enter event estimated cost"
                    onChange={(e) => {
                      setEventData({
                        ...eventData,
                        budgetEstimatedCost:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      });
                    }}
                  />
                </div>
              </>
            </div>
          )}
        </div>
        {/* IT Components Section */}
        <div
          className="card shadow-sm p-3 mt-3"
          style={{ backgroundColor: "#f1f3f5" }}
        >
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              id="hasMarcom"
              className="form-check-input me-2"
              checked={eventData.hasMarcom === 1}
              onChange={handleMarcomComponentsCheckbox}
            />
            <label
              className="form-check-label font-weight-bold text-dark"
              htmlFor="hasIt"
              style={{ fontSize: "0.7rem" }}
            >
              Marcom (if needed)
            </label>
          </div>
        </div>
        {/* IT Components Section */}
        <div
          className="card shadow-sm p-3 mt-3"
          style={{ backgroundColor: "#f1f3f5" }}
        >
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              id="hasIt"
              className="form-check-input me-2"
              checked={eventData.hasIt === 1}
              onChange={handleItComponentsCheckbox}
            />
            <label
              className="form-check-label font-weight-bold text-dark"
              htmlFor="hasIt"
              style={{ fontSize: "0.7rem" }}
            >
              IT (if needed)
            </label>
          </div>

          {eventData.hasIt === 1 && (
            <div className="mt-3">
              <div className="row g-2">
                {itComponentsList.map((component) => (
                  <div key={component.itcomponentId} className="col-6 col-md-3">
                    <div className="form-check d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`itcomponent-${component.itcomponentId}`}
                        value={component.itcomponentId}
                        checked={eventData.ItcomponentEvents.some(
                          (item) =>
                            item.itcomponentId === component.itcomponentId
                        )}
                        onChange={handleItComponentCheckbox}
                      />
                      <label
                        className="form-check-label text-dark fw-semibold text-truncate"
                        htmlFor={`itcomponent-${component.itcomponentId}`}
                        style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                      >
                        {component.component}
                      </label>
                    </div>
                    {eventData.ItcomponentEvents.some(
                      (item) => item.itcomponentId === component.itcomponentId
                    ) && (
                      <>
                        <input
                          // id="ITQuantity"
                          type="number"
                          className="form-control form-control-sm mt-2 rounded shadow-sm"
                          placeholder="Number"
                          style={{ textAlign: "left", fontSize: "0.7rem" }}
                          value={
                            eventData.ItcomponentEvents.find(
                              (item) =>
                                item.itcomponentId === component.itcomponentId
                            )?.Quantity || ""
                          }
                          onChange={(e) =>
                            handleItComponentQuantityChange(
                              component.itcomponentId,
                              e.target.value
                            )
                          }
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Transportation Section */}
        <div
          className="card shadow-sm p-3 mt-3"
          style={{ backgroundColor: "#f1f3f5" }}
        >
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              id="hasTransportation"
              className="form-check-input me-2"
              checked={eventData.hasTransportation === 1}
              onChange={() =>
                setEventData((prev) => ({
                  ...prev,
                  hasTransportation: prev.hasTransportation === 1 ? 0 : 1, // Toggle state
                }))
              }
            />
            <label
              className="form-check-label font-weight-bold text-dark"
              htmlFor="hasTransportation"
              style={{ fontSize: "0.7rem" }}
            >
              Transportation (if needed)
            </label>
          </div>

          {eventData.hasTransportation === 1 && (
            <div className="mt-3">
              {/* Transportation Type Selection */}
              <div className="row g-2">
                {transportationTypes.map((type) => (
                  <div
                    key={type.transportationTypeId}
                    className="col-6 col-md-3"
                  >
                    <div className="form-check d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`transportation-${type.transportationTypeId}`}
                        value={type.transportationTypeId}
                        checked={eventData.Transportations.some(
                          (t) =>
                            t.TransportationTypeId === type.transportationTypeId
                        )}
                        onChange={handleTransportationTypeCheckbox}
                      />
                      <label
                        className="form-check-label text-dark fw-semibold text-truncate"
                        htmlFor={`transportation-${type.transportationTypeId}`}
                        style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                      >
                        {type.transportationType1}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transportation Details */}
              {eventData.Transportations.map((transport, index) => (
                <div key={index} className="row g-2 mt-3 align-items-center">
                  <div className="col-6 col-md-3">
                    <label
                      className="form-label fw-semibold text-dark text-truncate"
                      style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                    >
                      {
                        transportationTypes.find(
                          (item) =>
                            item.transportationTypeId ===
                            transport.TransportationTypeId
                        )?.transportationType1
                      }
                    </label>
                  </div>
                  <div className="col-6 col-md-3">
                    <input
                      type="date"
                      style={{ textAlign: "left", fontSize: "0.7rem" }}
                      className="form-control form-control-sm rounded shadow-sm"
                      value={transport.startDate || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <input
                      type="date"
                      style={{ textAlign: "left", fontSize: "0.7rem" }}
                      className="form-control form-control-sm rounded shadow-sm"
                      value={transport.endDate || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <input
                      type="number"
                      className="form-control form-control-sm rounded shadow-sm"
                      style={{ textAlign: "left", fontSize: "0.7rem" }}
                      placeholder="Number"
                      value={transport.quantity || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Accommodation Section */}
        <div
          className="card shadow-sm p-3 mt-3"
          style={{ backgroundColor: "#f1f3f5" }}
        >
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              id="hasAccomdation"
              className="form-check-input me-2"
              checked={eventData.hasAccomdation === 1}
              onChange={handleAccommodationCheckbox}
            />
            <label
              className="form-check-label font-weight-bold text-dark"
              htmlFor="hasAccomdation"
              style={{ fontSize: "0.7rem" }}
            >
              Accommodation (If Needed)
            </label>
          </div>

          {eventData.hasAccomdation === 1 && (
            <div className="mt-3">
              {/* Room Type Selection */}
              <div className="row g-2">
                {roomTypes.map((type) => (
                  <div key={type.roomTypeId} className="col-6 col-md-4">
                    <div className="form-check d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`Rooms-${type.roomTypeId}`}
                        value={type.roomTypeId}
                        checked={eventData.Accommodations.some(
                          (t) => t.roomTypeId === type.roomTypeId
                        )}
                        onChange={handleAccommodatitonTypeCheckbox}
                      />
                      <label
                        className="form-check-label text-dark fw-semibold text-truncate"
                        htmlFor={`Rooms-${type.roomTypeId}`}
                        style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                      >
                        {type.roomTypeName}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Accommodation Details */}
              {eventData.Accommodations.map((accom, index) => (
                <div key={index} className="row g-2 mt-3 align-items-center">
                  <div className="col-6 col-md-3">
                    <label
                      className="form-label fw-semibold text-dark text-truncate"
                      style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                    >
                      {
                        roomTypes.find(
                          (room) => room.roomTypeId === accom.roomTypeId
                        )?.roomTypeName
                      }
                    </label>
                  </div>
                  <div className="col-6 col-md-3">
                    <input
                      type="date"
                      style={{ textAlign: "left", fontSize: "0.7rem" }}
                      className="form-control form-control-sm rounded shadow-sm"
                      value={accom.startDate || ""}
                      onChange={(e) =>
                        handleAcommodationChange(
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <input
                      type="date"
                      className="form-control form-control-sm rounded shadow-sm"
                      style={{ textAlign: "left", fontSize: "0.7rem" }}
                      value={accom.endDate || ""}
                      onChange={(e) =>
                        handleAcommodationChange(
                          index,
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <>
                      <style>
                        {`
                        #numOfRooms::placeholder {
                          text-align: left;
                        }
                      `}
                      </style>
                      <input
                        id="numOfRooms"
                        type="number"
                        className="form-control form-control-sm rounded shadow-sm"
                        placeholder="No. of rooms"
                        style={{ textAlign: "left", fontSize: "0.7rem" }}
                        value={accom.numOfRooms || ""}
                        onChange={(e) =>
                          handleAcommodationChange(
                            index,
                            "numOfRooms",
                            e.target.value
                          )
                        }
                      />
                    </>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventSelections;
