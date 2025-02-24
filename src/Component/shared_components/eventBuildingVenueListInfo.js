import React, { useState, useEffect } from "react";
import { TextValidator } from "react-material-ui-form-validator";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import Select from "react-select";

const EventBuildingVenueListInfo = ({ index, eventData, seteventData }) => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [venues, setVenues] = useState([]);

  // Get List of Buildings
  const Getbuildings = async () => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-buildings`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setBuildings(response.data.data);
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  // Get List of Venues for Selected Building
  const getVenues = async (buildingId) => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-venuse?buildinId=${buildingId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setVenues(response.data.data);
      console.log("buildingID", buildingId);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  useEffect(() => {
    Getbuildings();
  }, []);

  return (
    <div className="card shadow-sm p-3 mb-3">
      <div className="row align-items-center">
        {/* Building Select */}
        <div className="col-md-6">
          <label className="form-label font-weight-bold">Select Building</label>
          <select
            className="form-control custom-select custom-select-lg"
            onChange={(e) => {
              const buildingId = e.target.value;
              setSelectedBuildingId(buildingId);
              getVenues(buildingId);
            }}
            name="buildings"
            required
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
              onChange={(e) => {
                const venueId = e.target.value;
                seteventData((prev) => {
                  const updatedVenues = [...prev.BuildingVenues];
                  updatedVenues[index] = {
                    ...updatedVenues[index],
                    venueId,
                    eventId: prev.eventId,
                  };
                  return { ...prev, BuildingVenues: updatedVenues };
                });
              }}
              name="venues"
              required
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

        {/* Delete Button */}
        <div className="col-md-1 d-flex justify-content-center align-items-center mt-3 mt-md-0">
          <button
            type="button"
            className="btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: "42px", height: "42px" }}
            onClick={() => {
              seteventData((prev) => ({
                ...prev,
                BuildingVenues: prev.BuildingVenues.filter(
                  (_, i) => i !== index
                ),
              }));
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventBuildingVenueListInfo;
