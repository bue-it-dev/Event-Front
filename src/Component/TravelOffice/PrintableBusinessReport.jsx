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
    documentTitle: "Business Leave Report",
    onAfterPrint, // Call the provided callback after printing
  });
  const GetBusinessApprovalsTracker = async (requestId) => {
    try {
      const response = await axios.post(
        `${APIURL.BASE_URL}/api/Approvals/GetBusinessRequestApprovalsbyRequestID`,
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
      const formattedData = responseData.map((item) => ({
        ...item,
        createdAt: item.createdAt ? item.createdAt.split("T")[0] : "",
      }));

      setApprovalTracker(formattedData);
    } catch (error) {
      console.error("Error fetching home request details:", error);
    }
  };
  // Automatically trigger the print dialog when the component is shown
  useEffect(() => {
    if (status !== "Pending" && requestId) {
      GetBusinessApprovalsTracker(requestId);
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
        <h2 className="report-title">Business Leave Report</h2>

        {/* Travel Details Section */}
        <section className="report-section">
          <h3 className="section-title">Travel Details</h3>
          <p>
            <strong>Request Serial:</strong> {data.serial}
          </p>
          <p>
            <strong>Contact Email:</strong> {data.email}
          </p>
          <p>
            <strong>Travel Type:</strong>{" "}
            {data.travelType == 1
              ? "Domestic"
              : data.travelType == 2
              ? "International"
              : data.travelType == 3
              ? "Guest"
              : "NO type Recorded"}
          </p>
          <p>
            <strong>Budget Line Type:</strong>{" "}
            {data.budgetlineType == 1 ? "Business Budget" : "Research Budget"}
          </p>
          <p>
            <strong>Budget Line Name:</strong> {data.budgetlineName}
          </p>
          <p className="travel-purpose">
            <strong>Travel Purpose:</strong> {data.travelPurpose}
          </p>
          <p>
            <strong>Event Start Date:</strong> {data.eventStartDate}
          </p>
          <p>
            <strong>Event End Date:</strong> {data.eventEndDate}
          </p>
        </section>
        {data.hasTransportation == 1 ? (
          <>
            {/* Transportation Details */}
            <section className="report-section">
              <h3 className="section-title">Transfer Details</h3>
              <p>
                <strong>Type:</strong>{" "}
                {data.transportation.transportationType == "selfTransfer"
                  ? "Other"
                  : data.transportation.transportationType}
              </p>
              {data.transportation.transportationType == "selfTransfer" ? (
                <>
                  <p>
                    <strong>Transfer method:</strong>{" "}
                    {data.transportation.otherTransferId == 1
                      ? "Car"
                      : data.transportation.otherTransferId == 2
                      ? "Train"
                      : data.transportation.otherTransferId == 3
                      ? "Bus"
                      : null}
                  </p>
                  <p>
                    <strong>Notes:</strong>{" "}
                    {data.transportation.selfTransferNotes}
                  </p>
                  <p>
                    <strong>Amount:</strong>{" "}
                    {data.transportation.amount == null ||
                    data.transportation.amount == ""
                      ? "Not Inserted Yet"
                      : data.transportation.amount}{" "}
                    <strong>Currency:</strong>{" "}
                    {data.transportation.currency == null ||
                    data.transportation.currency == ""
                      ? "Not Inserted Yet"
                      : data.transportation.currency}
                  </p>
                </>
              ) : (
                <>
                  <section className="report-section">
                    <div className="flex-column">
                      <p>
                        <strong>Flight Class:</strong>{" "}
                        {data.transportation.planeClassId == 2
                          ? "Business Class"
                          : data.transportation.planeClassId == 4
                          ? "Economy Class"
                          : "No Flight Recorded"}
                      </p>
                      <div className="flex-row">
                        <p>
                          <strong>From Airport:</strong>{" "}
                          {data.transportation.firstDepartureAirportName}
                        </p>
                        <p>
                          <strong>To Airport:</strong>{" "}
                          {data.transportation.firstArrivalAirportName}
                        </p>
                      </div>
                      <div className="flex-row">
                        <p>
                          <strong>From Airport:</strong>{" "}
                          {data.transportation.secondDepartureAirportName}
                        </p>
                        <p>
                          <strong>To Airport:</strong>{" "}
                          {data.transportation.secondArrivalAirportName}
                        </p>
                      </div>
                      <div className="flex-row">
                        <p>
                          <strong>Departure Date:</strong>{" "}
                          {data.transportation.departureDate.split("T")[0]}
                        </p>
                        <p>
                          <strong>Return Date:</strong>{" "}
                          {data.transportation.arrivalDate.split("T")[0]}
                        </p>
                      </div>
                      <div className="flex-row">
                        <p>
                          <strong>Amount:</strong>{" "}
                          {data.transportation.amount == null ||
                          data.transportation.amount == ""
                            ? "Not Inserted Yet"
                            : data.transportation.amount}{" "}
                          <strong>Currency:</strong>{" "}
                          {data.transportation.currency == null ||
                          data.transportation.currency == ""
                            ? "Not Inserted Yet"
                            : data.transportation.currency}
                        </p>
                      </div>
                    </div>
                  </section>
                </>
              )}
              {/* <p>
                <strong>Amount:</strong>{" "}
                {data.transportation.amount == null ||
                data.transportation.amount == ""
                  ? "Not Inserted Yet"
                  : data.transportation.amount}{" "}
                <strong>Currency:</strong>{" "}
                {data.transportation.currency == null ||
                data.transportation.currency == ""
                  ? "Not Inserted Yet"
                  : data.transportation.currency}
              </p> */}
            </section>
          </>
        ) : null}
        {data.hasAccomdation == 1 ? (
          <>
            {/* Accommodation Details */}
            <section className="report-section">
              <h3 className="section-title">Accommodation Details</h3>
              <p>
                <strong>Event Venue:</strong> {data.accomdation.eventVenue}
              </p>
              <p>
                <strong>Preferred Hotel:</strong>{" "}
                {data.accomdation.preferredHotel}
              </p>
              <p>
                <strong>Room Count:</strong> {data.accomdation.singleRoomCount}{" "}
                Single, {data.accomdation.doubleRoomCount} Double,{" "}
                {data.accomdation.tripleRoomCount} Triple
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                {data.accomdation.amount == null ||
                data.accomdation.amount == ""
                  ? "Not Inserted Yet"
                  : data.accomdation.amount}{" "}
                <strong>Currency:</strong>{" "}
                {data.accomdation.currency == null ||
                data.accomdation.currency == ""
                  ? "Not Inserted Yet"
                  : data.accomdation.currency}
              </p>
            </section>
          </>
        ) : null}
        {data.hasRegistrationFee == 1 ? (
          <>
            <section className="report-section">
              <h3 className="section-title">Participation Fee Details</h3>
              <p>
                <strong>Amount:</strong>{" "}
                {data.registrationFeeAmount == null ||
                data.registrationFeeAmount == ""
                  ? "Not Inserted Yet"
                  : data.registrationFeeAmount}{" "}
                <strong>Currency:</strong>{" "}
                {data.registrationFeeCurrency == null ||
                data.registrationFeeCurrency == ""
                  ? "Not Inserted Yet"
                  : data.registrationFeeCurrency}
              </p>
            </section>
          </>
        ) : null}
        {data.hasVisa == 1 ? (
          <>
            <section className="report-section">
              <h3 className="section-title">Visa Details</h3>
              <p>
                <strong>Amount:</strong>{" "}
                {data.visaAmount == null || data.visaAmount == ""
                  ? "Not Inserted Yet"
                  : data.visaAmount}{" "}
                <strong>Currency:</strong>{" "}
                {data.visaCurrency == null || data.visaCurrency == ""
                  ? "Not Inserted Yet"
                  : data.visaCurrency}
              </p>
            </section>
          </>
        ) : null}
        <section className="report-section">
          <h3 className="section-title">Budget Office Section</h3>
          <p>
            <strong>Budget Code:</strong> {data.budgetCode}
          </p>
          <p>
            <strong>Budget Cost Center:</strong> {data.budgetCostCenter}
          </p>
          <p className="travel-purpose">
            <strong>Notes (Optional):</strong> {data.budgetNotes}
          </p>
        </section>
        {/* Business Travelers Table */}
        <section className="report-section">
          <h3 className="section-title">Business Travelers</h3>
          <table className="print-report-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Passport Number</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Birth Date</th>
              </tr>
            </thead>
            <tbody>
              {data.businessTravellrers.map((traveller, index) => (
                <tr key={index}>
                  <td>{traveller.requesterName}</td>
                  <td>{traveller.requesterPassportNumber}</td>
                  <td>{traveller.passportIssueDate}</td>
                  <td>{traveller.passportExpiryDate}</td>
                  <td>{traveller.requesterBirthDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {data.hasAllowance == 1 && data.budgetlineType == 1 ? (
          <>
            {/* Business Travelers Allowance Table */}
            <section className="report-section">
              <h3 className="section-title">Travelers Allowance</h3>
              <table className="print-report-table">
                <thead>
                  <tr>
                    <th>Traveller Name</th>
                    <th>Level</th>
                    <th>Per Diem/ Night</th>
                    <th>No of Nights</th>
                    <th>Total Per Diem</th>
                    <th>Currency</th>
                  </tr>
                </thead>
                <tbody>
                  {data.businessTravellrersAllowance.map((allowance, index) => (
                    <tr key={index}>
                      <td>{allowance.businessTravellerName}</td>
                      <td>
                        {allowance.travellerLevel == "1"
                          ? "Level 1"
                          : allowance.travellerLevel == "2"
                          ? "Level 2"
                          : allowance.travellerLevel == "3"
                          ? "Level 3"
                          : allowance.travellerLevel == "-1"
                          ? "Others"
                          : "N/A"}
                      </td>
                      <td>{allowance.diemPerNight}</td>
                      <td>{allowance.numberofNights}</td>
                      <td>{allowance.totalPerDiem}</td>
                      <td>{allowance.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        ) : null}

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
