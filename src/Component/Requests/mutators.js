import axios from "axios";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";

const SaveHomeTravel = async (application) => {
  try {
    await axios.post(
      `${URL.BASE_URL}/api/HomeRequest/AddHomeRequesterData`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return true;
  } catch (err) {
    throw err;
  }
};

const SaveBusinessTravel = async (application) => {
  try {
    console.log("Request", 12312);
    var request = await axios.post(
      `${URL.BASE_URL}/api/BusinessRequest/AddBusinessRequesterData`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return request;
  } catch (err) {
    throw err;
  }
};

const UpdateHomeRequest = async (application) => {
  try {
    await axios.put(
      `${URL.BASE_URL}/api/HomeRequest/UpdateHomeRequesterData?rowId=${application.requestId}`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return true;
  } catch (err) {
    throw err;
  }
};

const UpdateBusinessRequest = async (application) => {
  try {
    await axios.put(
      `${URL.BASE_URL}/api/BusinessRequest/${application.requestId}`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return true;
  } catch (err) {
    throw err;
  }
};

const ConfrimBusinessRequest = async (application) => {
  try {
    await axios.put(
      `${URL.BASE_URL}/api/BusinessRequest/submit-businessRequest/`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return true;
  } catch (err) {
    throw err;
  }
};

const DeleteHomeRequest = async (id) => {
  try {
    await axios.post(
      `${URL.BASE_URL}/api/HomeRequest/DeleteHomeRequesterData?rowId=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return true;
  } catch (err) {
    throw err;
  }
};

const DeleteBusinessRequest = async (id) => {
  try {
    await axios.post(
      `${URL.BASE_URL}/api/BusinessRequest/DeleteBusinessRequesterData?rowId=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return true;
  } catch (err) {
    throw err;
  }
};

const UpdateHRAllowance = async (application) => {
  try {
    // Send the application array directly
    await axios.put(
      `${URL.BASE_URL}/api/BusinessRequest/update-allowances`,
      application, // Now, this is the array itself, not an object with an array
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return true;
  } catch (err) {
    throw err;
  }
};

const UpdateTOData = async (requestId, application) => {
  try {
    // Include requestId in the URL as a query parameter
    await axios.put(
      `${URL.BASE_URL}/api/BusinessRequest/AddTravelOfficeData/${requestId}`,
      application, // Send the application data (payload)
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return true;
  } catch (err) {
    throw err;
  }
};

const UpdateBOData = async (requestId, application) => {
  try {
    // Include requestId in the URL as a query parameter
    await axios.put(
      `${URL.BASE_URL}/api/BusinessRequest/update-budget-office-data/${requestId}`,
      application, // Send the application data (payload)
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return true;
  } catch (err) {
    throw err;
  }
};

const UpdateBOMData = async (requestId, application) => {
  console.log("I am here before try clause");
  try {
    await axios.put(
      `${URL.BASE_URL}/api/BusinessRequest/update${requestId}`,
      application, // Send the application data (payload)
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return true;
  } catch (err) {
    console.log("ERRR", err);
    throw err;
  }
};

const AddHomeApprovalRequest = async (application) => {
  try {
    await axios.post(
      `${URL.BASE_URL}/api/Approvals/AddApproval`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return true;
  } catch (err) {
    throw err;
  }
};

const UpdateEventApproval = async (application) => {
  try {
    // console.log("Application", application);
    await axios.put(
      `${URL.BASE_URL}/api/EventEntity/update-eventApproval`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return true;
  } catch (err) {
    throw err;
  }
};

const UpdateEventAcknowledge = async (application) => {
  try {
    // console.log("Application", application);
    await axios.put(
      `${URL.BASE_URL}/api/EventEntity/update-eventack`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return true;
  } catch (err) {
    throw err;
  }
};

const AddBusinessApprovalRequest = async (application) => {
  try {
    await axios.put(
      `${URL.BASE_URL}/api/BusinessRequest/update-businessApproval`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return true;
  } catch (err) {
    throw err;
  }
};

const AddVCBHomeApprovalRequest = async (application) => {
  try {
    await axios.post(
      `${URL.BASE_URL}/api/Approvals/AddApproval`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return true;
  } catch (err) {
    throw err;
  }
};

const AddHRHomeApprovalRequest = async (application) => {
  try {
    await axios.put(
      `${URL.BASE_URL}/api/Hr/UpdateHrData`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return true;
  } catch (err) {
    throw err;
  }
};

const SaveEvent = async (application) => {
  try {
    const response = await axios.post(
      `${URL.BASE_URL}/api/EventEntity/add-event`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (err) {
    console.error("Error in SaveEvent:", err);
    throw err;
  }
};
const ReturnRequesttoRequester = async (application) => {
  try {
    await axios.post(
      `${URL.BASE_URL}/api/EventEntity/return-request-for-revision/`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return true;
  } catch (err) {
    throw err;
  }
};
// const UpdateFiles = async (
//   EventId,
//   passportData = [],
//   OfficeOfPresedentFile,
//   LedOfTheUniversityOrganizerFile,
//   VisitAgendaFile
// ) => {
//   try {
//     const formData = new FormData();
//     formData.append("EventId", EventId);
//     if (Array.isArray(passportData) && passportData.length > 0) {
//       passportData.forEach((file) => {
//         formData.append("passportData", file);
//       });
//     }

//     if (OfficeOfPresedentFile)
//       formData.append("OfficeOfPresedentFile", OfficeOfPresedentFile);
//     if (LedOfTheUniversityOrganizerFile)
//       formData.append(
//         "LedOfTheUniversityOrganizerFile",
//         LedOfTheUniversityOrganizerFile
//       );
//     if (VisitAgendaFile) formData.append("VisitAgendaFile", VisitAgendaFile);
//     for (let pair of formData.entries()) {
//       console.log(`FormData Key: ${pair[0]}, Value:`, pair[1]);
//     }

//     const response = await axios.put(
//       `${URL.BASE_URL}/api/EventEntity/update-files/${EventId}`,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     console.log("Files uploaded successfully:", response.data); // Debugging
//   } catch (error) {
//     console.error("Error uploading files:", error);
//     throw error;
//   }
// };
const UpdateFiles = async (
  EventId,
  passportData = [],
  OfficeOfPresedentFile,
  LedOfTheUniversityOrganizerFile,
  VisitAgendaFile
) => {
  try {
    console.log("✅ PassportDATA (before processing):", passportData);

    const formData = new FormData();
    formData.append("EventId", EventId);

    // ✅ Check if passportData contains files
    if (Array.isArray(passportData) && passportData.length > 0) {
      passportData.flat().forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`passportData`, file);
        } else {
          console.error(
            `❌ passportData[${index}] is not a File object:`,
            file
          );
        }
      });
    } else {
      console.warn("⚠️ passportData is empty or not an array.");
    }

    if (OfficeOfPresedentFile) {
      formData.append("OfficeOfPresedentFile", OfficeOfPresedentFile);
    }

    if (LedOfTheUniversityOrganizerFile) {
      formData.append(
        "LedOfTheUniversityOrganizerFile",
        LedOfTheUniversityOrganizerFile
      );
    }

    if (VisitAgendaFile) {
      formData.append("VisitAgendaFile", VisitAgendaFile);
    }

    // ✅ Debugging FormData before sending
    console.log("🚀 FormData before sending:");
    for (let pair of formData.entries()) {
      console.log(`📂 Key: ${pair[0]}, Value:`, pair[1]);
    }

    // ✅ Send request to backend
    const response = await axios.put(
      `${URL.BASE_URL}/api/EventEntity/update-files/${EventId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Files uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error uploading files:", error);
    throw error;
  }
};
const AddFiles = async (
  EventId,
  passportData = [],
  OfficeOfPresedentFile,
  LedOfTheUniversityOrganizerFile,
  VisitAgendaFile
) => {
  try {
    console.log("✅ PassportDATA (before processing):", passportData);

    const formData = new FormData();
    formData.append("EventId", EventId);

    // ✅ Check if passportData contains files
    if (Array.isArray(passportData) && passportData.length > 0) {
      passportData.flat().forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`passportData`, file);
        } else {
          console.error(
            `❌ passportData[${index}] is not a File object:`,
            file
          );
        }
      });
    } else {
      console.warn("⚠️ passportData is empty or not an array.");
    }

    if (OfficeOfPresedentFile) {
      formData.append("OfficeOfPresedentFile", OfficeOfPresedentFile);
    }

    if (LedOfTheUniversityOrganizerFile) {
      formData.append(
        "LedOfTheUniversityOrganizerFile",
        LedOfTheUniversityOrganizerFile
      );
    }

    if (VisitAgendaFile) {
      formData.append("VisitAgendaFile", VisitAgendaFile);
    }

    // ✅ Debugging FormData before sending
    console.log("🚀 FormData before sending:");
    for (let pair of formData.entries()) {
      console.log(`📂 Key: ${pair[0]}, Value:`, pair[1]);
    }

    // ✅ Send request to backend
    const response = await axios.post(
      `${URL.BASE_URL}/api/EventEntity/add-files`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Files uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error uploading files:", error);
    throw error;
  }
};

const ConfrimEventRequest = async (eventId) => {
  try {
    await axios.post(
      `${URL.BASE_URL}/api/EventEntity/submit/${eventId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return true;
  } catch (err) {
    throw err;
  }
};

const UpdateEventRequest = async (eventid, application) => {
  try {
    await axios.put(
      `${URL.BASE_URL}/api/EventEntity/update/${eventid}`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return true;
  } catch (err) {
    throw err;
  }
};

const AddBudgetOfficeEventRequest = async (application) => {
  try {
    await axios.put(
      `${URL.BASE_URL}/api/EventEntity/update-budget-office-data/${application.eventId}`,
      { ...application },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return true;
  } catch (err) {
    throw err;
  }
};

export {
  DeleteHomeRequest,
  SaveHomeTravel,
  UpdateHomeRequest,
  AddHomeApprovalRequest,
  AddVCBHomeApprovalRequest,
  AddHRHomeApprovalRequest,
  SaveBusinessTravel,
  UpdateBusinessRequest,
  DeleteBusinessRequest,
  UpdateHRAllowance,
  UpdateTOData,
  UpdateBOData,
  AddBusinessApprovalRequest,
  UpdateBOMData,
  ConfrimBusinessRequest,
  SaveEvent,
  ConfrimEventRequest,
  UpdateEventRequest,
  AddFiles,
  UpdateFiles,
  UpdateEventApproval,
  UpdateEventAcknowledge,
  AddBudgetOfficeEventRequest,
  ReturnRequesttoRequester,
};
