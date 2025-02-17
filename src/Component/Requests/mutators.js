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
};
