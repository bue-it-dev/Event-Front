import React, { useState } from "react";
import { toast } from "react-toastify";
import PassportFilesSection from "./PassportFilesSection "; // Import PassportFilesSection
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
const EventFilesSectionGET = ({ eventData, setEventData }) => {
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
      <div
        className="card shadow-sm px-3 py-2 w-100 mx-auto"
        // style={{ backgroundColor: "#f8f9fa" }}
      >
        {/* Is Staff or Students */}
        <div className="card section-card p-2 mt-3">
          <div className="form-check">
            <input
              type="checkbox"
              id="isStaffStudents"
              name="isStaffStudents"
              className="form-check-input"
              disabled
              checked={eventData.isStaffStudents === 1}
              style={{ fontSize: "0.7rem" }}
              onChange={handleCheckboxChange}
            />
            <label
              className="form-check-label small "
              style={{ fontSize: "0.7rem", color: "black" }}
              htmlFor="isStaffStudents"
            >
              <b>
                The Event Exclusively Attended by Staff & Students of the
                British University in Egypt
              </b>
            </label>
          </div>

          {eventData.isStaffStudents === 1 && (
            <div className="mt-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  disabled
                  id="isChairBoardPrisidentVcb"
                  name="isChairBoardPrisidentVcb"
                  className="form-check-input"
                  checked={eventData.isChairBoardPrisidentVcb === 1}
                  onChange={handleCheckboxChange}
                />
                <label
                  className="form-check-label small"
                  htmlFor="isChairBoardPrisidentVcb"
                  style={{ fontSize: "0.7rem", color: "black" }}
                >
                  <b>
                    Does the Chair, and/or Board Member, and/or President and
                    Vice Chancellor need to attend?
                  </b>
                </label>
              </div>

              {/* Upload Led of the University Organizer File 
              {/* <div className="mt-2 p-1 border rounded bg-light shadow-sm">
                <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                  {/* Label */}
              {/* <label
                htmlFor="LedOfTheUniversityOrganizerFile"
                className="form-label text-dark fw-bold m-0"
                style={{
                 fontSize: "0.7rem",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                }}
              >
                Lead Organizer’s Approval Form
              </label> */}

              {/* Input Field (Shown if not confirmed)
                  {eventData.confirmedAt == null && (
                    <input
                      type="file"
                      className="form-control form-control-sm rounded flex-grow-1"
                      style={{ maxWidth: "250px", padding: "6px" }}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          universityFile: e.target.files[0],
                        })
                      }
                    />
                  )}

                  {/* View Button (Always Shown if File Exists) 
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
                          gap: "1px",
                          padding: "2px 6px",
                          minWidth: "65px",
                         fontSize: "0.7rem",
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
              </div> */}

              {eventData.isChairBoardPrisidentVcb === 1 && (
                <div className="p-1 border rounded bg-light shadow-sm">
                  <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                    {/* Label */}
                    <label
                      htmlFor="OfficeOfPresedentFile"
                      className="form-check-label small"
                      style={{
                        fontSize: "0.7rem",
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      President’s Office Form
                    </label>

                    {/* Input Field (Shown if not confirmed) */}
                    {eventData.confirmedAt == null && (
                      <input
                        type="file"
                        className="form-control form-control-sm rounded flex-grow-1"
                        style={{ maxWidth: "250px", padding: "6px" }}
                        required={!eventData?.officeOfPresedentFilePath}
                        onChange={(e) =>
                          setEventData({
                            ...eventData,
                            presidentFile: e.target.files[0],
                          })
                        }
                      />
                    )}

                    {/* View Button (Always Shown if File Exists) */}
                    {eventData?.officeOfPresedentFilePath && (
                      <a
                        href={`${URL.BASE_URL}/api/EventEntity/get-file?filePath=${eventData?.officeOfPresedentFilePath}`}
                        target="_blank"
                        className="text-decoration-none"
                      >
                        <button
                          type="button"
                          className="btn btn-sm  d-flex align-items-center justify-content-center"
                          style={{
                            gap: "1px",
                            padding: "2px 6px",
                            minWidth: "65px",
                            fontSize: "0.6rem",
                            backgroundColor: "#57636f",
                            color: "white",
                          }}
                          onClick={() =>
                            GetFiles(eventData.officeOfPresedentFilePath)
                          }
                        >
                          View File
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Is Others */}
        <div className="card section-card p-2 mt-3">
          <div className="form-check">
            <input
              type="checkbox"
              id="isOthers"
              name="isOthers"
              className="form-check-input"
              checked={eventData.isOthers === 1}
              style={{ fontSize: "0.7rem" }}
              onChange={handleCheckboxChange}
              disabled
            />
            <label
              className="form-check-label small fw-bold"
              htmlFor="isOthers"
              style={{ fontSize: "0.7rem", color: "black" }}
            >
              The event is attended by others; please attach the visit agenda.
            </label>
          </div>

          {eventData.isOthers === 1 && (
            <div>
              {/* Upload Visit Agenda File */}
              <div className="p-1 border rounded bg-light shadow-sm">
                <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                  {/* Label */}
                  <label
                    htmlFor="VisitAgendaFile"
                    className="form-check-label small"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Visit Agenda
                  </label>

                  {/* Input Field (Shown if not confirmed) */}
                  {eventData.confirmedAt == null && (
                    <input
                      type="file"
                      className="form-control form-control-sm rounded flex-grow-1"
                      // value={eventData?.visitAgendaFilePath || ""}
                      required={!eventData?.visitAgendaFilePath}
                      style={{ maxWidth: "250px", padding: "6px" }}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          agendaFile: e.target.files[0],
                        })
                      }
                    />
                  )}

                  {/* View Button (Always Shown if File Exists) */}
                  {eventData?.visitAgendaFilePath && (
                    <a
                      href={`${URL.BASE_URL}/api/EventEntity/get-file?filePath=${eventData?.visitAgendaFilePath}`}
                      target="_blank"
                      className="text-decoration-none"
                    >
                      <button
                        type="button"
                        className="btn btn-sm  d-flex align-items-center justify-content-center"
                        style={{
                          gap: "1px",
                          padding: "2px 6px",
                          minWidth: "65px",
                          fontSize: "0.6rem",
                          backgroundColor: "#57636f",
                          color: "white",
                        }}
                        onClick={() => GetFiles(eventData.visitAgendaFilePath)}
                      >
                        View File
                      </button>
                    </a>
                  )}
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
                    onChange={handleCheckboxChange}
                    disabled
                  />
                  <label
                    className="form-check-label small"
                    htmlFor="isVip"
                    style={{ fontSize: "0.7rem", color: "black" }}
                  >
                    <b>National or International VIP Guests</b>
                  </label>
                </div>
              </div>
              {/* Is Others NOT VIP */}
              <div className="card section-card p-2 mt-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="isInernationalGuest"
                    name="isInernationalGuest"
                    className="form-check-input"
                    checked={eventData.isInernationalGuest === 1}
                    onChange={handleCheckboxChange}
                    style={{ fontSize: "0.7rem" }}
                    disabled
                  />
                  <label
                    className="form-check-label small fw-bold"
                    htmlFor="isInernationalGuest"
                    style={{ fontSize: "0.7rem", color: "black" }}
                  >
                    International guests (excluding VIPs)
                  </label>
                </div>
              </div>
              {eventData.isInernationalGuest === 1 && (
                // <div className="card shadow-sm px-5 w-100 mx-auto mb-2">
                <>
                  {/* Check for passports */}
                  {!eventData.passports?.length && (
                    <div className="text-center">
                      {/* <p>No passport data available</p> */}
                      {eventData.confirmedAt == null && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm mb-2"
                          style={{
                            backgroundColor: "#57636f",
                            padding: "4px 8px",
                            fontSize: "0.7rem",
                          }}
                          onClick={addPassportInput}
                        >
                          + Add Passport
                        </button>
                      )}
                    </div>
                  )}

                  {/* Map through passports */}
                  <div className="row g-2 mt-2">
                    {eventData.passports?.map((fileArray, index) => (
                      <div
                        key={index}
                        className={`${
                          eventData.passports.length === 1
                            ? "col-12 d-flex justify-content-center"
                            : "col-lg-6 col-md-6 col-12"
                        }`}
                      >
                        <div
                          className="mt-2 p-2 border rounded bg-light shadow-sm w-100"
                          style={{
                            maxWidth:
                              eventData.passports.length === 1
                                ? "400px"
                                : "none",
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                            {/* Label */}
                            <label
                              htmlFor={`passports${index}`}
                              className="form-label m-0"
                              disabled
                              style={{
                                fontSize: "0.7rem",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Passport {index + 1}
                            </label>
                            {/* File Input (If not confirmed) */}
                            {eventData.confirmedAt == null && (
                              <input
                                type="file"
                                id={`passports${index}`}
                                name={`passports[${index}]`}
                                required={!eventData?.passports[index]}
                                className="form-control form-control-sm rounded flex-grow-1"
                                style={{ maxWidth: "250px", padding: "6px" }}
                                onChange={(e) => handleFileChange(e, index)}
                              />
                            )}
                            {/* Delete Button (If not confirmed) */}
                            {eventData.confirmedAt == null && (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm d-flex align-items-center"
                                style={{
                                  gap: "1px",
                                  padding: "2px 6px",
                                  fontSize: "0.7rem",
                                }}
                                onClick={() => removePassportInput(index)}
                                disabled
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                            {/* View Button (Always shown if file exists) */}
                            {eventData?.passports?.[index] &&
                              typeof eventData.passports[index] ===
                                "string" && (
                                <a
                                  href={`${URL.BASE_URL}/api/EventEntity/get-file?filePath=${eventData.passports[index]}`}
                                  target="_blank"
                                  className="text-decoration-none"
                                >
                                  <button
                                    type="button"
                                    className="btn btn-sm d-flex align-items-center justify-content-center"
                                    style={{
                                      gap: "1px",
                                      padding: "2px 6px",
                                      minWidth: "65px",
                                      fontSize: "0.6rem",
                                      backgroundColor: "#57636f",
                                      color: "white",
                                    }}
                                    onClick={() =>
                                      GetFiles(eventData.passports[index])
                                    }
                                  >
                                    View Passport
                                  </button>
                                </a>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

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
                            fontSize: "0.7rem",
                          }}
                          onClick={addPassportInput}
                        >
                          + Add Passport
                        </button>
                      )}
                    </div>
                  )}
                  {/* </div> */}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Modern Styling */}
      {/* <style jsx>{`
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
      `}</style> */}
    </div>
  );
};

export default EventFilesSectionGET;
