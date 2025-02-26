import React, { useState } from "react";
import { toast } from "react-toastify";
import PassportFilesSection from "../shared_components/PassportFilesSection "; // Import PassportFilesSection

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
      if (key !== "passportData") {
        // Don't append passport data here
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
    toast.success("Event Submitted Successfully", {
      position: "top-center",
    });
  };

  return (
    <div className="container-fluid">
      <div className="card shadow-sm px-5 py-4 w-100 mx-auto">
        {/* Is Staff or Students */}
        <div className="card shadow-sm p-4 mt-4">
          <div className="form-check form-check-lg">
            <input
              type="checkbox"
              id="IsStaffStudents"
              name="IsStaffStudents"
              className="form-check-input"
              checked={eventData.IsStaffStudents === 1}
              onChange={handleCheckboxChange}
            />
            <label
              className="form-check-label fs-6 font-weight-bold text-dark text-wrap"
              htmlFor="IsStaffStudents"
            >
              Is this event exclusively attended by Staff & Students of the
              British University in Egypt?
            </label>
          </div>

          {eventData.IsStaffStudents === 1 && (
            <div className="mt-3">
              <div className="form-check form-check-lg">
                <input
                  type="checkbox"
                  id="IsChairBoardPrisidentVcb"
                  name="IsChairBoardPrisidentVcb"
                  className="form-check-input"
                  checked={eventData.IsChairBoardPrisidentVcb === 1}
                  onChange={handleCheckboxChange}
                />
                <label
                  className="form-check-label text-dark text-wrap"
                  htmlFor="IsChairBoardPrisidentVcb"
                >
                  Will the Chair, Board Member, President, or Vice Chancellor be
                  attending this event?
                </label>
              </div>

              {/* Upload Led of the University Organizer File */}
              <div className="mt-3">
                <label
                  htmlFor="LedOfTheUniversityOrganizerFile"
                  className="form-label text-dark font-weight-bold"
                  style={{ fontSize: "14px" }}
                >
                  Upload the signed approval form from the lead university
                  organizer:
                </label>
                <input
                  type="file"
                  id="LedOfTheUniversityOrganizerFile"
                  name="LedOfTheUniversityOrganizerFile"
                  className="form-control-file"
                  onChange={(e) =>
                    setEventData({
                      ...eventData,
                      LedOfTheUniversityOrganizerFile: e.target.files[0],
                    })
                  }
                />
              </div>

              {eventData.IsChairBoardPrisidentVcb === 1 && (
                <div className="mt-3">
                  <label
                    htmlFor="OfficeOfPresedentFile"
                    className="form-label text-dark font-weight-bold"
                    style={{ fontSize: "14px" }}
                  >
                    Upload the relevant form from the Office of the President:
                  </label>
                  <input
                    type="file"
                    id="OfficeOfPresedentFile"
                    name="OfficeOfPresedentFile"
                    className="form-control-file"
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        OfficeOfPresedentFile: e.target.files[0],
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Is Others */}
        <div className="card shadow-sm p-4 mt-4">
          <div className="form-check form-check-lg">
            <input
              type="checkbox"
              id="IsOthers"
              name="IsOthers"
              className="form-check-input"
              checked={eventData.IsOthers === 1}
              onChange={handleCheckboxChange}
            />
            <label
              className="form-check-label fs-6 font-weight-bold text-dark text-wrap"
              htmlFor="IsOthers"
            >
              Will attendees include individuals who are not Staff or Students
              of the British University in Egypt?
            </label>
          </div>

          {eventData.IsOthers === 1 && (
            <div className="mt-3">
              {/* Upload Visit Agenda File */}
              <div>
                <label
                  htmlFor="VisitAgendaFile"
                  className="form-label text-dark font-weight-bold"
                  style={{ fontSize: "14px" }}
                >
                  Upload the visit agenda file:
                </label>
                <input
                  type="file"
                  id="VisitAgendaFile"
                  name="VisitAgendaFile"
                  className="form-control-file"
                  onChange={(e) =>
                    setEventData({
                      ...eventData,
                      VisitAgendaFile: e.target.files[0],
                    })
                  }
                />
              </div>
              {/* Is Others NOT VIP */}
              <div className="card shadow-sm p-4 mt-4">
                <div className="form-check form-check-lg">
                  <input
                    type="checkbox"
                    id="isVIP"
                    name="isVIP"
                    className="form-check-input"
                    checked={eventData.isVIP === 1}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className="form-check-label fs-6 font-weight-bold text-dark text-wrap"
                    htmlFor="isVIP"
                  >
                    Will the event be attended by international guests
                    (excluding VIPs)
                  </label>
                </div>
              </div>
              {eventData.isVIP === 1 && (
                <>
                  {/* Passport Files Section */}
                  <div className="mt-3">
                    <PassportFilesSection
                      passportFiles={passportFiles}
                      setPassportFiles={setPassportFiles}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventFilesSection;
