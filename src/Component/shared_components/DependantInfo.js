import React from "react";
import { TextValidator } from "react-material-ui-form-validator";

const DependantInfo = ({ index, hometravelData, sethometravelData }) => {
  return (
    <div style={{ gap: "1rem" }} key={index}>
      <div className="row">
        {/* Name (Per Passport) */}
        <div className="col-md-4 mb-4">
          <div className="form-outline">
            <TextValidator
              type="text"
              id={`dependentName-${index}`}
              className="form-control-lg"
              value={hometravelData.dependentTravelerName[index] || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z ]*$/.test(value) && value.trim() !== "") {
                  const newNames = [...hometravelData.dependentTravelerName];
                  newNames[index] = value;
                  sethometravelData({
                    ...hometravelData,
                    dependentTravelerName: newNames,
                  });
                } else if (value === "") {
                  const newNames = [...hometravelData.dependentTravelerName];
                  newNames[index] = value;
                  sethometravelData({
                    ...hometravelData,
                    dependentTravelerName: newNames,
                  });
                }
              }}
              required
              validators={["required", "matchRegexp:^[a-zA-Z ]*$"]}
              errorMessages={[
                "this field is required",
                "only characters are allowed",
              ]}
              name={`dependentName-${index}`}
              label="Name (Per Passport)"
            />
          </div>
        </div>

        {/* Passport Number */}
        <div className="col-md-4 mb-4">
          <div className="form-outline">
            <TextValidator
              type="text"
              id={`dependentPassportNumber-${index}`}
              className="form-control-lg"
              value={hometravelData.dependentPassportNumber[index] || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z0-9]*$/.test(value)) {
                  const newNames = [...hometravelData.dependentPassportNumber];
                  newNames[index] = value;
                  sethometravelData({
                    ...hometravelData,
                    dependentPassportNumber: newNames,
                  });
                } else if (value === "") {
                  const newNames = [
                    ...hometravelData.dependentTravelerPassportNumber,
                  ];
                  newNames[index] = value;
                  sethometravelData({
                    ...hometravelData,
                    dependentPassportNumber: newNames,
                  });
                }
              }}
              required
              validators={["required", "matchRegexp:^[a-zA-Z0-9]*$"]}
              errorMessages={[
                "this field is required",
                "only characters and numbers are allowed",
              ]}
              name={`dependentPassportNumber-${index}`}
              label="Passport Number"
            />
          </div>
        </div>

        {/* Relation */}
        <div className="col-md-4 mb-4">
          <div className="form-outline">
            <TextValidator
              type="text"
              id={`relation-${index}`}
              className="form-control-lg"
              value={hometravelData.relation[index] || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z ]*$/.test(value) && value.trim() !== "") {
                  const newRelations = [...hometravelData.relation];
                  newRelations[index] = value;
                  sethometravelData({
                    ...hometravelData,
                    relation: newRelations,
                  });
                } else if (value === "") {
                  const newRelations = [...hometravelData.relation];
                  newRelations[index] = value;
                  sethometravelData({
                    ...hometravelData,
                    relation: newRelations,
                  });
                }
              }}
              required
              validators={["required", "matchRegexp:^[a-zA-Z ]*$"]}
              errorMessages={[
                "this field is required",
                "only characters are allowed",
              ]}
              name={`relation-${index}`}
              label="Relation"
            />
          </div>
        </div>
      </div>

      <div className="row">
        {/* Passport Issue Date */}
        <div className="col-md-4 mb-4">
          <label
            htmlFor={`dependentPassportIssueDate-${index}`}
            className="form-label fs-6"
          >
            Passport Issue Date:
          </label>
          <input
            type="date"
            id={`dependentIssueDate-${index}`}
            name={`dependentIssueDate-${index}`}
            value={hometravelData.dependentIssueDate[index] || ""}
            onChange={(e) => {
              const newDates = [...hometravelData.dependentIssueDate];
              newDates[index] = e.target.value;
              sethometravelData({
                ...hometravelData,
                dependentIssueDate: newDates,
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
            htmlFor={`dependentPassportExpiryDate-${index}`}
            className="form-label fs-6"
          >
            Passport Expiry Date:
          </label>
          <input
            type="date"
            id={`dependentExpiryDate-${index}`}
            name={`dependentExpiryDate-${index}`}
            value={hometravelData.dependentExpiryDate[index] || ""}
            onChange={(e) => {
              const newDates = [...hometravelData.dependentExpiryDate];
              newDates[index] = e.target.value;
              sethometravelData({
                ...hometravelData,
                dependentExpiryDate: newDates,
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
            htmlFor={`dependentBirthDate-${index}`}
            className="form-label fs-6"
          >
            Birth Date:
          </label>
          <input
            type="date"
            id={`dependentDateOfBirth-${index}`}
            name={`dependentDateOfBirth-${index}`}
            value={hometravelData.dependentDateOfBirth[index] || ""}
            onChange={(e) => {
              const newDates = [...hometravelData.dependentDateOfBirth];
              newDates[index] = e.target.value;
              sethometravelData({
                ...hometravelData,
                dependentDateOfBirth: newDates,
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
          const newNames = hometravelData.dependentTravelerName.filter(
            (_, i) => i !== index
          );
          const newRelations = hometravelData.relation.filter(
            (_, i) => i !== index
          );
          const newPassportNumbers =
            hometravelData.dependentPassportNumber.filter(
              (_, i) => i !== index
            );
          const newIssueDates = hometravelData.dependentIssueDate.filter(
            (_, i) => i !== index
          );
          const newExpiryDates = hometravelData.dependentExpiryDate.filter(
            (_, i) => i !== index
          );
          const newBirthDates = hometravelData.dependentDateOfBirth.filter(
            (_, i) => i !== index
          );

          sethometravelData({
            ...hometravelData,
            dependentTravelerName: newNames,
            relation: newRelations,
            dependentPassportNumber: newPassportNumbers,
            dependentIssueDate: newIssueDates,
            dependentExpiryDate: newExpiryDates,
            dependentDateOfBirth: newBirthDates,
            hasDependent: newNames.length,
          });
        }}
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
};

export default DependantInfo;
