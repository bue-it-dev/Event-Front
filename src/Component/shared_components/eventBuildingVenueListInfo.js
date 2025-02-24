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
    <div className="mt-3 flex-grow-1" style={{ gap: "1rem" }} key={index}>
      <div className="row">
        <div>
          <select
            className="form-select form-select-lg custom-select"
            onChange={(e) => {
              const buildingId = e.target.value;
              setSelectedBuildingId(buildingId);
              //   seteventData({
              //     ...eventData,
              //     BuildingVenues: buildingId,
              //   });
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

        {selectedBuildingId && (
          <div className="mt-4">
            <select
              className="form-select form-select-lg custom-select"
              onChange={(e) => {
                const venueId = e.target.value;

                seteventData((prev) => {
                  const updatedVenues = [...prev.BuildingVenues];
                  updatedVenues[index] = {
                    ...updatedVenues[index],
                    venueId, // Updating the correct venueId
                    eventId: prev.eventId, // Ensure eventId is preserved
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
        {/* Building Dropdown */}
        {/* <select
          className="form-select form-select-lg custom-select"
          onChange={(e) => {
            const buildingId = e.target.value;
            setSelectedBuildingId(buildingId);
            seteventData((prev) => {
              const updatedVenues = [...prev.BuildingVenues];
              updatedVenues[index] = { ...updatedVenues[index], buildingId };
              return { ...prev, BuildingVenues: updatedVenues };
            });
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
        <br />
        <br />
        {selectedBuildingId && (
          <select
            className="form-select form-select-lg custom-select"
            onChange={(e) => {
              const venueId = e.target.value;
              seteventData((prev) => {
                const updatedVenues = [...prev.BuildingVenues];
                updatedVenues[index] = { ...updatedVenues[index], venueId };
                return { ...prev, BuildingVenues: updatedVenues };
              });
            }}
            name="venues"
            required
          >
            <option value="">Select venue</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.venueName}
              </option>
            ))}
          </select>
        // )} */}
      </div>
      <br />
      {/* Delete Button */}
      <button
        type="button"
        className="btn btn-lg"
        style={{
          color: "darkred",
          borderRadius: "50%",
          padding: "10px",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          seteventData((prev) => ({
            ...prev,
            BuildingVenues: prev.BuildingVenues.filter((_, i) => i !== index),
          }));
        }}
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
};

export default EventBuildingVenueListInfo;
