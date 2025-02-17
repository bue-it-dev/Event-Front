import React from "react";
import { TextValidator } from "react-material-ui-form-validator";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import axios from "axios";
import Select from "react-select";
const TravellersListInfo = ({ index, hometravelData, sethometravelData }) => {
  const [employeelist, setEmployeeList] = React.useState([]);
  // Get List of Approval Department Schema
  const GetEmployeeList = () => {
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/BusinessRequest/get-all-employees-names`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    axios(config)
      .then(function (response) {
        setEmployeeList(
          response.data.map((employee) => ({
            value: employee.empId,
            label: employee.fullname,
          }))
        );
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  React.useEffect(() => {
    GetEmployeeList();
  }, []);
  return (
    <div className="mt-3 flex-grow-1" style={{ gap: "1rem" }} key={index}>
      <div className="row">
        {/* Searchable Dropdown for Traveller Name */}
        {hometravelData.travelType != 3 ? (
          <>
            <div className="mb-3 flex-grow-1">
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable
                isSearchable
                name="approvingDepartment"
                options={[
                  ...employeelist,
                  { value: -1, label: "Others" }, // Add the "Others" option
                ]}
                value={
                  // Find the selected option in the combined list
                  [...employeelist, { value: -1, label: "Others" }].find(
                    (option) =>
                      option.value ===
                      hometravelData.businessTravellrers[index]?.empId
                  ) || null
                }
                onChange={(selectedOption) => {
                  const newBusinessTravellers = [
                    ...hometravelData.businessTravellrers,
                  ];
                  newBusinessTravellers[index] = {
                    ...newBusinessTravellers[index],
                    empId: selectedOption ? selectedOption.value : "",
                  };
                  sethometravelData({
                    ...hometravelData,
                    businessTravellrers: newBusinessTravellers,
                  });
                }}
                required
                placeholder="Select Traveler Name"
                styles={{
                  option: (provided) => ({
                    ...provided,
                    textAlign: "left", // Aligns the dropdown options to the left
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    textAlign: "left", // Aligns the selected value to the left
                  }),
                }}
              />
            </div>
          </>
        ) : null}
        <br />
        {/* Name (Per Passport) */}
        <div className="col-md-6 mb-4">
          {" "}
          {/* Adjust column width to 6 for full width */}
          <div className="form-outline">
            <TextValidator
              type="text"
              id={`requesterName-${index}`}
              className="form-control-lg w-100"
              value={
                hometravelData.businessTravellrers[index]?.requesterName || ""
              }
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z ]*$/.test(value) && value.trim() !== "") {
                  const newBusinessTravellers = [
                    ...hometravelData.businessTravellrers,
                  ];
                  newBusinessTravellers[index] = {
                    ...newBusinessTravellers[index],
                    requesterName: value,
                  };
                  sethometravelData({
                    ...hometravelData,
                    businessTravellrers: newBusinessTravellers,
                  });
                } else if (value === "") {
                  const newBusinessTravellers = [
                    ...hometravelData.businessTravellrers,
                  ];
                  newBusinessTravellers[index] = {
                    ...newBusinessTravellers[index],
                    requesterName: value,
                  };
                  sethometravelData({
                    ...hometravelData,
                    businessTravellrers: newBusinessTravellers,
                  });
                }
              }}
              required
              validators={["required", "matchRegexp:^[a-zA-Z ]*$"]}
              errorMessages={[
                "this field is required",
                "only characters are allowed",
              ]}
              name={`requesterName-${index}`}
              label="Name (As Per Passport)"
            />
          </div>
        </div>
        {/* Passport Number */}
        <div className="col-md-6 mb-4">
          {" "}
          {/* Adjust column width to 6 for full width */}
          <div className="form-outline">
            <TextValidator
              type="text"
              id={`requesterPassportNumber-${index}`}
              className="form-control-lg w-100"
              value={
                hometravelData.businessTravellrers[index]
                  ?.requesterPassportNumber || ""
              }
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z0-9]*$/.test(value)) {
                  const newBusinessTravellers = [
                    ...hometravelData.businessTravellrers,
                  ];
                  newBusinessTravellers[index] = {
                    ...newBusinessTravellers[index],
                    requesterPassportNumber: value,
                  };
                  sethometravelData({
                    ...hometravelData,
                    businessTravellrers: newBusinessTravellers,
                  });
                } else if (value === "") {
                  const newBusinessTravellers = [
                    ...hometravelData.businessTravellrers,
                  ];
                  newBusinessTravellers[index] = {
                    ...newBusinessTravellers[index],
                    requesterPassportNumber: value,
                  };
                  sethometravelData({
                    ...hometravelData,
                    businessTravellrers: newBusinessTravellers,
                  });
                }
              }}
              required
              validators={["required", "matchRegexp:^[a-zA-Z0-9]*$"]}
              errorMessages={[
                "this field is required",
                "only characters and numbers are allowed",
              ]}
              name={`requesterPassportNumber-${index}`}
              label="Passport Number"
            />
          </div>
        </div>
      </div>

      <div className="row">
        {/* Passport Issue Date */}
        <div className="col-md-4 mb-4">
          <label
            htmlFor={`requesterPassportIssueDate-${index}`}
            className="form-label fs-6"
          >
            Passport Issue Date:
          </label>
          <input
            type="date"
            id={`requesterIssueDate-${index}`}
            name={`requesterIssueDate-${index}`}
            value={
              hometravelData.businessTravellrers[index]?.passportIssueDate || ""
            }
            onChange={(e) => {
              const newBusinessTravellers = [
                ...hometravelData.businessTravellrers,
              ];
              newBusinessTravellers[index] = {
                ...newBusinessTravellers[index],
                passportIssueDate: e.target.value,
              };
              sethometravelData({
                ...hometravelData,
                businessTravellrers: newBusinessTravellers,
              });
            }}
            className="form-control form-control-lg"
            required
            //max={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Passport Expiry Date */}
        <div className="col-md-4 mb-4">
          <label
            htmlFor={`requesterPassportExpiryDate-${index}`}
            className="form-label fs-6"
          >
            Passport Expiry Date:
          </label>
          <input
            type="date"
            id={`requesterExpiryDate-${index}`}
            name={`requesterExpiryDate-${index}`}
            value={
              hometravelData.businessTravellrers[index]?.passportExpiryDate ||
              ""
            }
            onChange={(e) => {
              const newBusinessTravellers = [
                ...hometravelData.businessTravellrers,
              ];
              newBusinessTravellers[index] = {
                ...newBusinessTravellers[index],
                passportExpiryDate: e.target.value,
              };
              sethometravelData({
                ...hometravelData,
                businessTravellrers: newBusinessTravellers,
              });
            }}
            className="form-control form-control-lg"
            required
            //min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Birth Date */}
        <div className="col-md-4 mb-4">
          <label
            htmlFor={`requesterBirthDate-${index}`}
            className="form-label fs-6"
          >
            Birth Date:
          </label>
          <input
            type="date"
            id={`requesterDateOfBirth-${index}`}
            name={`requesterDateOfBirth-${index}`}
            value={
              hometravelData.businessTravellrers[index]?.requesterBirthDate ||
              ""
            }
            onChange={(e) => {
              const newBusinessTravellers = [
                ...hometravelData.businessTravellrers,
              ];
              newBusinessTravellers[index] = {
                ...newBusinessTravellers[index],
                requesterBirthDate: e.target.value,
              };
              sethometravelData({
                ...hometravelData,
                businessTravellrers: newBusinessTravellers,
              });
            }}
            className="form-control form-control-lg"
            required
            //max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        className="btn btn-lg"
        style={{
          color: "darkred",
          borderRadius: "50%",
          padding: "10px",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          const newBusinessTravellers =
            hometravelData.businessTravellrers.filter((_, i) => i !== index);

          sethometravelData({
            ...hometravelData,
            businessTravellrers: newBusinessTravellers,
            travellerList: newBusinessTravellers.length, // Update the traveller count
          });
        }}
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
};

export default TravellersListInfo;
