import React from "react";

const PassportFilesSection = ({ passportFiles, setPassportFiles }) => {
  // Handle file changes for specific passport input
  const handleFileChange = (e, index) => {
    const { files } = e.target;

    const newPassportFiles = [...passportFiles];
    newPassportFiles[index] = files; // Store files for the specific passport input
    setPassportFiles(newPassportFiles);
  };

  // Add a new passport file input
  const addPassportInput = () => {
    setPassportFiles([...passportFiles, []]); // Add a new empty array for the new passport input
  };
  const removePassportInput = (index) => {
    setPassportFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="container-fluid">
      <div className="card shadow-sm px-5 py-4 w-100 mx-auto">
        {/* Passport file inputs (dynamically added) */}
        {passportFiles.map((fileArray, index) => (
          <div key={index} className="card shadow-sm p-3 mt-3">
            <div className="d-flex justify-content-between align-items-center">
              <label
                htmlFor={`passportData${index}`}
                className="form-label text-dark font-weight-bold"
                style={{ fontSize: "14px" }}
              >
                Upload Passport Files (Traveler {index + 1}):
              </label>

              {/* Delete Button */}
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
          </div>
        ))}

        {/* Add Another Passport Button */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-outline-primary btn-lg"
            onClick={addPassportInput}
            style={{ fontSize: "14px" }}
          >
            + Add Passport
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassportFilesSection;
