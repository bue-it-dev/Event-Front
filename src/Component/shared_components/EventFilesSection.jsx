import React from "react";

const EventFilesSection = ({ eventData, setEventData }) => {
  // Handle file input changes
  const handleFileChange = (e, index) => {
    const selectedFiles = Array.from(e.target.files);

    setEventData((prevData) => {
      const updatedpassportData = [...(prevData.passportData || [])];
      updatedpassportData[index] = selectedFiles;

      return { ...prevData, passportData: updatedpassportData };
    });
  };

  // Add a new passport file input
  const addPassportInput = () => {
    setEventData((prevData) => ({
      ...prevData,
      passportData: [...(prevData.passportData || []), []],
    }));
  };

  // Remove a passport file input
  const removePassportInput = (index) => {
    setEventData((prevData) => ({
      ...prevData,
      passportData: prevData.passportData.filter((_, i) => i !== index),
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEventData({
      ...eventData,
      [name]: checked ? 1 : 0,
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="card modern-card px-5 py-4 w-100 mx-auto">
        {/* Staff and Students Section */}
        <div className="card section-card p-4 mt-4">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              id="IsStaffStudents"
              name="IsStaffStudents"
              className="form-check-input"
              checked={eventData.IsStaffStudents === 1}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="IsStaffStudents">
              Is the event for BUE staff and students?
            </label>
          </div>

          {eventData.IsStaffStudents === 1 && (
            <div className="mt-3">
              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  id="IsChairBoardPrisidentVcb"
                  name="IsChairBoardPrisidentVcb"
                  className="form-check-input"
                  checked={eventData.IsChairBoardPrisidentVcb === 1}
                  onChange={handleCheckboxChange}
                />
                <label
                  className="form-check-label"
                  htmlFor="IsChairBoardPrisidentVcb"
                >
                  Will the Chair, Board Member, President, or VC attend?
                </label>
              </div>

              {/* Upload Organizer Approval */}
              <div className="mt-3">
                <label className="form-label">
                  Lead Organizer’s Approval Form:
                </label>
                <input
                  type="file"
                  className="form-control"
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
                  <label className="form-label">President’s Office Form:</label>
                  <input
                    type="file"
                    className="form-control"
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

        {/* Non-BUE Attendees */}
        <div className="card section-card p-4 mt-4">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              id="IsOthers"
              name="IsOthers"
              className="form-check-input"
              checked={eventData.IsOthers === 1}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="IsOthers">
              Will non-BUE individuals attend?
              <span className="text-danger">
                {" "}
                (Requires President’s Office Approval)
              </span>
            </label>
          </div>

          {eventData.IsOthers === 1 && (
            <div className="mt-3">
              <label className="form-label">Visit Agenda:</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    VisitAgendaFile: e.target.files[0],
                  })
                }
              />

              {/* VIP Section */}
              <div className="card section-card p-4 mt-4">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    id="isVIP"
                    name="isVIP"
                    className="form-check-input"
                    checked={eventData.isVIP === 1}
                    onChange={handleCheckboxChange}
                  />
                  <label className="form-check-label" htmlFor="isVIP">
                    Will international guests (excluding VIPs) attend?
                  </label>
                </div>
              </div>

              {eventData.isVIP === 1 && (
                <div className="card passport-card p-4 mt-4">
                  {/* Passport File Inputs */}
                  {(eventData.passportData || []).map((fileArray, index) => (
                    <div key={index} className="passport-entry">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label">
                          Passport {index + 1}:
                        </label>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removePassportInput(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>

                      <input
                        type="file"
                        multiple
                        className="form-control"
                        onChange={(e) => handleFileChange(e, index)}
                      />

                      {fileArray.length > 0 && (
                        <ul className="mt-2">
                          {fileArray.map((file, fileIndex) => (
                            <li key={fileIndex} className="file-name">
                              {file.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ backgroundColor: "#57636f", fontSize: "16px" }}
                      onClick={addPassportInput}
                    >
                      + Add Passport
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modern Styling */}
      <style jsx>{`
        .modern-card {
          border-radius: 12px;
          background: #f8f9fa;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .section-card {
          border-radius: 8px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .passport-card {
          border-radius: 8px;
          background: #eef2f5;
          padding: 15px;
        }

        .btn {
          transition: all 0.3s ease-in-out;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .file-name {
          font-size: 13px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default EventFilesSection;
