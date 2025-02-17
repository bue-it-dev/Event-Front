import React from 'react';

const EventInfo = ({ eventData, setEventData }) => {
  return (
    <div className="container">
      <div className="row">
        {/* Event Title */}
        <div className="col-md-6 mb-4">
          <label htmlFor="EventTitle" className="form-label fs-6">
            Event Title
          </label>
          <input
            type="text"
            id="EventTitle"
            name="EventTitle"
            value={eventData.EventTitle}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[a-zA-Z ]*$/.test(value) && value.trim() !== "") {
                setEventData({ ...eventData, EventTitle: value });
              } else if (value === "") {
                setEventData({ ...eventData, EventTitle: value });
              }
            }}
            className="form-control form-control-lg"
            required
          />
        </div>

        {/* Number of Participants */}
        <div className="col-md-6 mb-4">
          <label htmlFor="NomParticipants" className="form-label fs-6">
            Number of Participants
          </label>
          <input
            type="number"
            id="NomParticipants"
            name="NomParticipants"
            value={eventData.NomParticipants || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setEventData({ ...eventData, NomParticipants: value ? parseInt(value, 10) : "" });
              }
            }}
            className="form-control form-control-lg"
            min="1"
          />
        </div>

        {/* Event Start Date */}
        <div className="col-md-6 mb-4">
          <label htmlFor="EventStartDate" className="form-label fs-6">
            Event Start Date
          </label>
          <input
            type="date"
            id="EventStartDate"
            name="EventStartDate"
            value={eventData.EventStartDate || ""}
            onChange={(e) => setEventData({ ...eventData, EventStartDate: e.target.value })}
            className="form-control form-control-lg"
            required
          />
        </div>

        {/* Event End Date */}
        <div className="col-md-6 mb-4">
          <label htmlFor="EventEndDate" className="form-label fs-6">
            Event End Date
          </label>
          <input
            type="date"
            id="EventEndDate"
            name="EventEndDate"
            value={eventData.EventEndDate || ""}
            onChange={(e) => setEventData({ ...eventData, EventEndDate: e.target.value })}
            className="form-control form-control-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
