import React from "react";
import axios from "axios";
import URL from "../Util/config";
import { getToken } from "../Util/Authenticate";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList, // Import LabelList
} from "recharts";

const Statistics_old = () => {
  //State Definitions
  const [homerequestcount, sethomerequestCount] = React.useState([]);
  const [businessrequestcount, setbusinessrequestcount] = React.useState([]);
  const [businessrequestAccomdation, setbusinessrequestAccomdation] =
    React.useState([]);
  const [businesstransportationRequest, setbusinesstransportationRequest] =
    React.useState([]);
  const [businessAllowanceRequest, setbusinessAllowanceRequest] =
    React.useState([]);
  const [businessRegistrationFeeRequest, setbusinessRegistrationFeeRequest] =
    React.useState([]);
  const [businessVisaRequest, setbusinessVisaRequest] = React.useState([]);
  const [HomeRequestPlane, setHomeRequestPlane] = React.useState([]);
  //Currency Handlers Definition
  const [selectedCurrency, setSelectedCurrency] =
    React.useState("totalAmountEGP");
  const [selectedAccomdationCurrency, setselectedAccomdationCurrency] =
    React.useState("totalAmountEGP");
  const [selectedAllowanceCurrency, setselectedAllowanceCurrency] =
    React.useState("totalAmountEGP");
  const [selectedRegistrationFeeCurrency, setselectedRegistrationFeeCurrency] =
    React.useState("totalAmountEGP");
  const [selectedVisaCurrency, setselectedVisaCurrency] =
    React.useState("totalAmountEGP");
  const [selectedFlightClass, setselectedFlightClass] = React.useState(
    "businessClassCounts"
  );
  const [selectedHomeRequestApproval, setselectedHomeRequestApproval] =
    React.useState("totalCount");
  const [selectedBusinessRequestApproval, setselectedBusinessRequestApproval] =
    React.useState("totalCount");
  //Currency Handle Change Defintiton
  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };
  const handleAccomdationCurrencyChange = (event) => {
    setselectedAccomdationCurrency(event.target.value);
  };
  const handleAllowanceCurrencyChange = (event) => {
    setselectedAllowanceCurrency(event.target.value);
  };
  const handleRegistrationFeeCurrencyChange = (event) => {
    setselectedRegistrationFeeCurrency(event.target.value);
  };
  const handleVisaCurrencyChange = (event) => {
    setselectedVisaCurrency(event.target.value);
  };
  const handleHomeflightChange = (event) => {
    setselectedFlightClass(event.target.value);
  };
  const handleHomeRequestApproval = (event) => {
    setselectedHomeRequestApproval(event.target.value);
  };
  const handleBusinessRequestApproval = (event) => {
    setselectedBusinessRequestApproval(event.target.value);
  };
  //Data Transformation on change of the Currency
  const HomeRequestApprovaltransformedData = homerequestcount.map(
    (department) => ({
      departmentName: department.departmentName,
      requestCount: department[selectedHomeRequestApproval],
    })
  );
  const BusinessRequestApprovaltransformedData = businessrequestcount.map(
    (department) => ({
      departmentName: department.departmentName,
      requestCount: department[selectedBusinessRequestApproval],
    })
  );
  const transformedData = businesstransportationRequest.map((department) => ({
    deptName: department.departmentName,
    requestCount: department[selectedCurrency],
  }));
  const AccomdationtransformedData = businessrequestAccomdation.map(
    (department) => ({
      deptName: department.departmentName,
      requestCount: department[selectedAccomdationCurrency],
    })
  );
  const VisatransformedData = businessVisaRequest.map((department) => ({
    deptName: department.departmentName,
    requestCount: department[selectedVisaCurrency],
  }));
  const RegistrationFeetransformedData = businessRegistrationFeeRequest.map(
    (department) => ({
      deptName: department.departmentName,
      requestCount: department[selectedRegistrationFeeCurrency],
    })
  );
  const AllowancecetransformedData = businessAllowanceRequest.map(
    (department) => ({
      deptName: department.departmentName,
      requestCount: department[selectedAllowanceCurrency],
    })
  );
  const HomePlaneClasstransformedData = HomeRequestPlane.map((department) => ({
    departmentName: department.departmentName,
    requestCount: department[selectedFlightClass],
  }));
  //Get Fetchers Defintiton
  const getAccomdationStatistics = () => {
    axios
      .get(`${URL.BASE_URL}/api/Dashboard/get-accomdation-statistics`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setbusinessrequestAccomdation(response.data))
      .catch((error) => console.error(error));
  };
  const getHomeFlightStatistics = () => {
    axios
      .get(`${URL.BASE_URL}/api/Dashboard/get-planeClass-statistics`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setHomeRequestPlane(response.data))
      .catch((error) => console.error(error));
  };
  const getVisaStatistics = () => {
    axios
      .get(`${URL.BASE_URL}/api/Dashboard/get-visa-statistics`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setbusinessVisaRequest(response.data))
      .catch((error) => console.error(error));
  };
  const getRegistrationFeeStatistics = () => {
    axios
      .get(`${URL.BASE_URL}/api/Dashboard/get-registerationFee-statistics`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setbusinessRegistrationFeeRequest(response.data))
      .catch((error) => console.error(error));
  };
  const getAllowanceStatistics = () => {
    axios
      .get(`${URL.BASE_URL}/api/Dashboard/get-allowance-statistics`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setbusinessAllowanceRequest(response.data))
      .catch((error) => console.error(error));
  };
  const getTransportationStatistics = () => {
    axios
      .get(`${URL.BASE_URL}/api/Dashboard/get-transportation-statistics`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setbusinesstransportationRequest(response.data))
      .catch((error) => console.error(error));
  };

  const getdepartmentwithBusinessRequestcount = () => {
    axios
      .get(
        `${URL.BASE_URL}/api/Dashboard/get-department-withBussinessRequest-count`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((response) => setbusinessrequestcount(response.data))
      .catch((error) => console.error(error));
  };
  const getdepartmentwithHomeRequestcount = () => {
    axios
      .get(
        `${URL.BASE_URL}/api/Dashboard/get-department-withHomeRequest-count`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((response) => sethomerequestCount(response.data))
      .catch((error) => console.error(error));
  };
  //Use Effect to call the Apis of the Statistics on page loading
  React.useEffect(() => {
    getdepartmentwithHomeRequestcount();
    getdepartmentwithBusinessRequestcount();
    getTransportationStatistics();
    getAccomdationStatistics();
    getAllowanceStatistics();
    getRegistrationFeeStatistics();
    getVisaStatistics();
    getHomeFlightStatistics();
  }, []);
  console.log("Home Plane Class", HomeRequestPlane);

  const baseHeight = 200;
  const barHeight = 40;
  const chartHeight = homerequestcount.length * barHeight + baseHeight;

  return (
    <>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={chartContainerStyle}>
          <h4 style={labelStyle}>Home Request Statistics</h4>
          <p style={subtitleStyle}>Total Home Requests by Department</p>
          <select
            onChange={handleHomeRequestApproval}
            value={selectedHomeRequestApproval}
            style={{
              width: "60%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #7f0008",
              backgroundColor: "#fff",
              color: "#333",
              cursor: "pointer",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              appearance: "none", // removes default dropdown icon for a cleaner look
            }}
          >
            <option value="totalCount">Total Count</option>
            <option value="pendingCount">Pending Count</option>
            <option value="approvedCount">Approved Count</option>
            <option value="rejectedCount">Rejected Count</option>
          </select>

          <ResponsiveContainer width="90%" height={chartHeight}>
            <BarChart
              data={HomeRequestApprovaltransformedData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              barSize={15}
              barCategoryGap="5%"
              barGap={0}
            >
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="departmentName"
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip />
              <Bar dataKey="requestCount" fill="#3c58d0" radius={[5, 5, 0, 0]}>
                <LabelList dataKey="requestCount" position="right" />{" "}
                {/* Show label */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={chartContainerStyle}>
          <h4 style={labelStyle}>Home Request Flight Statistics</h4>
          <div>
            <select
              onChange={handleHomeflightChange}
              value={selectedFlightClass}
              style={{
                width: "60%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #7f0008",
                backgroundColor: "#fff",
                color: "#333",
                cursor: "pointer",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                appearance: "none", // removes default dropdown icon for a cleaner look
              }}
            >
              <option value="businessClassCounts">Business Class</option>
              <option value="economyClassCounts">Economy Class</option>
            </select>

            <ResponsiveContainer width="90%" height={chartHeight}>
              <BarChart
                data={HomePlaneClasstransformedData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                barSize={15}
                barCategoryGap="5%"
                barGap={0}
              >
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="departmentName"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip />
                <Bar
                  dataKey="requestCount"
                  fill="#3c58d0"
                  radius={[5, 5, 0, 0]}
                >
                  <LabelList dataKey="requestCount" position="right" />{" "}
                  {/* Show label */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <br />
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={chartContainerStyle}>
          <h4 style={labelStyle}>Business Request Statistics</h4>
          <p style={subtitleStyle}>Total Business Requests by Department</p>
          <select
            onChange={handleBusinessRequestApproval}
            value={selectedBusinessRequestApproval}
            style={{
              width: "60%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #7f0008",
              backgroundColor: "#fff",
              color: "#333",
              cursor: "pointer",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              appearance: "none", // removes default dropdown icon for a cleaner look
            }}
          >
            <option value="totalCount">Total Count</option>
            <option value="pendingCount">Pending Count</option>
            <option value="approvedCount">Approved Count</option>
            <option value="rejectedCount">Rejected Count</option>
          </select>

          <ResponsiveContainer width="90%" height={chartHeight}>
            <BarChart
              data={BusinessRequestApprovaltransformedData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              barSize={15}
              barCategoryGap="5%"
              barGap={10}
            >
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="departmentName"
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip />
              <Bar dataKey="requestCount" fill="#3c58d0" radius={[5, 5, 0, 0]}>
                <LabelList dataKey="requestCount" position="right" />{" "}
                {/* Show label */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={chartContainerStyle}>
          <h4 style={labelStyle}>Business Request Allowance Statistics</h4>
          <div>
            <select
              onChange={handleAllowanceCurrencyChange}
              value={selectedAllowanceCurrency}
              style={{
                width: "60%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #7f0008",
                backgroundColor: "#fff",
                color: "#333",
                cursor: "pointer",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                appearance: "none", // removes default dropdown icon for a cleaner look
              }}
            >
              <option value="totalAmountEGP">EGP</option>
              <option value="totalAmountUSD">USD</option>
              <option value="totalAmountEUR">EUR</option>
            </select>

            <ResponsiveContainer width="90%" height={chartHeight}>
              <BarChart
                data={AllowancecetransformedData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                barSize={15}
                barCategoryGap="5%"
                barGap={0}
              >
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="deptName"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip />
                <Bar
                  dataKey="requestCount"
                  fill="#3c58d0"
                  radius={[5, 5, 0, 0]}
                >
                  <LabelList dataKey="requestCount" position="right" />{" "}
                  {/* Show label */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={chartContainerStyle}>
          <h4 style={labelStyle}>Business Request Transfer Statistics</h4>
          <div>
            <select
              onChange={handleCurrencyChange}
              value={selectedCurrency}
              style={{
                width: "60%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #7f0008",
                backgroundColor: "#fff",
                color: "#333",
                cursor: "pointer",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                appearance: "none", // removes default dropdown icon for a cleaner look
              }}
            >
              <option value="totalAmountEGP">EGP</option>
              <option value="totalAmountUSD">USD</option>
              <option value="totalAmountEUR">EUR</option>
            </select>

            <ResponsiveContainer width="90%" height={chartHeight}>
              <BarChart
                data={transformedData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                barSize={15}
                barCategoryGap="5%"
                barGap={0}
              >
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="deptName"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip />
                <Bar
                  dataKey="requestCount"
                  fill="#3c58d0"
                  radius={[5, 5, 0, 0]}
                >
                  <LabelList dataKey="requestCount" position="right" />{" "}
                  {/* Show label */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={chartContainerStyle}>
          <h4 style={labelStyle}>Business Request Accomdation Statistics</h4>
          <div>
            <select
              onChange={handleAccomdationCurrencyChange}
              value={selectedAccomdationCurrency}
              style={{
                width: "60%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #7f0008",
                backgroundColor: "#fff",
                color: "#333",
                cursor: "pointer",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                appearance: "none", // removes default dropdown icon for a cleaner look
              }}
            >
              <option value="totalAmountEGP">EGP</option>
              <option value="totalAmountUSD">USD</option>
              <option value="totalAmountEUR">EUR</option>
            </select>

            <ResponsiveContainer width="90%" height={chartHeight}>
              <BarChart
                data={AccomdationtransformedData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                barSize={15}
                barCategoryGap="5%"
                barGap={0}
              >
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="deptName"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip />
                <Bar
                  dataKey="requestCount"
                  fill="#3c58d0"
                  radius={[5, 5, 0, 0]}
                >
                  <LabelList dataKey="requestCount" position="right" />{" "}
                  {/* Show label */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <br />
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={chartContainerStyle}>
          <h4 style={labelStyle}>
            Business Request Participation Fee Statistics
          </h4>
          <div>
            <select
              onChange={handleRegistrationFeeCurrencyChange}
              value={selectedRegistrationFeeCurrency}
              style={{
                width: "60%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #7f0008",
                backgroundColor: "#fff",
                color: "#333",
                cursor: "pointer",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                appearance: "none", // removes default dropdown icon for a cleaner look
              }}
            >
              <option value="totalAmountEGP">EGP</option>
              <option value="totalAmountUSD">USD</option>
              <option value="totalAmountEUR">EUR</option>
            </select>

            <ResponsiveContainer width="90%" height={chartHeight}>
              <BarChart
                data={RegistrationFeetransformedData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                barSize={15}
                barCategoryGap="5%"
                barGap={0}
              >
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="deptName"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip />
                <Bar
                  dataKey="requestCount"
                  fill="#3c58d0"
                  radius={[5, 5, 0, 0]}
                >
                  <LabelList dataKey="requestCount" position="right" />{" "}
                  {/* Show label */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={chartContainerStyle}>
          <h4 style={labelStyle}>Business Request Visa Statistics</h4>
          <div>
            <select
              onChange={handleVisaCurrencyChange}
              value={selectedVisaCurrency}
              style={{
                width: "60%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #7f0008",
                backgroundColor: "#fff",
                color: "#333",
                cursor: "pointer",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                appearance: "none", // removes default dropdown icon for a cleaner look
              }}
            >
              <option value="totalAmountEGP">EGP</option>
              <option value="totalAmountUSD">USD</option>
              <option value="totalAmountEUR">EUR</option>
            </select>

            <ResponsiveContainer width="90%" height={chartHeight}>
              <BarChart
                data={VisatransformedData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                barSize={15}
                barCategoryGap="5%"
                barGap={0}
              >
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="deptName"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip />
                <Bar
                  dataKey="requestCount"
                  fill="#3c58d0"
                  radius={[5, 5, 0, 0]}
                >
                  <LabelList dataKey="requestCount" position="right" />{" "}
                  {/* Show label */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <br />
    </>
  );
};
// Styles
const chartContainerStyle = {
  flex: 1,
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  transition: "transform 0.2s",
};

const labelStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "5px",
  textAlign: "center",
};

const subtitleStyle = {
  fontSize: "1rem",
  color: "#555",
  marginBottom: "15px",
  textAlign: "center",
};
export default Statistics_old;
