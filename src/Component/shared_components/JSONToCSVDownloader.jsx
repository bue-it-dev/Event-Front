import React from "react";
import { toast } from "react-toastify";

const JSONToCSVDownloader = ({ data, headers, filename = "data.csv" }) => {
  const formatValue = (value) => {
    // Handle null, undefined, empty string, and zero values
    if (value === null || value === undefined || value === "" || value === 0) {
      return "0";
    }
    return value;
  };

  const convertJSONToCSV = (jsonData, columnHeaders) => {
    // Check if jsonData is an array or an object
    const isArrayData = Array.isArray(jsonData);
    // Convert object data (type 1) to an array with a single row
    const dataArray = isArrayData ? jsonData : [jsonData];

    // Handle both array of strings and array of objects for headers
    const headerLabels = columnHeaders.map((header) =>
      typeof header === "string" ? header : header.label
    );
    const headerKeys = columnHeaders.map((header) =>
      typeof header === "string" ? header : header.key
    );

    // Construct CSV header row with custom labels
    const headerRow = headerLabels.join(",") + "\n";

    // Construct CSV data rows using the keys and format values
    const dataRows = dataArray
      .map((row) =>
        headerKeys.map((field) => formatValue(row[field])).join(",")
      )
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
    backgroundColor: "#57636f",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    fontSize: "0.7rem",
    fontWeight: "bold",
    borderRadius: "6px",
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
