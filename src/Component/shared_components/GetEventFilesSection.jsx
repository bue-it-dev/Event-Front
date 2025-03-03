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
      <div className="card shadow-sm px-5 py-4 w-100 mx-auto">
        {/* Is Staff or Students */}
        <div className="card shadow-sm p-4 mt-4">
          <div className="form-check form-check-lg">
            <input
              type="checkbox"
              id="IsStaffStudents"
              name="IsStaffStudents"
              className="form-check-input"
              disabled
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
                  disabled
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
                  Signed approval form from the Lead university organizer form:
                </label>
                <div className="d-flex align-items-center gap-2">
                  {/* <input
                    type="file"
                    id="LedOfTheUniversityOrganizerFile"
                    name="LedOfTheUniversityOrganizerFile"
                    className="form-control-file"
                    disabled
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        LedOfTheUniversityOrganizerFile: e.target.files[0],
                      })
                    }
                  /> */}
                  {eventData?.ledOfTheUniversityOrganizerFilePath && (
                    <Grid item xs={12} md={6}>
                      <a
                        href={`${URL.BASE_URL}/api/EventEntity/get-file?filePath=${eventData?.ledOfTheUniversityOrganizerFilePath}`}
                        target="_blank"
                      >
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            GetFiles(
                              eventData.ledOfTheUniversityOrganizerFilePath
                            )
                          }
                        >
                          <i className="bi bi-eye"></i> View
                        </button>
                      </a>
                    </Grid>
                  )}
                </div>
              </div>

              {eventData.isChairBoardPrisidentVcb === 1 && (
                <div className="mt-3">
                  <label
                    htmlFor="OfficeOfPresedentFile"
                    className="form-label text-dark font-weight-bold"
                    disabled
                    style={{ fontSize: "14px" }}
                  >
                    Relevant form from the Office of the President:
                  </label>
                  <div className="d-flex align-items-center gap-2">
                    {/* <input
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
                    /> */}
                    {eventData?.officeOfPresedentFilePath && (
                      <Grid item xs={12} md={6}>
                        <a
                          href={`${URL.BASE_URL}/api/EventEntity/get-file?filePath=${eventData?.officeOfPresedentFilePath}`}
                          target="_blank"
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              GetFiles(eventData.officeOfPresedentFilePath)
                            }
                          >
                            <i className="bi bi-eye"></i> View
                          </button>
                        </a>
                      </Grid>
                    )}
                  </div>
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
              disabled
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
                  Visit agenda file:
                </label>
                <div className="d-flex align-items-center gap-2">
                  {/* <input
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
                  /> */}
                  {eventData?.visitAgendaFilePath && (
                    <Grid item xs={12} md={6}>
                      <a
                        href={`${URL.BASE_URL}/api/EventEntity/get-file?filePath=${eventData?.visitAgendaFilePath}`}
                        target="_blank"
                      >
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            GetFiles(eventData.visitAgendaFilePath)
                          }
                        >
                          <i className="bi bi-eye"></i> View
                        </button>
                      </a>
                    </Grid>
                  )}
                  {/* <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => GetFiles(eventData.visitAgendaFilePath)}
                  >
                    <i className="bi bi-eye"></i> View
                  </button> */}
                </div>
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
                    disabled
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
                <div className="card shadow-sm px-5 py-4 w-100 mx-auto">
                  {/* Check for passports instead of passportData */}
                  {!eventData.passports?.length && (
                    <div className="text-center">
                      <p>No passport data available</p>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-lg"
                        onClick={addPassportInput}
                      >
                        + Add Passport
                      </button>
                    </div>
                  )}
                  {/* Map through passports instead of passportData */}
                  {eventData.passports?.map((fileArray, index) => {
                    console.log("fileArray:", fileArray); // Debug log
                    return (
                      <div key={index} className="card shadow-sm p-3 mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <label
                            htmlFor={`passports${index}`}
                            className="form-label text-dark font-weight-bold"
                          >
                            Uploaded Passport Files (file {index + 1}):
                          </label>
                        </div>

                        {/* <input
                          type="file"
                          id={`passports${index}`}
                          name={`passports[${index}]`}
                          multiple
                          className="form-control-file"
                          onChange={(e) => handleFileChange(e, index)}
                        /> */}
                        <div className="card shadow-sm p-3 mt-3">
                          {eventData?.passports?.[index] &&
                            typeof eventData.passports[index] === "string" && (
                              <a
                                href={`${
                                  URL.BASE_URL
                                }/api/EventEntity/get-file?filePath=${
                                  eventData.passports[index].split(
                                    "/uploads/"
                                  )[1]
                                }`}
                                target="_blank"
                              >
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    GetFiles(
                                      eventData.passports[index].split(
                                        "/uploads/"
                                      )[1]
                                    )
                                  }
                                >
                                  <i className="bi bi-eye"></i>View
                                </button>
                              </a>
                            )}
                        </div>
                        {/* Add Array.isArray check before mapping */}
                        {Array.isArray(fileArray) && fileArray.length > 0 && (
                          <ul className="mt-2">
                            {fileArray.map((file, fileIndex) => (
                              <li
                                key={fileIndex}
                                className="d-flex justify-content-between align-items-center mb-2"
                                style={{ fontSize: "12px", color: "black" }}
                              >
                                <span>{file.name}</span>
                                {/* <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary ms-2"
                                  onClick={() =>
                                    GetFiles(file.filePath || file.path)
                                  }
                                >
                                  <i className="bi bi-eye"></i> View
                                </button> */}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                  {/* Show add button if passports exists
                  {eventData.passports?.length > 0 && (
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-lg"
                        onClick={addPassportInput}
                      >
                        + Add Passport
                      </button>
                    </div>
                  )} */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateEventFilesSection;
