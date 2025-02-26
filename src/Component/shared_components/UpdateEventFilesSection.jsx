import React, { useState } from "react";
import { toast } from "react-toastify";
import PassportFilesSection from "../shared_components/PassportFilesSection "; // Import PassportFilesSection

const UpdateEventFilesSection = ({ eventData, setEventData }) => {
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
              checked={eventData.isStaffStudents === 1}
              onChange={handleCheckboxChange}
            />
            <label
              className="form-check-label fs-6 font-weight-bold text-dark text-wrap"
              htmlFor="isStaffStudents"
            >
              Is this event exclusively attended by Staff & Students of the
              British University in Egypt?
            </label>
          </div>

          {eventData.isStaffStudents === 1 && (
            <div className="mt-3">
              <div className="form-check form-check-lg">
                <input
                  type="checkbox"
                  id="isChairBoardPrisidentVcb"
                  name="isChairBoardPrisidentVcb"
                  className="form-check-input"
                  value={eventData?.isChairBoardPrisidentVcb}
                  checked={eventData.isChairBoardPrisidentVcb === 1}
                  onChange={handleCheckboxChange}
                />
                <label
                  className="form-check-label text-dark text-wrap"
                  htmlFor="isChairBoardPrisidentVcb"
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
                  value={eventData?.ledOfTheUniversityOrganizerFilePath}
                  className="form-control-file"
                  onChange={(e) =>
                    setEventData({
                      ...eventData,
                      LedOfTheUniversityOrganizerFile: e.target.files[0],
                    })
                  }
                />
              </div>

              {eventData.isChairBoardPrisidentVcb === 1 && (
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
                    value={eventData?.officeOfPresedentFilePath}
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
              id="isOthers"
              name="isOthers"
              className="form-check-input"
              checked={eventData.isOthers === 1}
              onChange={handleCheckboxChange}
            />
            <label
              className="form-check-label fs-6 font-weight-bold text-dark text-wrap"
              htmlFor="isOthers"
            >
              Will attendees include individuals who are not Staff or Students
              of the British University in Egypt?
            </label>
          </div>

          {eventData.isOthers === 1 && (
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
                  value={eventData?.visitAgendaFilePath}
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
                    id="isVip"
                    name="isVip"
                    className="form-check-input"
                    checked={eventData.isVip === 1}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className="form-check-label fs-6 font-weight-bold text-dark text-wrap"
                    htmlFor="isVip"
                  >
                    Will the event be attended by international guests
                    (excluding VIPs)
                  </label>
                </div>
              </div>
              {eventData.isVip === 1 && (
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

export default UpdateEventFilesSection;
