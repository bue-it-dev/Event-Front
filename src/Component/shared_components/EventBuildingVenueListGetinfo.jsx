import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../Util/Authenticate";
import URL from "../Util/config";

const EventBuildingVenueListGetinfo = ({ index, eventData, seteventData }) => {
  const [buildings, setBuildings] = useState([]);
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
  const fetchVenues = async (buildingId) => {
    if (!buildingId) return;
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-venuse?buildinId=${buildingId}`,
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
      fetchVenues(selectedBuildingId);
    }
  }, [selectedBuildingId]);

  // ✅ Handle Building Change
  const handleBuildingChange = (e) => {
    const buildingId = Number(e.target.value);

    seteventData((prevState) => {
      const updatedBuildingVenues = [...(prevState.buildingVenues || [])];

      updatedBuildingVenues[index] = {
        buildingId,
        venueId: "", // Reset venue when building changes
      };

      return { ...prevState, buildingVenues: updatedBuildingVenues };
    });

    fetchVenues(buildingId);
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
    <div className="card shadow-sm p-3 mb-3">
      <div className="row align-items-center">
        {/* Building Select */}
        <div className="col-md-6">
          <label className="form-label font-weight-bold">Select Building</label>
          <select
            className="form-control custom-select custom-select-lg"
            value={selectedBuildingId}
            onChange={handleBuildingChange}
            name="buildings"
            disabled
          >
            <option value="">Select building</option>
            {buildings.map((data) => (
              <option key={data.buildingId} value={data.buildingId}>
                {data.building}
              </option>
            ))}
          </select>
        </div>

        {/* Venue Select (Shown Only When Building is Selected) */}
        {selectedBuildingId && (
          <div className="col-md-5 mt-3 mt-md-0">
            <label className="form-label font-weight-bold">Select Venue</label>
            <select
              className="form-control custom-select custom-select-lg"
              value={selectedVenueId}
              onChange={handleVenueChange}
              name="venues"
              disabled
            >
              <option value="">Select venue</option>
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
            <div className="col-md-1 d-flex justify-content-center align-items-center mt-3 mt-md-0">
              <button
                type="button"
                className="btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: "42px", height: "42px" }}
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

export default EventBuildingVenueListGetinfo;
