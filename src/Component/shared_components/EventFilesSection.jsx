import React from "react";

const EventFilesSection = ({ eventData, setEventData }) => {
  const handleFileChange = (e, index) => {
    const selectedFiles = Array.from(e.target.files);
    setEventData((prevData) => {
      const updatedpassportData = [...(prevData.passportData || [])];
      updatedpassportData[index] = selectedFiles;
      return { ...prevData, passportData: updatedpassportData };
    });
  };

  const addPassportInput = () => {
    setEventData((prevData) => ({
      ...prevData,
      passportData: [...(prevData.passportData || []), []],
    }));
  };

  const removePassportInput = (index) => {
    setEventData((prevData) => ({
      ...prevData,
      passportData: prevData.passportData.filter((_, i) => i !== index),
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEventData({
      ...eventData,
      [name]: checked ? 1 : 0,
    });
  };
  const handleVIPCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEventData({
      ...eventData,
      [name]: checked ? 1 : 0,
    });
  };
  const handleVIPChange = (e) => {
    const value = e.target.value === "national" ? 0 : 1;
    setEventData({ ...eventData, isVip: value });
  };
  return (
    <div className="container-fluid">
      <div
        className="card shadow-sm px-3 py-2 w-100 mx-auto"
        // style={{ backgroundColor: "#f8f9fa" }}
      >
        {/* Staff and Students Section */}
        <div className="card section-card p-2 mt-3">
          <div className="form-check">
            <input
              type="checkbox"
              id="IsStaffStudents"
              name="IsStaffStudents"
              className="form-check-input"
              checked={eventData.IsStaffStudents === 1}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label small" htmlFor="IsStaffStudents">
              <b>
                The Event Exclusively Attended by Staff & Students of the
                British University in Egypt
              </b>
            </label>
          </div>

          {eventData.IsStaffStudents === 1 && (
            <div className="mt-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="IsChairBoardPrisidentVcb"
                  name="IsChairBoardPrisidentVcb"
                  className="form-check-input"
                  checked={eventData.IsChairBoardPrisidentVcb === 1}
                  onChange={handleCheckboxChange}
                />
                <label
                  className="form-check-label small"
                  htmlFor="IsChairBoardPrisidentVcb"
                >
                  <b>
                    Does the Chair, and/or Board Member, and/or President and
                    Vice Chancellor need to attend?
                  </b>
                </label>
              </div>

              {/* <div className="mt-2 text-center">
                <label className="form-label small d-block">
                  Lead Organizer’s Approval Form
                </label>
                <div className="d-flex justify-content-center">
                  <input
                    type="file"
                    className="form-control form-control-sm w-50"
                    style={{ maxWidth: "300px" }}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        LedOfTheUniversityOrganizerFile: e.target.files[0],
                      })
                    }
                  />
                </div>
              </div> */}

              {eventData.IsChairBoardPrisidentVcb === 1 && (
                <div className="mt-2 text-center">
                  <label
                    className="form-label small d-block"
                    style={{ fontSize: "0.7rem" }}
                  >
                    President’s Office Form
                  </label>
                  <div className="d-flex justify-content-center">
                    <input
                      type="file"
                      className="form-control form-control-sm w-50"
                      style={{ maxWidth: "300px" }}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          OfficeOfPresedentFile: e.target.files[0],
                        })
                      }
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Non-BUE Attendees */}
        <div className="card section-card p-2 mt-3">
          <div className="form-check">
            <input
              type="checkbox"
              id="IsOthers"
              name="IsOthers"
              className="form-check-input"
              checked={eventData.IsOthers === 1}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label small" htmlFor="IsOthers">
              <b>
                The event is attended by others; please attach the visit agenda.
              </b>
              {/* <span className="text-danger"> (Requires Approval)</span> */}
            </label>
          </div>

          {eventData.IsOthers === 1 && (
            <div className="mt-2">
              <div className="mt-2 text-center">
                <label
                  className="form-label small d-block"
                  style={{ fontSize: "0.7rem" }}
                >
                  Visit Agenda File
                </label>
                <div className="d-flex justify-content-center">
                  <input
                    type="file"
                    className="form-control form-control-sm w-50"
                    style={{ maxWidth: "300px" }}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        VisitAgendaFile: e.target.files[0],
                      })
                    }
                    required
                  />
                </div>
              </div>
              {/* VIP Section */}
              <div className="card section-card p-2 mt-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="isVip"
                    name="isVip"
                    className="form-check-input me-2"
                    checked={eventData.isVip == 1}
                    onChange={handleVIPCheckboxChange}
                  />
                  <label className="form-check-label small" htmlFor="isVip">
                    <b>National or International VIP Guests will attend</b>
                  </label>
                </div>
              </div>
              {/* {eventData.isVip == 1 ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "0.7rem",
                      gap: "2rem",
                      marginTop: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="radio"
                        name="vipType"
                        id="national"
                        value="national"
                        checked={eventData.isVip === 0}
                        onChange={handleVIPChange}
                        style={{ marginRight: "0.3rem" }}
                      />
                      <label htmlFor="national">National</label>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="radio"
                        name="vipType"
                        id="international"
                        value="international"
                        checked={eventData.isVip === 1}
                        onChange={handleVIPChange}
                        style={{ marginRight: "0.3rem" }}
                      />
                      <label htmlFor="international">International</label>
                    </div>
                  </div>
                </>
              ) : null} */}
              {/* VIP Section */}
              <div className="card section-card p-2 mt-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="isInernationalGuest"
                    name="isInernationalGuest"
                    className="form-check-input"
                    checked={eventData.isInernationalGuest === 1}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className="form-check-label small"
                    htmlFor="isInernationalGuest"
                  >
                    <b>International guests (excluding VIPs) will attend</b>
                  </label>
                </div>
              </div>

              {eventData.isInernationalGuest === 1 && (
                <div className="mt-3">
                  {(eventData.passportData || []).map((fileArray, index) => (
                    <div
                      key={index}
                      className="passport-entry mb-3 text-center"
                    >
                      {/* Centered Label */}
                      <label
                        className="form-label small d-block"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Passport {index + 1}
                      </label>
                      {/* File Input + Delete Button Row */}
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <input
                          type="file"
                          multiple
                          className="form-control form-control-sm w-50"
                          style={{ maxWidth: "300px", fontSize: "0.7rem" }}
                          required
                          onChange={(e) => handleFileChange(e, index)}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ padding: "3px 6px", fontSize: "0.7rem" }}
                          onClick={() => removePassportInput(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                      {/* 
                      {/* Display File Names
                      {fileArray.length > 0 && (
                        <ul className="mt-1 small text-center">
                          {fileArray.map((file, fileIndex) => (
                            <li key={fileIndex} className="file-name">
                              {file.name}
                            </li>
                          ))}
                        </ul>
                      )}{" "}
                      */}
                    </div>
                  ))}

                  <div className="text-center mt-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{
                        backgroundColor: "#57636f",
                        fontSize: "0.6rem",
                        padding: "5px 10px",
                      }}
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
          border-radius: 10px;
          background: #f8f9fa;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
        }

        .section-card {
          border-radius: 6px;
          background: white;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
        }

        .passport-card {
          border-radius: 6px;
          padding: 10px;
        }

        .btn {
          transition: all 0.2s ease-in-out;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .form-label {
          font-size: 14px;
        }

        .file-name {
          font-size: 12px;
          color: #333;
        }

        .form-check-label {
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
};

export default EventFilesSection;
