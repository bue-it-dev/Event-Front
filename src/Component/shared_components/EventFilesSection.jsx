import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PassportFilesSection from '../shared_components/PassportFilesSection '; // Import PassportFilesSection

const EventFilesSection = ({ eventData, setEventData }) => {
  const [passportFiles, setPassportFiles] = useState([]);

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEventData({
      ...eventData,
      [name]: checked ? 1 : 0,
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();

    // Handle event data
    Object.keys(eventData).forEach((key) => {
      if (key !== 'passportData') { // Don't append passport data here
        formData.append(key, eventData[key]);
      }
    });

    // Append passport files (multiple) if passportData has files
    passportFiles.forEach((fileArray, index) => {
      fileArray.forEach((file) => {
        formData.append(`passportData[${index}]`, file);
      });
    });

    // Now you can send formData to your API
    console.log(formData); // For debugging purposes

    // Optionally show a success message
    toast.success('Event Submitted Successfully', {
      position: 'top-center',
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="IsStaffStudents">Is Staff or Students:</label>
        <input
          type="checkbox"
          id="IsStaffStudents"
          name="IsStaffStudents"
          checked={eventData.IsStaffStudents === 1}
          onChange={handleCheckboxChange}
        />
      </div>

      {eventData.IsStaffStudents === 1 && (
        <>
          <div>
            <label htmlFor="IsChairBoardPrisidentVcb">Is Chair Board President VCB:</label>
            <input
              type="checkbox"
              id="IsChairBoardPrisidentVcb"
              name="IsChairBoardPrisidentVcb"
              checked={eventData.IsChairBoardPrisidentVcb === 1}
              onChange={handleCheckboxChange}
            />
          </div>

          <div>
            <label htmlFor="LedOfTheUniversityOrganizerFile">Upload Led of the University Organizer File:</label>
            <input
              type="file"
              id="LedOfTheUniversityOrganizerFile"
              name="LedOfTheUniversityOrganizerFile"
              onChange={(e) => setEventData({ ...eventData, LedOfTheUniversityOrganizerFile: e.target.files[0] })}
            />
          </div>

          {eventData.IsChairBoardPrisidentVcb === 1 && (
            <div>
              <label htmlFor="OfficeOfPresedentFile">Upload Office of the President File:</label>
              <input
                type="file"
                id="OfficeOfPresedentFile"
                name="OfficeOfPresedentFile"
                onChange={(e) => setEventData({ ...eventData, OfficeOfPresedentFile: e.target.files[0] })}
              />
            </div>
          )}
        </>
      )}

      <div>
        <label htmlFor="IsOthers">Is Others:</label>
        <input
          type="checkbox"
          id="IsOthers"
          name="IsOthers"
          checked={eventData.IsOthers === 1}
          onChange={handleCheckboxChange}
        />
      </div>

      {eventData.IsOthers === 1 && (
        <>
          <div>
            <label htmlFor="VisitAgendaFile">Upload Visit Agenda File:</label>
            <input
              type="file"
              id="VisitAgendaFile"
              name="VisitAgendaFile"
              onChange={(e) => setEventData({ ...eventData, VisitAgendaFile: e.target.files[0] })}
            />
          </div>

          {/* Passport file inputs (dynamically added) */}
          <PassportFilesSection
            passportFiles={passportFiles}
            setPassportFiles={setPassportFiles}
          />
        </>
      )}

    </div>
  );
};

export default EventFilesSection;
