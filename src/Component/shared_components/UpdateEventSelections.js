import React, { useState, useEffect } from "react";
import axios from "axios";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";

const EventSelections = ({
  eventData,
  seteventData,
  setITChoice = { setITChoice },
  setTransportChoice = { setTransportChoice },
  setAccommodationChoice = { setAccommodationChoice },
}) => {
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
    seteventData((prevData) => ({
      ...prevData,
      hasAccomdation: isChecked ? 1 : 0,
      accommodations: isChecked ? [] : [],
    }));
  };

  // IT Components toggle
  const handleItComponentsCheckbox = (e) => {
    const isChecked = e.target.checked;
    seteventData((prevData) => ({
      ...prevData,
      hasIt: isChecked ? 1 : 0,
      ItComponents: isChecked ? [] : [],
    }));
  };

  // --- Change Handlers ---
  // Transportation: when a checkbox is toggled, add/remove a transportation object
  const handleAccommodatitonTypeCheckbox = (e) => {
    const { value, checked } = e.target;
    const roomTypeId = Number(value); // Ensure ID is a number

    seteventData((prevData) => {
      let updatedaccommodations = [...prevData.accommodations];

      if (checked) {
        // Add only if it doesn't already exist
        if (!updatedaccommodations.some((t) => t.roomTypeId === roomTypeId)) {
          updatedaccommodations.push({
            roomTypeId: roomTypeId,
            startDate: "",
            endDate: "",
            numOfRooms: "",
          });
        }
        setAccommodationChoice(true);
      } else {
        // Remove the item if unchecked
        updatedaccommodations = updatedaccommodations.filter(
          (t) => t.roomTypeId !== roomTypeId
        );
        setAccommodationChoice(false);
      }

      return { ...prevData, accommodations: updatedaccommodations };
    });
  };

  // Update fields (StartDate, EndDate, Quantity) for a transportation object
  const handleAcommodationChange = (index, field, value) => {
    const updatedaccommodations = eventData.accommodations.map((accomm, i) =>
      i === index ? { ...accomm, [field]: value } : accomm
    );
    seteventData({ ...eventData, accommodations: updatedaccommodations });
  };

  // Transportation: when a checkbox is toggled, add/remove a transportation object
  const handleTransportationTypeCheckbox = (e) => {
    const { value, checked } = e.target;
    const transportationTypeId = Number(value); // Ensure ID is a number

    seteventData((prevData) => {
      let updatedtransportations = [...prevData.transportations];

      if (checked) {
        // Add only if it doesn't already exist
        if (
          !updatedtransportations.some(
            (t) => t.transportationTypeId === transportationTypeId
          )
        ) {
          updatedtransportations.push({
            transportationTypeId: transportationTypeId,
            startDate: "",
            endDate: "",
            quantity: "",
          });
        }
        setTransportChoice(true);
      } else {
        // Remove the item if unchecked
        updatedtransportations = updatedtransportations.filter(
          (t) => t.transportationTypeId !== transportationTypeId
        );
        setTransportChoice(false);
      }

      return { ...prevData, transportations: updatedtransportations };
    });
  };

  // Update fields (StartDate, EndDate, Quantity) for a transportation object
  const handleTransportationChange = (index, field, value) => {
    const updatedtransportations = eventData.transportations.map(
      (transport, i) =>
        i === index ? { ...transport, [field]: value } : transport
    );
    seteventData({ ...eventData, transportations: updatedtransportations });
  };

  const handleItComponentCheckbox = (e) => {
    const { value, checked } = e.target;
    const itcomponentId = Number(value); // Ensure ID is a number

    seteventData((prevData) => {
      let updatedItComponents = [...prevData.itcomponentEvents];

      if (checked) {
        // Add only if it doesn't already exist
        if (
          !updatedItComponents.some(
            (item) => item.itcomponentId === itcomponentId
          )
        ) {
          updatedItComponents.push({ itcomponentId, Quantity: "" });
        }
        setITChoice(true);
      } else {
        // Remove the item if unchecked
        updatedItComponents = updatedItComponents.filter(
          (item) => item.itcomponentId !== itcomponentId
        );
        setITChoice(false);
      }
      return { ...prevData, itcomponentEvents: updatedItComponents };
    });
  };
  // IT Components toggle
  const handleBudgetComponentsCheckbox = (e) => {
    const isChecked = e.target.checked;
    seteventData((prevData) => ({
      ...prevData,
      hasBudget: isChecked ? 1 : 0,
      // ItComponents: isChecked ? [] : [],
    }));
  };

  // IT Components toggle
  const handleMarcomComponentsCheckbox = (e) => {
    const isChecked = e.target.checked;
    seteventData((prevData) => ({
      ...prevData,
      hasMarcom: isChecked ? 1 : 0,
      // ItComponents: isChecked ? [] : [],
    }));
  };
  const handleItComponentQuantityChange = (itcomponentId, value) => {
    seteventData((prevData) => {
      const updatedItComponents = prevData.itcomponentEvents.map((item) =>
        item.itcomponentId === itcomponentId
          ? { ...item, quantity: value }
          : item
      );

      return { ...prevData, itcomponentEvents: updatedItComponents };
    });
  };

  return (
    <div className="container-fluid">
      <div
        className="card shadow-sm px-3 py-2 w-100 mx-auto"
        // style={{ backgroundColor: "#f8f9fa" }}
      >
        {/* Budget Components Section */}
        <div
          className="card section-card p-2 mt-3"
          // style={{ backgroundColor: "#f1f3f5" }}
        >
          <div className="form-check text-left">
            <input
              type="checkbox"
              id="hasBudget"
              className="form-check-input"
              checked={eventData.hasBudget === 1}
              style={{ fontSize: "0.7rem", textAlign: "left" }}
              onChange={handleBudgetComponentsCheckbox}
            />
            <label
              className="form-check-label font-weight-bold text-dark"
              htmlFor="hasBudget"
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
                      seteventData({
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
        {/* Marcom Components Section */}
        <div
          className="card section-card p-2 mt-3"
          // style={{ backgroundColor: "#f1f3f5" }}
        >
          <div className="form-check text-left">
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
          className="card section-card p-2 mt-3"
          // style={{ backgroundColor: "#f1f3f5" }}
        >
          <div className="form-check text-left">
            <input
              type="checkbox"
              id="hasIt"
              style={{ fontSize: "0.7rem" }}
              className="form-check-input me-2"
              checked={eventData.hasIt === 1}
              onChange={handleItComponentsCheckbox}
            />
            <label
              className="form-check-label font-weight-bold text-dark"
              htmlFor="hasIt"
              style={{ fontSize: "0.7rem" }}
            >
              IT (If needed)
            </label>
          </div>

          {eventData.hasIt === 1 && (
            <div className="mt-3">
              <div className="row g-2">
                {itComponentsList?.map((component) => (
                  <div key={component.itcomponentId} className="col-6 col-md-3">
                    <div className="form-check d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`itcomponent-${component.itcomponentId}`}
                        value={component.itcomponentId}
                        checked={eventData?.itcomponentEvents?.some(
                          (item) =>
                            item.itcomponentId === component.itcomponentId
                        )}
                        onChange={handleItComponentCheckbox}
                      />
                      <label
                        className="form-check-label text-dark fw-semibold text-truncate"
                        htmlFor={`itcomponent-${component.itcomponentId}`}
                        style={{
                          fontSize: "0.7rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {component.component}
                      </label>
                    </div>

                    {eventData?.itcomponentEvents?.some(
                      (item) => item.itcomponentId === component.itcomponentId
                    ) && (
                      <div className="mt-2 d-flex align-items-center gap-2">
                        <input
                          type="number"
                          className="form-control form-control-sm mt-2 rounded shadow-sm"
                          style={{
                            maxWidth: "200px",
                            fontSize: "0.7rem",
                          }}
                          placeholder="Number"
                          required
                          value={
                            eventData.itcomponentEvents.find(
                              (item) =>
                                item.itcomponentId === component.itcomponentId
                            )?.quantity || ""
                          }
                          onChange={(e) =>
                            handleItComponentQuantityChange(
                              component.itcomponentId,
                              e.target.value
                            )
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
        {/* Transportation Section */}
        <div className="card section-card p-2 mt-3">
          <div className="form-check text-left">
            <input
              type="checkbox"
              id="hasTransportation"
              className="form-check-input me-2"
              checked={eventData.hasTransportation === 1}
              onChange={() =>
                seteventData((prev) => ({
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
              Transportation (If needed)
            </label>
          </div>

          {eventData.hasTransportation === 1 && (
            <div className="mt-3">
              {/* Transportation Type Selection */}
              <div className="row g-2">
                {transportationTypes.map((type) => (
                  <div
                    key={type.transportationTypeId}
                    className="col-12 col-md-4"
                  >
                    <div className="form-check d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`transportation-${type.transportationTypeId}`}
                        value={type.transportationTypeId}
                        checked={eventData?.transportations?.some(
                          (t) =>
                            t.transportationTypeId === type.transportationTypeId
                        )}
                        onChange={handleTransportationTypeCheckbox}
                      />
                      <label
                        className="form-check-label text-dark fw-semibold text-truncate"
                        htmlFor={`transportation-${type.transportationTypeId}`}
                        style={{
                          fontSize: "0.7rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {type.transportationType1}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transportation Details (All Inputs on the Same Row) */}
              {eventData?.transportations?.map((transport, index) => (
                <div
                  key={index}
                  className="row g-2 mt-3 d-flex align-items-center"
                >
                  <div className="col-3">
                    <label
                      className="form-label fw-semibold text-dark text-truncate"
                      style={{
                        fontSize: "0.7rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {
                        transportationTypes.find(
                          (item) =>
                            item.transportationTypeId ===
                            transport.transportationTypeId
                        )?.transportationType1
                      }
                    </label>
                  </div>
                  <div className="col-3">
                    <input
                      type="date"
                      className="form-control form-control-sm rounded shadow-sm"
                      required
                      value={transport.startDate?.split("T")[0] || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-3">
                    <input
                      type="date"
                      className="form-control form-control-sm rounded shadow-sm"
                      required
                      value={transport.endDate?.split("T")[0] || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-3">
                    <input
                      type="number"
                      className="form-control form-control-sm rounded shadow-sm"
                      required
                      placeholder="Number"
                      style={{ fontSize: "0.7rem" }}
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
        <div className="card section-card p-2 mt-3">
          <div className="form-check text-left">
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
              Accommodation (If needed)
            </label>
          </div>

          {eventData.hasAccomdation === 1 && (
            <div className="mt-3">
              {/* Room Type Selection */}
              <div className="row g-2">
                {roomTypes.map((type) => (
                  <div key={type.roomTypeId} className="col-12 col-md-4">
                    <div className="form-check d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`Rooms-${type.roomTypeId}`}
                        value={type.roomTypeId}
                        checked={eventData?.accommodations?.some(
                          (t) => t.roomTypeId === type.roomTypeId
                        )}
                        onChange={handleAccommodatitonTypeCheckbox}
                      />
                      <label
                        className="form-check-label text-dark fw-semibold text-truncate"
                        htmlFor={`Rooms-${type.roomTypeId}`}
                        style={{
                          fontSize: "0.7rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {type.roomTypeName}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Accommodation Details (All Inputs on the Same Row) */}
              {eventData.accommodations.map((accom, index) => (
                <div
                  key={index}
                  className="row g-2 mt-3 d-flex align-items-center"
                >
                  <div className="col-3">
                    <label
                      className="form-label fw-semibold text-dark text-truncate"
                      style={{
                        fontSize: "0.7rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {
                        roomTypes.find(
                          (room) => room.roomTypeId === accom.roomTypeId
                        )?.roomTypeName
                      }
                    </label>
                  </div>
                  <div className="col-3">
                    <input
                      type="date"
                      className="form-control form-control-sm rounded shadow-sm"
                      required
                      value={accom.startDate?.split("T")[0] || ""}
                      onChange={(e) =>
                        handleAcommodationChange(
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-3">
                    <input
                      type="date"
                      className="form-control form-control-sm rounded shadow-sm"
                      required
                      value={accom.endDate?.split("T")[0] || ""}
                      onChange={(e) =>
                        handleAcommodationChange(
                          index,
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-3">
                    <input
                      type="number"
                      className="form-control form-control-sm rounded shadow-sm"
                      required
                      placeholder="No. of rooms"
                      value={accom.numOfRooms || ""}
                      onChange={(e) =>
                        handleAcommodationChange(
                          index,
                          "numOfRooms",
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
      </div>
    </div>
  );
};

export default EventSelections;
