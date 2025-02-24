import React, { useState } from "react";

const EventInfo = ({ eventData, seteventData }) => {
  const [errors, setErrors] = useState({});

  // Validate input and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    switch (name) {
      case "EventTitle":
        if (!/^[a-zA-Z ]+$/.test(value.trim())) {
          newErrors[name] = "Event title must contain only letters.";
        } else {
          delete newErrors[name];
        }
        break;

      case "NomParticipants":
        if (!/^\d+$/.test(value) || parseInt(value, 10) < 1) {
          newErrors[name] = "Participants must be a positive number.";
        } else {
          delete newErrors[name];
        }
        break;

      case "EventStartDate":
        if (!value) {
          newErrors[name] = "Start date is required.";
        } else {
          delete newErrors[name];
        }
        break;

      case "EventEndDate":
        if (!value) {
          newErrors[name] = "End date is required.";
        } else if (
          eventData.EventStartDate &&
          value < eventData.EventStartDate
        ) {
          newErrors[name] = "End date cannot be before start date.";
        } else {
          delete newErrors[name];
        }
        break;

      case "OrganizerMobile":
        if (!/^01(0|1|2|5)\d{8}$/.test(value) && value !== "") {
          newErrors[name] = "Enter a valid Egyptian phone number (11 digits).";
        } else {
          delete newErrors[name];
        }
        break;

      case "OrganizerExtention":
        if (!/^\d{4}$/.test(value) && value !== "") {
          newErrors[name] = "Extension must be exactly 4 digits.";
        } else {
          delete newErrors[name];
        }
        break;

      default:
        break;
    }

    seteventData({ ...eventData, [name]: value });
    setErrors(newErrors);
  };

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
            onChange={handleChange}
            className="form-control form-control-lg"
            required
          />
          {errors.EventTitle && (
            <small className="text-danger">{errors.EventTitle}</small>
          )}
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
            onChange={handleChange}
            className="form-control form-control-lg"
            min="1"
          />
          {errors.NomParticipants && (
            <small className="text-danger">{errors.NomParticipants}</small>
          )}
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
            onChange={handleChange}
            className="form-control form-control-lg"
            required
          />
          {errors.EventStartDate && (
            <small className="text-danger">{errors.EventStartDate}</small>
          )}
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
            onChange={handleChange}
            className="form-control form-control-lg"
          />
          {errors.EventEndDate && (
            <small className="text-danger">{errors.EventEndDate}</small>
          )}
        </div>

        {/* Organizer Name */}
        <div className="col-md-6 mb-4">
          <label htmlFor="OrganizerName" className="form-label fs-6">
            Organizer Name
          </label>
          <input
            type="text"
            id="OrganizerName"
            name="OrganizerName"
            value={eventData.OrganizerName || ""}
            onChange={handleChange}
            className="form-control form-control-lg"
          />
        </div>

        {/* Organizer Mobile */}
        <div className="col-md-6 mb-4">
          <label htmlFor="OrganizerMobile" className="form-label fs-6">
            Organizer Mobile
          </label>
          <input
            type="tel"
            id="OrganizerMobile"
            name="OrganizerMobile"
            value={eventData.OrganizerMobile || ""}
            onChange={handleChange}
            maxLength={11}
            className="form-control form-control-lg"
            placeholder="Enter valid Egyptian phone number"
          />
          {errors.OrganizerMobile && (
            <small className="text-danger">{errors.OrganizerMobile}</small>
          )}
        </div>

        {/* Organizer Extension */}
        <div className="col-md-6 mb-4">
          <label htmlFor="OrganizerExtention" className="form-label fs-6">
            Organizer Extension
          </label>
          <input
            type="text"
            id="OrganizerExtention"
            name="OrganizerExtention"
            value={eventData.OrganizerExtention || ""}
            onChange={handleChange}
            className="form-control form-control-lg"
          />
          {errors.OrganizerExtention && (
            <small className="text-danger">{errors.OrganizerExtention}</small>
          )}
        </div>
        {/* Organizer Extension */}
        <div className="col-md-6 mb-4">
          <label htmlFor="OrganizerExtention" className="form-label fs-6">
            Organizer Email
          </label>
          <input
            type="email"
            id="OrganizerExtention"
            name="OrganizerExtention"
            value={eventData.organizerEmail || ""}
            onChange={handleChange}
            className="form-control form-control-lg"
          />
          {/* {errors.organizerEmail && (
            <small className="text-danger">{errors.organizerEmail}</small>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
