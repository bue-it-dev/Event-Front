import React from "react";
import { toast } from "react-toastify";

const JSONToCSVDownloader = ({ data, headers, filename = "data.csv" }) => {
  const convertJSONToCSV = (jsonData, columnHeaders) => {
    // Check if jsonData is an array or an object
    const isArrayData = Array.isArray(jsonData);

    // Convert object data (type 1) to an array with a single row
    const dataArray = isArrayData ? jsonData : [jsonData];

    // Construct CSV header row
    const headerRow = columnHeaders.join(",") + "\n";

    // Construct CSV data rows
    const dataRows = dataArray
      .map((row) => columnHeaders.map((field) => row[field] || "").join(","))
      .join("\n");

    return headerRow + dataRows;
  };

  const downloadCSV = () => {
    if (data.length === 0) {
      alert("No data to export");
      toast.error("No data to export", {
        position: "top-center",
      });
      return;
    }
    const csv = convertJSONToCSV(data, headers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const buttonStyle = {
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    padding: "8px 16px", // Reduced padding
    fontSize: "14px", // Reduced font size
    fontWeight: "bold",
    borderRadius: "6px", // Slightly smaller border radius
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const hoverStyle = {
    backgroundColor: "#007400",
    transform: "scale(1.05)",
  };

  return (
    <button
      onClick={downloadCSV}
      style={buttonStyle}
      onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
      onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
    >
      Export CSV
    </button>
  );
};

export default JSONToCSVDownloader;
