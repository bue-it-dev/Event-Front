import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../Util/Authenticate";
import URL from "../Util/config";

const EventBuildingVenueListUpdate = ({ index, eventData, seteventData }) => {
  const [buildings, setBuildings] = useState([]);
  const [venueTypes, setvenueTypes] = useState([]);
  const [venues, setVenues] = useState([]);

  // ✅ Ensure buildingVenues exists in eventData
  useEffect(() => {
    if (!eventData.buildingVenues) {
      seteventData((prevState) => ({
        ...prevState,
        buildingVenues: [],
      }));
    }
  }, []);

  // ✅ Extract stored Building & Venue IDs
  const selectedBuildingId =
    eventData.buildingVenues?.[index]?.buildingId || "";
  const selectedVenueTypeId =
    eventData.buildingVenues?.[index]?.venueTypeId || "";
  const selectedVenueId = eventData.buildingVenues?.[index]?.venueId || "";

  // ✅ Fetch Buildings
  const fetchBuildings = async () => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-buildings`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setBuildings(response.data.data);
    } catch (error) {
      console.error("❌ Error fetching buildings:", error);
    }
  };

  // ✅ Fetch Venues for Selected Building
  const fetchVenueTypes = async (buildingId) => {
    if (!buildingId) return;
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-venuse-types?buildinId=${buildingId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setvenueTypes(response.data.data);
    } catch (error) {
      console.error("❌ Error fetching venues:", error);
    }
  };

  // ✅ Fetch Venues for Selected Building
  const fetchVenues = async (buildingId, venueId) => {
    if (!buildingId) return;
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-venuse?buildinId=${buildingId}&venueTypeId=${venueId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setVenues(response.data.data);
    } catch (error) {
      console.error("❌ Error fetching venues:", error);
    }
  };

  // ✅ Load Buildings & Venues on Page Load
  useEffect(() => {
    fetchBuildings();
  }, []);

  // ✅ Fetch venues when the selected building changes
  useEffect(() => {
    if (selectedBuildingId) {
      fetchVenueTypes(selectedBuildingId);
    }
    if (selectedVenueTypeId) {
      fetchVenues(selectedBuildingId, selectedVenueTypeId);
    }
  }, [selectedBuildingId]);

  // ✅ Handle Building Change
  const handleBuildingChange = (e) => {
    const buildingId = Number(e.target.value);

    seteventData((prevState) => {
      const updatedBuildingVenues = [...(prevState.buildingVenues || [])];

      updatedBuildingVenues[index] = {
        buildingId,
        venueTypeId: "", // Reset venueName when building changes
        venueId: "", // Reset venue when building changes
      };

      return { ...prevState, buildingVenues: updatedBuildingVenues };
    });

    fetchVenueTypes(buildingId);
  };
  // ✅ Handle Venue Change
  const handleVenueTypeChange = (e) => {
    const venueTypeId = e.target.value;

    seteventData((prevState) => {
      const updatedBuildingVenues = [...(prevState.buildingVenues || [])];

      updatedBuildingVenues[index] = {
        ...updatedBuildingVenues[index],
        venueTypeId,
      };

      return { ...prevState, buildingVenues: updatedBuildingVenues };
    });
    fetchVenues(selectedBuildingId, venueTypeId);
  };
  // ✅ Handle Venue Change
  const handleVenueChange = (e) => {
    const venueId = e.target.value;

    seteventData((prevState) => {
      const updatedBuildingVenues = [...(prevState.buildingVenues || [])];

      updatedBuildingVenues[index] = {
        ...updatedBuildingVenues[index],
        venueId,
      };

      return { ...prevState, buildingVenues: updatedBuildingVenues };
    });
  };

  return (
    <div
      className="card shadow-sm px-3 py-2 w-100 mx-auto"
      // style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="row align-items-center">
        {/* Building Select */}
        <div className="col-md-4">
          {/* <label className="form-label font-weight-bold">Select Building</label> */}
          <select
            className="form-control custom-select custom-select-lg"
            style={{ fontSize: "0.7rem", backgroundColor: "#ffff" }}
            value={selectedBuildingId}
            onChange={handleBuildingChange}
            name="buildings"
            required
          >
            <option value="">Select Building</option>
            {buildings.map((data) => (
              <option key={data.buildingId} value={data.buildingId}>
                {data.building}
              </option>
            ))}
          </select>
        </div>

        {/* Venue Select (Shown Only When Building is Selected) */}
        {selectedBuildingId && (
          <div className="col-md-4 mt-3 mt-md-0">
            {/* <label className="form-label font-weight-bold">Select Venue</label> */}
            <select
              className="form-control custom-select custom-select-lg"
              style={{ fontSize: "0.7rem", backgroundColor: "#ffff" }}
              value={selectedVenueTypeId}
              onChange={handleVenueTypeChange}
              name="venues"
              required
            >
              <option value="">Select Venue Type</option>
              {venueTypes.map((venue) => (
                <option key={venue.venueTypeId} value={venue.venueTypeId}>
                  {venue.venue}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedVenueTypeId && (
          <div className="col-md-3">
            {/* <label className="form-label font-weight-bold">Select Venue</label> */}
            <select
              className="form-control custom-select custom-select-lg"
              style={{ fontSize: "0.7rem", backgroundColor: "#ffff" }}
              value={selectedVenueId}
              onChange={handleVenueChange}
              name="venues"
              required
            >
              <option value="">Select Venue</option>
              {venues.map((venue) => (
                <option key={venue.venueId} value={venue.venueId}>
                  {venue.venueName}
                </option>
              ))}
            </select>
          </div>
        )}
        {eventData.confirmedAt == null ? (
          <>
            {/* Delete Button */}
            <div className="col-md-1">
              <button
                type="button"
                className="btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{
                  width: "24px", // ~1.5rem
                  height: "24px",
                  fontSize: "0.7rem",
                  borderRadius: "50%",
                  marginRight: "10px",
                  transition: "0.3s ease",
                  // backgroundColor: "#57636f",
                  padding: "0",
                }}
                onClick={() => {
                  seteventData((prev) => ({
                    ...prev,
                    buildingVenues: prev.buildingVenues.filter(
                      (_, i) => i !== index
                    ),
                  }));
                }}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EventBuildingVenueListUpdate;
