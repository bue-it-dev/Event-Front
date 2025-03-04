import React from "react";

const EventFilesSection = ({ eventData, setEventData }) => {
  // Handle file input changes
  const handleFileChange = (e, index) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to an array

    setEventData((prevData) => {
      const updatedpassportData = [...(prevData.passportData || [])];
      updatedpassportData[index] = selectedFiles; // Store files in the array

      return { ...prevData, passportData: updatedpassportData };
    });
  };

  // Add a new passport file input
  const addPassportInput = () => {
    setEventData((prevData) => {
      const updatedpassportData = [...(prevData.passportData || []), []];
      return { ...prevData, passportData: updatedpassportData };
    });
  };

  // Remove a passport file input
  const removePassportInput = (index) => {
    setEventData((prevData) => {
      const updatedpassportData = prevData.passportData.filter(
        (_, i) => i !== index
      );
      return { ...prevData, passportData: updatedpassportData };
    });
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
                    (excluding VIPs)?
                  </label>
                </div>
              </div>

              {eventData.isVIP === 1 && (
                <div className="card shadow-sm px-5 py-4 w-100 mx-auto">
                  {/* Passport file inputs (dynamically added) */}
                  {(eventData.passportData || []).map((fileArray, index) => (
                    <div key={index} className="card shadow-sm p-3 mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <label
                          htmlFor={`passportData${index}`}
                          className="form-label text-dark font-weight-bold"
                        >
                          Upload Passport Files (files {index + 1}):
                        </label>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removePassportInput(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>

                      <input
                        type="file"
                        id={`passportData${index}`}
                        name={`passportData[${index}]`}
                        multiple
                        className="form-control-file"
                        onChange={(e) => handleFileChange(e, index)}
                      />

                      {fileArray.length > 0 && (
                        <ul className="mt-2">
                          {fileArray.map((file, fileIndex) => (
                            <li
                              key={fileIndex}
                              style={{ fontSize: "12px", color: "black" }}
                            >
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
                      className="btn btn-outline-primary btn-lg"
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
    </div>
  );
};

export default EventFilesSection;
