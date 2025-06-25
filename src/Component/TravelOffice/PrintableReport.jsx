import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import "./PrintableBusinessReport.css"; // Import the new CSS file
import axios from "axios";
import { getToken } from "../Util/Authenticate";
import APIURL from "../Util/config";

const PrintableBusinessReport = ({ data, onAfterPrint, requestId, status }) => {
  const reportRef = useRef();
  const [approvalTracker, setApprovalTracker] = React.useState([]);

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: "Home Leave Report",
    onAfterPrint, // Call the provided callback after printing
  });
  const GetApprovalsTracker = async (requestId) => {
    try {
      const response = await axios.post(
        `${APIURL.BASE_URL}/api/Approvals/GetHomeRequestApprovalsbyRequestID`,
        requestId,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Ensure the response data is an array or wrap it in one if it's an object
      const responseData = Array.isArray(response.data)
        ? response.data
        : [response.data];

      // Format the createdAt date for each item
      // Format the createdAt date for each item
      const formattedData = responseData.map((item) => ({
        ...item,
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "",
      }));

      setApprovalTracker(formattedData);
    } catch (error) {
      console.error("Error fetching home request details:", error);
    }
  };
  // Automatically trigger the print dialog when the component is shown
  useEffect(() => {
    if (status !== "Pending" && requestId) {
      GetApprovalsTracker(requestId);
    }
  }, [requestId, status]);

  useEffect(() => {
    if (approvalTracker.length > 0) {
      handlePrint(); // Trigger print after data is loaded
    }
  }, [approvalTracker]);

  return (
    <div style={{ display: "none" }}>
      {/* Report Content */}
      <div ref={reportRef} className="report-container">
        <h2 className="report-title">Home Leave Report</h2>
        <section className="report-section">
          <h3 className="section-title">Contact Details</h3>
          <p>
            <strong>Request Serial:</strong> {data.serial}
          </p>
          <p>
            <strong>Contact Email:</strong> {data.email}
          </p>
        </section>
        {/* Travel Details Section */}
        <section className="report-section">
          <h3 className="section-title">Passport Details</h3>
          <p>
            <strong>Name (Per Passport):</strong> {data.passportName}
          </p>
          <p>
            <strong>Passport Number:</strong> {data.passportNumber}
          </p>
          <p>
            <strong>Passport Issue Date:</strong> {data.issueDate.split("T")[0]}
          </p>
          <p>
            <strong>Passport Expiry Date:</strong>{" "}
            {data.expiryDate.split("T")[0]}
          </p>
          <p>
            <strong>Birth Date (Per Passport):</strong> {data.dateOfBirth}
          </p>
        </section>
        <section className="report-section">
          <h3 className="section-title">Trip Details</h3>
          <div className="flex-column">
            <p>
              <strong>Flight Class:</strong>{" "}
              {data.planeClassID == 2
                ? "Business Class"
                : data.planeClassID == 4
                ? "Economy Class"
                : "No Flight Recorded"}
            </p>
            <div className="flex-row">
              <p>
                <strong>From Airport:</strong> {data.firstDepartureAirportName}
              </p>
              <p>
                <strong>To Airport:</strong> {data.firstArrivalAirportName}
              </p>
            </div>
            <div className="flex-row">
              <p>
                <strong>From Airport:</strong> {data.secondDepartureAirportName}
              </p>
              <p>
                <strong>To Airport:</strong> {data.secondArrivalAirportName}
              </p>
            </div>
            <div className="flex-row">
              <p>
                <strong>Departure Date:</strong>{" "}
                {data.departureDate.split("T")[0]}
              </p>
              <p>
                <strong>Return Date:</strong> {data.arrivalDate.split("T")[0]}
              </p>
            </div>
          </div>
        </section>
        {/* Business Travelers Table */}
        <section className="report-section">
          <h3 className="section-title">Number of Travelers (If Any)</h3>
          <table className="print-report-table">
            <thead>
              <tr>
                <th>Name (as in Passport)</th>
                <th>Relation</th>
                <th>Passport Number</th>
                <th>Passport Issue Date</th>
                <th>Passport Expiry Date</th>
                <th>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {data.dependentTravellers.map((traveller, index) => (
                <tr key={index}>
                  <td>{traveller.name}</td>
                  <td>{traveller.relation}</td>
                  <td>{traveller.passportNumber}</td>
                  <td>{traveller.issueDate}</td>
                  <td>{traveller.expiryDate}</td>
                  <td>{traveller.dateOfBirth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="report-section">
          <h3 className="section-title">Human Resources Details</h3>
          <p>
            <strong>Allowance Start Date:</strong> {data.allowanceStartDate}
          </p>
          <p>
            <strong>Allowance End Date:</strong> {data.allowanceEndDate}
          </p>
          <p>
            <strong>Round Trip Ticket Status:</strong> {data.hasRoudnTicketName}
          </p>
          <p>
            <strong>Remaining Balance:</strong>{" "}
            {data.remainingBalance == null
              ? "No Remaingin Balance"
              : data.remainingBalance}
          </p>
          <p>
            <strong>Remaining Balance:</strong>{" "}
            {data.remainingBalance == null
              ? "No Remaingin Balance"
              : data.remainingBalance}
          </p>
        </section>
        {status != "Pending" ? (
          <>
            {/* Business Travelers Approval Breakdown Table */}
            <section className="report-section">
              <h3 className="section-title">Approvals Breakdown</h3>
              {approvalTracker.length > 0 ? (
                <table className="print-report-table">
                  <thead>
                    <tr>
                      <th>Approved By</th>
                      <th>Approval Level</th>
                      <th>Status</th>
                      <th>Approved At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalTracker.map((allowance, index) => (
                      <tr key={index}>
                        <td>{allowance.userName}</td>
                        <td>
                          {allowance.approvalLevelName ===
                          "Business_operation_manager"
                            ? "Business Operation Manager"
                            : allowance.approvalLevelName}
                        </td>
                        <td>{allowance.statusName}</td>
                        <td>{allowance.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Loading approval data...</p>
              )}
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PrintableBusinessReport;
