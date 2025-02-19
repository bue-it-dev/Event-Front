import React from 'react';

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

  return (
    <div>
      {/* Passport file inputs (dynamically added) */}
      {passportFiles.map((fileArray, index) => (
        <div key={index}>
          <label htmlFor={`passportData${index}`}>Upload Passport Files (Traveler {index + 1}):</label>
          <input
            type="file"
            id={`passportData${index}`}
            name={`passportData[${index}]`}
            multiple
            onChange={(e) => handleFileChange(e, index)} // Handle file changes per index
          />
        </div>
      ))}

      <button type="button" onClick={addPassportInput}>
        Add Another Passport
      </button>
    </div>
  );
};

export default PassportFilesSection;
