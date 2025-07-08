import React, { useState, useEffect } from "react";
import { TextValidator } from "react-material-ui-form-validator";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import Select from "react-select";

const EventBuildingVenueListInfo = ({ index, eventData, seteventData }) => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [selectedVenueTypeId, setselectedVenueTypeId] = useState(null);
  const [venueTypes, setVenueTypes] = useState([]);
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
  const getVenuesTypes = async (buildingId) => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-venuse-types?buildinId=${buildingId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setVenueTypes(response.data.data);
      console.log("buildingID", buildingId);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  // Get List of Venues for Selected Building
  const getVenues = async (buildingId, venueId) => {
    try {
      const response = await axios.get(
        `${URL.BASE_URL}/api/EventEntity/get-venuse?buildinId=${buildingId}&venueTypeId=${venueId}`,
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
    <div
      className="card shadow-sm px-3 py-2 w-100 mx-auto"
      // style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="row align-items-center">
        {/* Building Select */}
        <div className="col-md-5">
          <select
            className="form-control custom-select custom-select-lg"
            style={{ fontSize: "0.7rem", backgroundColor: "#ffff" }}
            onChange={(e) => {
              const buildingId = e.target.value;
              setSelectedBuildingId(buildingId);
              setselectedVenueTypeId(null);
              getVenuesTypes(buildingId);
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
          <div className="col-md-3 mt-3 mt-md-0">
            <select
              className="form-control custom-select custom-select-lg"
              style={{ fontSize: "0.7rem", backgroundColor: "#ffff" }}
              onChange={(e) => {
                const venueId = e.target.value;
                setselectedVenueTypeId(venueId);
                getVenues(selectedBuildingId, venueId);
              }}
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
            <select
              className="form-control custom-select custom-select-lg"
              style={{
                fontSize: "0.7rem",
                backgroundColor: "#ffff",
              }}
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
              <option value="">Select Venue Type</option>
              {venues.map((venue) => (
                <option key={venue.venueId} value={venue.venueId}>
                  {venue.venueName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Delete Button */}
        <div className="col-md-1">
          <button
            type="button"
            className="btn btn-outline-danger rounded-circle"
            // style={{ width: "42px", height: "42px" }}
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
