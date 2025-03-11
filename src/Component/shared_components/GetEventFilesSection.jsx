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
const GetEventFilesSection = ({ eventData, setEventData }) => {
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
    <div className="container-fluid py-4">
      <div className="card modern-card px-5 py-4 w-100 mx-auto">
        {/* Is Staff or Students */}
        <div className="card section-card p-4 mt-4">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              id="isStaffStudents"
              name="isStaffStudents"
              className="form-check-input"
              checked={eventData.isStaffStudents === 1}
              disabled
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="isStaffStudents">
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
                  disabled
                  onChange={handleCheckboxChange}
                />
                <label
                  className="form-check-label"
                  htmlFor="isChairBoardPrisidentVcb"
                >
                  The Chair, Board Member, President, or VC attend
                </label>
              </div>

              {/* Upload Led of the University Organizer File */}
              <div className="mt-3 p-2 border rounded bg-light shadow-sm">
                <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                  {/* Label */}
                  <label
                    htmlFor="LedOfTheUniversityOrganizerFile"
                    className="form-label text-dark fw-bold m-0"
                    style={{
                      fontSize: "14px",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Lead Organizer’s Approval Form
                  </label>

                  {/* View Button (Always Shown if File Exists) */}
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
                          fontSize: "12px",
                        }}
                        disabled
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

              {eventData.isChairBoardPrisidentVcb === 1 && (
                <div className="mt-3 p-2 border rounded bg-light shadow-sm">
                  <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                    {/* Label */}
                    <label
                      htmlFor="OfficeOfPresedentFile"
                      className="form-label text-dark fw-bold m-0"
                      style={{
                        fontSize: "14px",
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      President’s Office Form
                    </label>

                    {/* View Button (Always Shown if File Exists) */}
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
                            minWidth: "65px",
                            fontSize: "12px",
                          }}
                          disabled
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
              onChange={handleCheckboxChange}
              disabled
            />
            <label
              className="form-check-label"
              // className="form-check-label fs-6 font-weight-bold text-dark text-wrap"
              htmlFor="isOthers"
            >
              The event is for non-BUE staff and students{" "}
              <span className="text-danger">
                {" "}
                (Requires President’s Office Approval)
              </span>
            </label>
          </div>

          {eventData.isOthers === 1 && (
            <div className="mt-3">
              {/* Upload Visit Agenda File */}
              <div className="mt-3 p-2 border rounded bg-light shadow-sm">
                <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                  {/* Label */}
                  <label
                    htmlFor="VisitAgendaFile"
                    className="form-label text-dark fw-bold m-0"
                    style={{
                      fontSize: "14px",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Visit Agenda
                  </label>

                  {/* View Button (Always Shown if File Exists) */}
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
                          minWidth: "65px",
                          fontSize: "12px",
                        }}
                        disabled
                        onClick={() => GetFiles(eventData.visitAgendaFilePath)}
                      >
                        <i className="bi bi-eye"></i> View
                      </button>
                    </a>
                  )}
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
                    disabled
                  />
                  <label
                    className="form-check-label fs-6 font-weight-bold text-dark text-wrap"
                    htmlFor="isVip"
                  >
                    International guests (excluding VIPs) will attend
                  </label>
                </div>
              </div>
              {eventData.isVip === 1 && (
                <div className="card shadow-sm px-5 w-100 mx-auto">
                  {/* Check for passports instead of passportData */}
                  {!eventData.passports?.length && (
                    <div className="text-center">
                      <p>No passport data available</p>
                      {eventData.confirmedAt == null ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ backgroundColor: "#57636f" }}
                          onClick={addPassportInput}
                          disabled
                        >
                          + Add Passport
                        </button>
                      ) : null}
                    </div>
                  )}

                  {/* Container with background color & reduced width */}
                  <div
                    className="d-flex flex-wrap gap-3 p-3"
                    style={{
                      backgroundColor: "#fbfbfb",
                      maxWidth: "800px", // Adjust this value as needed
                      margin: "0 auto", // Center the container
                      borderRadius: "8px", // Optional: smooth edges
                    }}
                  >
                    {eventData.passports?.map((fileArray, index) => {
                      console.log("fileArray:", fileArray); // Debug log
                      return (
                        <div
                          key={index}
                          className="card shadow-sm p-2"
                          style={{
                            width: "200px", // Increased width to accommodate side-by-side elements
                            backgroundColor: "#fff", // Ensure contrast with background
                          }}
                        >
                          {/* Label & View Button in a Single Row */}
                          <div className="d-flex justify-content-center gap-2 align-items-center">
                            <label
                              htmlFor={`passports${index}`}
                              className="form-label text-dark fw-bold m-0"
                              style={{ fontSize: "14px" }}
                            >
                              Passport {index + 1}
                            </label>

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
                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                    style={{
                                      gap: "4px",
                                      padding: "4px 8px",
                                      fontSize: "12px",
                                    }}
                                    onClick={() =>
                                      GetFiles(
                                        eventData.passports[index].split(
                                          "/uploads/"
                                        )[1]
                                      )
                                    }
                                  >
                                    <i className="bi bi-eye"></i> View
                                  </button>
                                </a>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Show add button if passports exists */}
                  {eventData.passports?.length > 0 && (
                    <div className="text-center mt-4">
                      {eventData.confirmedAt == null ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ backgroundColor: "#57636f" }}
                          onClick={addPassportInput}
                        >
                          + Add Passport
                        </button>
                      ) : null}
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

export default GetEventFilesSection;
