import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import URL from "../Util/config";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import { AddHomeApprovalRequest } from "../Requests/mutators";
import { getToken } from "../Util/Authenticate";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { MDBDataTable } from "mdbreact";
import Table from "react-bootstrap/Table";
import PrintableReport from "./PrintableReport"; // Import the PrintableReport component
import { useReactToPrint } from "react-to-print";
import PrintableHomeTravelReport from "./PrintableReport";
import { toast } from "react-toastify";

const HomeRequestDetailsTravel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [planeClasses, setPlaneClasses] = useState([]);
  const location = useLocation();
  const history = useHistory();
  const requestId = useMemo(() => {
    if (location.state) {
      let saverequestId = JSON.stringify(location.state.requestId);
      localStorage.setItem("requestId", saverequestId);
      let saverequeststatus = JSON.stringify(location.state.statusname);
      localStorage.setItem("status", saverequeststatus);
    }
    return JSON.parse(localStorage.getItem("requestId"));
  }, [location.state]);

  let status = JSON.parse(localStorage.getItem("status"));

  const [homeTravelData, setHomeTravelData] = useState({
    requestId: requestId,
    planeClass: "",
    planeClassID: 0,
    numberOfDependents: 0,
    firstDepartureAirportName: "",
    firstArrivalAirportName: "",
    secondDepartureAirportName: "",
    secondArrivalAirportName: "",
    departureDate: null,
    arrivalDate: null,
    updatedAt: null,
    staffNameHr: "",
    allowanceStartDate: null,
    allowanceEndDate: null,
    remainingBalance: 0,
    passportName: "",
    passportNumber: "",
    issueDate: null,
    expiryDate: null,
    dateOfBirth: null,
    hasRoundTicketID: 0, // Ensure this is initialized correctly
    approvalLevelId: 0,
    userId: 0,
    status: 0,
    createdAt: null,
    dependentTravellers: [
      {
        dependentTravellersId: 0,
        name: "",
        relation: "",
        passportNumber: "",
        issueDate: null,
        expiryDate: null,
        dateOfBirth: null,
      },
    ],
  });
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Travel Details Report",
  });
  const shouldShowRemainingBalance =
    homeTravelData.hasRoundTicketID === 0 ? true : false;
  const [approvalTracker, setApprovalTracker] = useState([]);
  const GetApprovalsTracker = async (requestId) => {
    try {
      const response = await axios.post(
        `${URL.BASE_URL}/api/Approvals/GetHomeRequestApprovalsbyRequestID`,
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
  const data = {
    columns: [
      // { label: "#", field: "Number", sort: "asc" },
      { label: "Approved By", field: "userName", sort: "asc" },
      { label: "Approval Level", field: "approvalLevelName", sort: "asc" },
      { label: "Status", field: "statusName", sort: "asc" },
      { label: "Approved At", field: "createdAt", sort: "asc" },
    ],
    rows: approvalTracker.map((data, i) => ({
      Number: i + 1,
      userName: data.userName,
      approvalLevelName:
        data.approvalLevelName == "Business_operation_manager"
          ? "Business Operation Manager"
          : data.approvalLevelName,
      statusName: data.statusName,
      createdAt: data.statusName == "Pending" ? "N/A" : data.createdAt,
    })),
  };
  const [approvalData, setApprovalData] = useState({
    requestId: requestId,
    approvalLevelId: 0,
    userId: 0,
    status: 0,
    createdAt: null,
  });

  const getPlaneClasses = useCallback(() => {
    axios
      .get(`${URL.BASE_URL}/api/PlaneClass/GetAllPlaneClass`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setPlaneClasses(response.data))
      .catch((error) => console.error("Error fetching plane classes:", error));
  }, []);

  const getHomeRequestDetails = useCallback(async (requestId) => {
    try {
      const response = await axios.post(
        `${URL.BASE_URL}/api/HomeRequest/get-by-id`,
        requestId,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Directly use the date from the response, assuming it's in YYYY-MM-DD format
      const formattedDepartureDate = response.data.departureDate
        ? response.data.departureDate.split("T")[0]
        : "";
      const formattedArrivalDate = response.data.arrivalDate
        ? response.data.arrivalDate.split("T")[0]
        : "";
      const formattedAllowaStartDate = response.data.allowanceStartDate
        ? response.data.allowanceStartDate.split("T")[0]
        : "";
      const formattedAllowaEndDate = response.data.allowanceEndDate
        ? response.data.allowanceEndDate.split("T")[0]
        : "";
      const formattedPassportIssueDate = response.data.issueDate
        ? response.data.issueDate.split("T")[0]
        : "";
      const formattedPassportExpiryDate = response.data.expiryDate
        ? response.data.expiryDate.split("T")[0]
        : "";
      const formattedPassportDateofBirth = response.data.dateOfBirth
        ? response.data.dateOfBirth.split("T")[0]
        : "";
      // Format the dates inside dependentTravellers
      const formattedDependentTravellers =
        response.data.dependentTravellers.map((traveller) => ({
          ...traveller,
          issueDate: traveller.issueDate
            ? traveller.issueDate.split("T")[0]
            : null,
          expiryDate: traveller.expiryDate
            ? traveller.expiryDate.split("T")[0]
            : null,
          dateOfBirth: traveller.dateOfBirth
            ? traveller.dateOfBirth.split("T")[0]
            : null,
        }));
      setHomeTravelData({
        ...response.data,
        departureDate: formattedDepartureDate,
        arrivalDate: formattedArrivalDate,
        issueDate: formattedPassportIssueDate,
        expiryDate: formattedPassportExpiryDate,
        dateOfBirth: formattedPassportDateofBirth,
        allowanceStartDate: formattedAllowaStartDate,
        allowanceEndDate: formattedAllowaEndDate,
        dependentTravellers: formattedDependentTravellers,
      });
    } catch (error) {
      console.error("Error fetching home request details:", error);
    }
  }, []);

  const handleApproval = useCallback(
    async (statusId) => {
      try {
        setIsLoading(true);
        // Create a new object with the updated status
        const updatedApprovalData = {
          ...approvalData,
          status: statusId,
          createdAt: new Date().toISOString(), // Ensure `createdAt` is set with a valid date
        };
        await AddHomeApprovalRequest(updatedApprovalData);
        setIsLoading(false);
        toast.success("Operation completed successfully", {
          position: "top-center",
        });
        history.push("/home-request-list-coo");
      } catch (error) {
        setIsLoading(false);
        console.error("Error while updating user details:", error);
        toast.error("Error while updating user details, please try again", {
          position: "top-center",
        });
      }
    },
    [approvalData, setIsLoading]
  );
  const [showReport, setShowReport] = useState(false);
  const [approvalDepartments, setapprovalDepartments] = React.useState([]);
  const GetApprovalDepartmentSchema = () => {
    var data = "";
    var config = {
      method: "get",
      url: `${URL.BASE_URL}/api/BusinessRequest/get-approval-departments-schema`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        setapprovalDepartments(response.data);
      })
      .catch(function (error) {});
  };
  useEffect(() => {
    setIsLoading(false);
    GetApprovalDepartmentSchema();
    getHomeRequestDetails(requestId);
    getPlaneClasses();
    GetApprovalsTracker(requestId);
  }, [getHomeRequestDetails, getPlaneClasses, requestId]);
  const handlePrintClick = () => {
    setShowReport(true);
  };
  return (
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-lg-10 col-xl-8">
        <div className="card" style={{ padding: "30px" }}>
          <div className="card-body">
            <h3 className="card-header text-center mb-4">
              Home Leave Request Details
            </h3>
            <button onClick={handlePrintClick} className="print-button">
              Print Report
            </button>

            {/* Render PrintableBusinessReport only when needed */}
            {showReport && (
              <PrintableReport
                data={homeTravelData}
                requestId={requestId}
                status={status}
                onAfterPrint={() => setShowReport(false)}
              />
            )}
            <br />
            <br />
            <ValidatorForm className="px-md-4">
              <div className="horizontal-rule mb-4">
                <h5 className="horizontal-rule-text">Contact Section</h5>
              </div>
              <div>
                <label htmlFor="passportName" className="form-label fs-6 ">
                  Contact Email
                </label>
                <input
                  type="text"
                  id="passportName"
                  name="passportName"
                  value={homeTravelData.email}
                  className="form-control form-control-lg"
                  disabled
                  pattern="[a-zA-Z ]+"
                />
              </div>
              <div className="horizontal-rule mb-4">
                <h5 className="horizontal-rule-text">Department Info</h5>
              </div>
              <div className="mb-4 flex-grow-1">
                <select
                  className="form-select form-select-lg custom-select"
                  value={homeTravelData.approvingDepName} // Access the planeClassId inside transportation
                  onChange={(e) => {
                    setHomeTravelData({
                      ...homeTravelData,
                      approvingDepName: e.target.value,
                    });
                  }}
                  name="approvingDepName"
                  disabled
                >
                  <option value="">Choose your department</option>
                  {approvalDepartments.map((data) => (
                    <option key={data.depName} value={data.depName}>
                      {data.depName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="horizontal-rule mb-4">
                {/* Increased bottom margin */}
                <h5 className="horizontal-rule-text">Passport Section</h5>
              </div>
              <div className="container">
                <div className="row">
                  {/* Passport Name */}
                  <div className="col-md-6 mb-4">
                    <label htmlFor="passportName" className="form-label fs-6 ">
                      Name (Per Passport):
                    </label>
                    <input
                      type="text"
                      id="passportName"
                      name="passportName"
                      value={homeTravelData.passportName}
                      className="form-control form-control-lg"
                      disabled
                      pattern="[a-zA-Z ]+"
                    />
                  </div>
                  {/* Passport Number */}
                  <div className="col-md-6 mb-4">
                    <label
                      htmlFor="passportNumber"
                      className="form-label fs-6 "
                    >
                      Passport Number:
                    </label>
                    <input
                      type="text"
                      id="passportNumber"
                      name="passportNumber"
                      value={homeTravelData.passportNumber}
                      className="form-control form-control-lg"
                      disabled
                      pattern="[a-zA-Z0-9]+"
                    />
                  </div>
                </div>

                <div className="row">
                  {/* Passport Issue Date */}
                  <div className="col-md-4 mb-4">
                    <label htmlFor="issueDate" className="form-label fs-6 ">
                      Passport Issue Date:
                    </label>
                    <input
                      type="date"
                      id="issueDate"
                      name="issueDate"
                      value={homeTravelData.issueDate}
                      className="form-control form-control-lg custom-date-input"
                      disabled
                      //max={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Passport Expiry Date */}
                  <div className="col-md-4 mb-4">
                    <label htmlFor="expiryDate" className="form-label fs-6 ">
                      Passport Expiry Date:
                    </label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={homeTravelData.expiryDate}
                      disabled
                      className="form-control form-control-lg custom-date-input"
                      //min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Birth Date */}
                  <div className="col-md-4 mb-4">
                    <label htmlFor="dateOfBirth" className="form-label fs-6 ">
                      Birth Date (Per Passport):
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={homeTravelData.dateOfBirth}
                      disabled
                      className="form-control form-control-lg custom-date-input"
                    />
                  </div>
                </div>
              </div>
              <div className="horizontal-rule mb-4">
                <h5 className="horizontal-rule-text">
                  Number of Travelers (If Any)
                </h5>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1.5rem",
                }}
              >
                {homeTravelData.dependentTravellers.map((traveller, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexWrap: "wrap", // Allows wrapping for responsiveness
                      gap: "1.5rem",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Grouping input fields in a div to align them in rows of three */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1.5rem",
                      }}
                    >
                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Name (as in Passport)
                        </label>
                        <input
                          type="text"
                          id={`dependentName-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.name}
                          name={`dependentName-${index}`}
                          disabled
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Relation
                        </label>
                        <input
                          type="text"
                          id={`relation-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.relation}
                          name={`relation-${index}`}
                          disabled
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Passport Number
                        </label>
                        <input
                          type="text"
                          id={`passportNumber-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.passportNumber}
                          name={`passportNumber-${index}`}
                          disabled
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Passport Issue Date
                        </label>
                        <input
                          type="text"
                          id={`issueDate-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.issueDate}
                          name={`issueDate-${index}`}
                          disabled
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Passport Expiry Date
                        </label>
                        <input
                          type="text"
                          id={`expiryDate-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.expiryDate}
                          name={`expiryDate-${index}`}
                          disabled
                        />
                      </div>

                      <div
                        className="form-outline"
                        style={{ flex: "1 1 calc(33.33% - 1.5rem)" }}
                      >
                        <label htmlFor="issueDate" className="form-label fs-6 ">
                          Date of Birth
                        </label>
                        <input
                          type="text"
                          id={`dateOfBirth-${index}`}
                          className="form-control form-control-lg"
                          value={traveller.dateOfBirth}
                          name={`dateOfBirth-${index}`}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="horizontal-rule mb-4">
                <h5 className="horizontal-rule-text">Flight Class</h5>
              </div>
              <div className="form-outline mb-4">
                <select
                  className="form-select form-select-lg"
                  value={homeTravelData.planeClassID}
                  name="planeClassID"
                  disabled
                >
                  <option value="" disabled>
                    Select Flight Class
                  </option>
                  {planeClasses.map((data) => (
                    <option key={data.planeClassId} value={data.planeClassId}>
                      {data.planeClassName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="horizontal-rule mb-4">
                <h5 className="horizontal-rule-text">Itinerary (Airport)</h5>
              </div>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="firstDepartureAirportName"
                    className="form-label form-label-lg"
                  >
                    From:
                  </label>
                  <input
                    type="text"
                    id="firstDepartureAirportName"
                    name="firstDepartureAirportName"
                    value={homeTravelData.firstDepartureAirportName}
                    className="form-control form-control-lg"
                    placeholder="Enter airport name"
                    disabled
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="firstArrivalAirportName"
                    className="form-label form-label-lg"
                  >
                    To:
                  </label>
                  <input
                    type="text"
                    id="firstArrivalAirportName"
                    name="firstArrivalAirportName"
                    value={homeTravelData.firstArrivalAirportName}
                    className="form-control form-control-lg"
                    placeholder="Enter airport name"
                    disabled
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="departureDate"
                    className="form-label form-label-lg"
                  >
                    Departure Date:
                  </label>
                  <input
                    id="departureDate"
                    name="departureDate"
                    value={homeTravelData.departureDate}
                    className="form-control form-control-lg"
                    disabled
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  marginTop: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="secondDepartureAirportName"
                    className="form-label form-label-lg"
                  >
                    From:
                  </label>
                  <input
                    type="text"
                    id="secondDepartureAirportName"
                    name="secondDepartureAirportName"
                    value={homeTravelData.secondDepartureAirportName}
                    className="form-control form-control-lg"
                    placeholder="Enter airport name"
                    disabled
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="secondArrivalAirportName"
                    className="form-label form-label-lg"
                  >
                    To:
                  </label>
                  <input
                    type="text"
                    id="secondArrivalAirportName"
                    name="secondArrivalAirportName"
                    value={homeTravelData.secondArrivalAirportName}
                    className="form-control form-control-lg"
                    placeholder="Enter airport name"
                    disabled
                  />
                </div>
                <div className="form-outline flex-grow-1">
                  <label
                    htmlFor="arrivalDate"
                    className="form-label form-label-lg"
                  >
                    Return Date
                  </label>
                  <input
                    id="arrivalDate"
                    name="arrivalDate"
                    value={homeTravelData.arrivalDate}
                    className="form-control form-control-lg"
                    disabled
                  />
                </div>
              </div>
              <div className="horizontal-rule mb-4">
                <hr />
                <h5 className="horizontal-rule-text fs-5">
                  Human Resources Section
                </h5>
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div className="mb-4 flex-grow-1">
                  <label htmlFor="departureDate" className="form-label fs-6">
                    Allowance Start Date:
                  </label>
                  <input
                    type="date"
                    id="allowanceStartDate"
                    name="allowanceStartDate"
                    value={homeTravelData.allowanceStartDate}
                    disabled
                    className="form-control form-control-lg custom-date-input"
                  />
                </div>
                <div className="mb-4 flex-grow-1">
                  <label htmlFor="departureDate" className="form-label fs-6">
                    Allowance End Date:
                  </label>
                  <input
                    type="date"
                    id="allowanceEndDate"
                    name="allowanceEndDate"
                    value={homeTravelData.allowanceEndDate}
                    disabled
                    className="form-control form-control-lg custom-date-input"
                  />
                </div>
                <div className="mb-4 flex-grow-1">
                  <label
                    htmlFor="hasRoundTripTicket"
                    className="form-label fs-6"
                  >
                    Benefits:
                  </label>
                  <select
                    className="form-select form-select-lg custom-select"
                    value={homeTravelData.hasRoundTicketID} // Ensure value is a string
                    disabled
                    name="hasRoundTicketID"
                  >
                    <option value="">Select an option</option>{" "}
                    {/* Default empty option */}
                    <option value="1">Round-Trip Ticket available</option>
                    <option value="0">Balance</option>
                  </select>
                </div>
              </div>
              {shouldShowRemainingBalance ? (
                <div>
                  <label
                    htmlFor="firstDepartureAirportName"
                    className="form-label fs-6"
                  >
                    Remaining Balance in (GBP):
                  </label>
                  <input
                    type="number"
                    id="remainingBalance"
                    name="remainingBalance"
                    value={homeTravelData.remainingBalance}
                    disabled
                    className="form-control form-control-lg"
                  />
                </div>
              ) : null}
              <br />
              <div className="horizontal-rule mb-4">
                <h5 className="horizontal-rule-text">Approvals Breakdown</h5>
              </div>
              <div className="row">
                <div className="row">
                  <Table responsive>
                    <MDBDataTable
                      className="custom-table"
                      striped
                      bordered
                      hover
                      data={data}
                      paging={false} // Disables pagination
                      scrollX={false} // Disables horizontal scrolling
                      scrollY={false} // Disables vertical scrolling
                      order={["Number", "asc"]}
                      entries={10}
                      searching={false} // Disables the search bar
                    />
                  </Table>
                </div>
              </div>
            </ValidatorForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeRequestDetailsTravel;
