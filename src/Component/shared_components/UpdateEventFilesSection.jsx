import React, { useState } from "react";
import { toast } from "react-toastify";
import PassportFilesSection from "../shared_components/PassportFilesSection "; // Import PassportFilesSection
import axios from "axios";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import {
  Grid,
  Fade,
  Container,
  makeStyles,
  Typography,
  createMuiTheme,
  responsiveFontSizes,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
// import axios from "axios";
const UpdateEventFilesSection = ({ eventData, setEventData }) => {
  const [passportFiles, setPassportFiles] = useState([]);
  const [files, setFiles] = useState(null); // Add this state for storing file data

  // Add console log to see the eventData
  console.log("eventData visitAgendaFilePath:", eventData.visitAgendaFilePath);

  // Add the GetFiles function
  const GetFiles = (path) => {
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/EventEntity/get-file?filePath=${path}`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    axios(config)
      .then(function (response) {
        setFiles(response.data.data);
        console.log("Files", files);
        // Open file in new window/tab
        if (response.data.data) {
          window.open(response.data.data, "_blank");
        }
      })
      .catch(function (error) {
        console.error("Error fetching file:", error);
        toast.error("Error viewing file");
      });
  };

  // Handle file input changes
  const handleFileChange = (e, index) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
    console.log("Selected files:", selectedFiles); // Debug log

    setEventData((prevData) => {
      const updatedPassports = [...(prevData.passports || [])];
      // Ensure the item at this index is an array
      updatedPassports[index] = Array.isArray(selectedFiles)
        ? selectedFiles
        : [selectedFiles];
      console.log("Updated passports:", updatedPassports); // Debug log
      return { ...prevData, passports: updatedPassports };
    });
  };

  // Add a new passport file input
  const addPassportInput = () => {
    setEventData((prevData) => {
      const updatedPassports = [...(prevData.passports || []), []];
      console.log("Adding new passport input:", updatedPassports); // Debug log
      return { ...prevData, passports: updatedPassports };
    });
  };

  // Remove a passport file input
  const removePassportInput = (index) => {
    setEventData((prevData) => {
      const updatedPassports = prevData.passports.filter((_, i) => i !== index);
      return { ...prevData, passports: updatedPassports };
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
      <div className="card modern-card px-2 w-80 mx-auto">
        {/* Is Staff or Students */}
        <div className="card section-card p-4 mt-4">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              id="isStaffStudents"
              name="isStaffStudents"
              className="form-check-input"
              checked={eventData.isStaffStudents === 1}
              style={{ fontSize: "14px" }}
              onChange={handleCheckboxChange}
            />
            <label
              className="form-check-label font-weight-bold fs-8"
              htmlFor="isStaffStudents"
            >
              The event is for BUE staff and students
            </label>
          </div>

          {eventData.isStaffStudents === 1 && (
            <div className="mt-3">
              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  id="isChairBoardPrisidentVcb"
                  name="isChairBoardPrisidentVcb"
                  className="form-check-input"
                  checked={eventData.isChairBoardPrisidentVcb === 1}
                  onChange={handleCheckboxChange}
                />
                <label
                  className="form-check-label font-weight-bold fs-8"
                  htmlFor="isChairBoardPrisidentVcb"
                  style={{ fontSize: "14px" }}
                >
                  The Chair, Board Member, President, or VC attend
                </label>
              </div>

              {/* Upload Led of the University Organizer File */}
              <div className="mt-2 p-3 border rounded bg-light shadow-sm">
                <label
                  htmlFor="LedOfTheUniversityOrganizerFile"
                  className="form-label text-dark fw-bold text-center d-block"
                  style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                >
                  Lead Organizer’s Approval Form
                </label>

                <div className="d-flex flex-column align-items-center gap-3 mt-2">
                  <div className="d-flex align-items-center gap-2">
                    {eventData.confirmedAt == null && (
                      <input
                        type="file"
                        className="form-control form-control-sm rounded"
                        style={{ maxWidth: "300px", padding: "8px" }}
                        onChange={(e) =>
                          setEventData({
                            ...eventData,
                            universityFile: e.target.files[0],
                          })
                        }
                      />
                    )}

                    {eventData?.ledOfTheUniversityOrganizerFilePath && (
                      <a
                        href={`${URL.BASE_URL}/api/EventEntity/get-file?filePath=${eventData?.ledOfTheUniversityOrganizerFilePath}`}
                        target="_blank"
                        className="text-decoration-none"
                      >
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                          style={{
                            gap: "2px",
                            padding: "2px 6px",
                            minWidth: "70px",
                            fontSize: "12px",
                          }}
                          onClick={() =>
                            GetFiles(
                              eventData.ledOfTheUniversityOrganizerFilePath
                            )
                          }
                        >
                          <i className="bi bi-eye"></i> View
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {eventData.isChairBoardPrisidentVcb === 1 && (
                <div className="mt-3 p-3 border rounded bg-light shadow-sm">
                  <label
                    htmlFor="OfficeOfPresedentFile"
                    className="form-label text-dark fw-bold text-center d-block"
                    style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                  >
                    President’s Office Form
                  </label>

                  <div className="d-flex flex-column align-items-center gap-3 mt-2">
                    <div className="d-flex align-items-center gap-2">
                      {eventData.confirmedAt == null && (
                        <input
                          type="file"
                          className="form-control form-control-sm rounded"
                          style={{ maxWidth: "300px", padding: "8px" }}
                          onChange={(e) =>
                            setEventData({
                              ...eventData,
                              presidentFile: e.target.files[0],
                            })
                          }
                        />
                      )}

                      {eventData?.officeOfPresedentFilePath && (
                        <a
                          href={`${URL.BASE_URL}/api/EventEntity/get-file?filePath=${eventData?.officeOfPresedentFilePath}`}
                          target="_blank"
                          className="text-decoration-none"
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                            style={{
                              gap: "2px",
                              padding: "2px 6px",
                              minWidth: "70px",
                              fontSize: "12px",
                            }}
                            onClick={() =>
                              GetFiles(eventData.officeOfPresedentFilePath)
                            }
                          >
                            <i className="bi bi-eye"></i> View
                          </button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Is Others */}
        <div className="card shadow-sm p-4 mt-4">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              id="isOthers"
              name="isOthers"
              className="form-check-input"
              checked={eventData.isOthers === 1}
              style={{ fontSize: "14px" }}
              onChange={handleCheckboxChange}
            />
            <label
              className="form-check-label fs-8 font-weight-bold text-dark text-wrap"
              htmlFor="isOthers"
            >
              The event is for non-BUE staff and students
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {" "}
                (Requires President’s Office Approval)
              </span>
            </label>
          </div>

          {eventData.isOthers === 1 && (
            <div className="mt-3">
              {/* Upload Visit Agenda File */}
              <div className="mt-3 p-3 border rounded bg-light shadow-sm">
                <label
                  htmlFor="VisitAgendaFile"
                  className="form-label text-dark fw-bold text-center d-block"
                  style={{ fontSize: "14px", letterSpacing: "0.5px" }}
                >
                  Visit Agenda
                </label>

                <div className="d-flex flex-column align-items-center gap-3 mt-2">
                  <div className="d-flex align-items-center gap-2">
                    {eventData.confirmedAt == null && (
                      <input
                        type="file"
                        className="form-control form-control-sm rounded"
                        style={{ maxWidth: "300px", padding: "8px" }}
                        onChange={(e) =>
                          setEventData({
                            ...eventData,
                            agendaFile: e.target.files[0],
                          })
                        }
                      />
                    )}
                    {eventData?.visitAgendaFilePath && (
                      <a
                        href={`${URL.BASE_URL}/api/EventEntity/get-file?filePath=${eventData?.visitAgendaFilePath}`}
                        target="_blank"
                        className="text-decoration-none"
                      >
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                          style={{
                            gap: "2px",
                            padding: "2px 6px",
                            minWidth: "70px",
                            fontSize: "12px",
                          }}
                          onClick={() =>
                            GetFiles(eventData.visitAgendaFilePath)
                          }
                        >
                          <i className="bi bi-eye"></i> View
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Is Others NOT VIP */}
              <div className="card shadow-sm p-4 mt-4">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    id="isVip"
                    name="isVip"
                    className="form-check-input"
                    checked={eventData.isVip === 1}
                    onChange={handleCheckboxChange}
                    style={{ fontSize: "14px" }}
                  />
                  <label
                    className="form-check-label fs-8 font-weight-bold text-dark text-wrap"
                    htmlFor="isVip"
                  >
                    International guests (excluding VIPs) will attend
                  </label>
                </div>
              </div>
              {eventData.isVip === 1 && (
                <div className="card shadow-sm px-5 w-100 mx-auto">
                  {/* Check for passports */}
                  {!eventData.passports?.length && (
                    <div className="text-center">
                      <p>No passport data available</p>
                      {eventData.confirmedAt == null && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{
                            backgroundColor: "#57636f",
                            padding: "4px 8px",
                            fontSize: "14px",
                          }}
                          onClick={addPassportInput}
                        >
                          + Add Passport
                        </button>
                      )}
                    </div>
                  )}

                  {/* Map through passports */}
                  {eventData.passports?.map((fileArray, index) => (
                    <div key={index}>
                      {/* Label Above Input */}
                      <label
                        htmlFor={`passports${index}`}
                        className="form-label text-dark fw-bold"
                      >
                        Passport {index + 1}
                      </label>

                      {/* File Input + Delete Button (Beside) */}
                      <div className="d-flex align-items-center gap-2">
                        {eventData.confirmedAt == null && (
                          <input
                            type="file"
                            id={`passports${index}`}
                            name={`passports[${index}]`}
                            multiple
                            className="form-control form-control-sm rounded"
                            style={{ padding: "8px" }}
                            onChange={(e) => handleFileChange(e, index)}
                          />
                        )}

                        {eventData.confirmedAt == null && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm d-flex align-items-center"
                            style={{
                              gap: "2px",
                              padding: "2px 6px",
                              fontSize: "12px",
                            }}
                            onClick={() => removePassportInput(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>

                      {/* File Preview */}
                      {eventData?.passports?.[index] &&
                        typeof eventData.passports[index] === "string" && (
                          <div className="card shadow-sm p-2 mt-2 text-center">
                            <a
                              href={`${URL.BASE_URL}/api/EventEntity/get-file?filePath=${eventData.passports[index]}`}
                              target="_blank"
                              className="text-decoration-none"
                            >
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center mx-auto"
                                style={{
                                  gap: "2px",
                                  padding: "2px 6px",
                                  minWidth: "70px",
                                  fontSize: "12px",
                                }}
                                onClick={() =>
                                  GetFiles(eventData.passports[index])
                                }
                              >
                                <i className="bi bi-eye"></i> View
                              </button>
                            </a>
                          </div>
                        )}
                    </div>
                  ))}

                  {/* Show add button if passports exist */}
                  {eventData.passports?.length > 0 && (
                    <div className="text-center mt-2">
                      {eventData.confirmedAt == null && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{
                            backgroundColor: "#57636f",
                            padding: "4px 8px",
                            fontSize: "14px",
                          }}
                          onClick={addPassportInput}
                        >
                          + Add Passport
                        </button>
                      )}
                    </div>
                  )}
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
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease-in-out;
        }

        .section-card {
          border-radius: 10px;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 20px;
          transition: transform 0.3s ease-in-out;
        }

        .section-card:hover {
          transform: scale(1.02);
        }

        .modern-checkbox {
          width: 20px;
          height: 20px;
          accent-color: #007bff;
          cursor: pointer;
        }

        .file-upload-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modern-file-input {
          border-radius: 6px;
          padding: 10px;
          border: 1px solid #ced4da;
          transition: all 0.3s ease-in-out;
        }

        .modern-file-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }

        .modern-btn {
          transition: all 0.3s ease-in-out;
          border-radius: 5px;
        }

        .modern-btn:hover {
          background-color: #0056b3;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default UpdateEventFilesSection;
