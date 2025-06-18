import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { Pie, Doughnut } from "react-chartjs-2";
import { getToken } from "../Util/Authenticate";
import URL from "../Util/config";
import { Spin, Alert } from "antd";
import JSONToCSVDownloader from "../shared_components/JSONToCSVDownloader";
import "./Statistics.css"; // Import the external CSS file
const Statistics = () => {
  const [selectedDepType, setSelectedDepType] = React.useState("");
  const [ParticpationselectedDepType, setParticpationselectedDepType] =
    React.useState("");
  const [VisaselectedDepType, setVisaselectedDepType] = React.useState("");
  const [TransferselectedDepType, setTransferselectedDepType] =
    React.useState("");
  const [AccomdationselectedDepType, setAccomdationselectedDepType] =
    React.useState("");
  const [TotalselectedDepType, setTotalselectedDepType] = React.useState("");
  //==========================================================================
  const [AllowanceBarselectedDepType, setAllowanceBarselectedDepType] =
    React.useState("");
  const [ParticpationBarselectedDepType, setParticpationBarselectedDepType] =
    React.useState("");
  const [VisaBarselectedDepType, setVisaBarselectedDepType] =
    React.useState("");
  const [TransferBarselectedDepType, setTransferBarselectedDepType] =
    React.useState("");
  const [AccomdationBarselectedDepType, setAccomdationBarselectedDepType] =
    React.useState("");
  const [HomeStatusBarselectedDepType, setHomeStatusBarselectedDepType] =
    React.useState("");
  const [HomeStatusBarStartDate, setHomeStatusBarStartDate] =
    React.useState("");
  const [HomeStatusBarEndDate, setHomeStatusBarEndDate] = React.useState("");
  const [HomeFlightBarselectedDepType, setHomeFlightBarselectedDepType] =
    React.useState("");
  const [HomeFlightBarStartDate, setHomeFlightBarStartDate] =
    React.useState("");
  const [HomeFlightBarEndDate, setHomeFlightBarEndDate] = React.useState("");
  const [
    BusinessStatusBarselectedDepType,
    setBusinessStatusBarselectedDepType,
  ] = React.useState("");
  const [BusinessStatusBarStartDate, setBusinessStatusBarStartDate] =
    React.useState("");
  const [BusinessStatusBarEndDate, setBusinessStatusBarEndDate] =
    React.useState("");
  //CSV initializers
  //Bar Charts Section
  const HomeRequestCountheaders = [
    "departmentName",
    "approvedCount",
    "rejectedCount",
    "pendingCount",
    // "totalCount",
  ];
  const BusinessRequestCountheaders = [
    "departmentName",
    "approvedCount",
    "rejectedCount",
    "pendingCount",
    // "totalCount",
  ];
  const HomeRequestFlightStatsheaders = [
    "departmentName",
    "businessClassCounts",
    "economyClassCounts",
  ];
  const Accomdationheaders = [
    "departmentName",
    "totalAmountUSD",
    "totalAmountEGP",
    "totalAmountEUR",
    "totalAmountGBP",
  ];
  const Visaheaders = [
    "departmentName",
    "totalAmountUSD",
    "totalAmountEGP",
    "totalAmountEUR",
    "totalAmountGBP",
  ];
  const Transportationheaders = [
    "departmentName",
    "totalAmountUSD",
    "totalAmountEGP",
    "totalAmountEUR",
    "totalAmountGBP",
  ];
  const Allowanceheaders = [
    "departmentName",
    "totalAmountUSD",
    "totalAmountEGP",
    "totalAmountEUR",
    "totalAmountGBP",
  ];
  const RegistrationFeeheaders = [
    "departmentName",
    "totalAmountUSD",
    "totalAmountEGP",
    "totalAmountEUR",
    "totalAmountGBP",
  ];
  //Pie Chart Section
  const PieTransportationTotalCountHeader = [
    "totalAmountUSD",
    "totalAmountEGP",
    "totalAmountEUR",
    "totalAmountGBP",
  ];
  const PieAccomdationTotalCountHeader = [
    "totalAmountUSD",
    "totalAmountEGP",
    "totalAmountEUR",
    "totalAmountGBP",
  ];
  const PieAllowanceTotalCountHeader = [
    "totalAmountUSD",
    "totalAmountEGP",
    "totalAmountEUR",
    "totalAmountGBP",
  ];
  const PieRegistrationFeeTotalCountHeader = [
    "totalAmountUSD",
    "totalAmountEGP",
    "totalAmountEUR",
    "totalAmountGBP",
  ];
  const PieVisaTotalCountHeader = [
    "totalAmountUSD",
    "totalAmountEGP",
    "totalAmountEUR",
    "totalAmountGBP",
  ];
  const PieAllTotalCountHeader = [
    "totalAmountUSD",
    "totalAmountEGP",
    "totalAmountEUR",
    "totalAmountGBP",
  ];
  //Creating the State for the expandable sections
  const [isAccomdationExpanded, setisAccomdationExpanded] = useState(false);
  const [isTransferExpanded, setisTransferExpanded] = useState(false);
  const [isAllowanceExpanded, setisAllowanceExpanded] = useState(false);
  const [isVisaExpanded, setisVisaExpanded] = useState(false);
  const [isParticpationExpanded, setisParticpationExpanded] = useState(false);
  const [isOverallExpanded, setIsExpandedisOverallExpanded] = useState(false);
  //State definition
  const [HomeRequestCount, setHomeRequestCount] = useState([]);
  const [businessrequestAccomdation, setbusinessrequestAccomdation] =
    React.useState([]);
  const [HomeRequestPlane, setHomeRequestPlane] = React.useState([]);
  const [businessrequestcount, setbusinessrequestcount] = React.useState([]);
  const [businessVisaRequest, setbusinessVisaRequest] = React.useState([]);
  const [pieallowancetotalcount, setpieallowancetotalcount] = useState([]);
  const [pieVisatotalcount, setpieVisatotalcount] = useState([]);
  const [pieAccomdationtotalcount, setpieAccomdationtotalcount] = useState([]);
  const [pieAlltotalcount, setpieAlltotalcount] = useState([]);
  const [pieTransportationtotalcount, setpieTransportationtotalcount] =
    useState([]);
  const [pieregistrationFeetotalcount, setpieregistrationFeetotalcount] =
    useState([]);
  const [businessRegistrationFeeRequest, setbusinessRegistrationFeeRequest] =
    React.useState([]);
  const [businesstransportationRequest, setbusinesstransportationRequest] =
    React.useState([]);
  const [businessAllowanceRequest, setbusinessAllowanceRequest] =
    React.useState([]);
  //Statistics Filters Defintions
  //Transfer Start and End Date Statistics
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  //Accomdation Start and End Date Statistics
  const [AccomdationstartDate, setAccomdationStartDate] = useState(null);
  const [AccomdationendDate, setAccomdationEndDate] = useState(null);
  //Allowance Start and End Date Statistics
  const [AllowancestartDate, setAllowanceStartDate] = useState(null);
  const [AllowanceendDate, setAllowanceEndDate] = useState(null);
  //Particpation Fee Start and End Date Statistics
  const [ParticpationstartDate, setParticpationStartDate] = useState(null);
  const [ParticpationendDate, setParticpationEndDate] = useState(null);
  //Visa Start and End Date Statistics
  const [VisastartDate, setVisaStartDate] = useState(null);
  const [VisaendDate, setVisaEndDate] = useState(null);
  const [depTypes, setdepTypes] = React.useState([]);
  //Pie Chart Filters Definitions
  //Transfer Start and End Date Pie Chart
  const [transferpiestartDate, settransferpieStartDate] = useState(null);
  const [transferpieendDate, settransferpieEndDate] = useState(null);
  //Accomdation Start and End Date Pie Chart
  const [AccomdationpiestartDate, setAccomdationpieStartDate] = useState(null);
  const [AccomdationpieendDate, setAccomdationpieEndDate] = useState(null);
  //Allowance Start and End Date Pie Chart
  const [AllowancepiestartDate, setAllowancepieStartDate] = useState(null);
  const [AllowancepieendDate, setAllowancepieEndDate] = useState(null);
  //Particpation Fee Start and End Date Pie Chart
  const [ParticpationsPieStartDate, setParticpationsPieStartDate] =
    useState(null);
  const [ParticpationsPieendDate, setParticpationsPieEndDate] = useState(null);
  //Visa Start and End Date Pie Chart
  const [VisaPiestartDate, setVisaPieStartDate] = useState(null);
  const [VisaPieendDate, setVisaPieEndDate] = useState(null);
  //Overall Total Start and End Date Pie Chart
  const [OverallTotalPiestartDate, setOverallTotalPiestartDate] =
    useState(null);
  const [OverallTotalPieendDate, setOverallTotalPieendDate] = useState(null);
  //Error and loading definitions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getTransportationStatistics = (
    startDate,
    endDate,
    TransferBarselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (TransferBarselectedDepType)
      params.append("approvingDepTypeID", TransferBarselectedDepType);

    const url = `${URL.BASE_URL}/api/Dashboard/get-transportation-statistics?${
      params.toString() ? params.toString() : ""
    }`;

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setbusinesstransportationRequest(response.data))
      .catch((error) => console.error(error));
  };
  const getAccomdationStatistics = (
    AccomdationstartDate,
    AccomdationendDate,
    AccomdationBarselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (AccomdationstartDate) params.append("startDate", AccomdationstartDate);
    if (AccomdationendDate) params.append("endDate", AccomdationendDate);
    if (AccomdationBarselectedDepType)
      params.append("approvingDepTypeID", AccomdationBarselectedDepType);

    const url = `${URL.BASE_URL}/api/Dashboard/get-accomdation-statistics?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setbusinessrequestAccomdation(response.data))
      .catch((error) => console.error(error));
  };
  const getVisaStatistics = (
    VisastartDate,
    VisaendDate,
    VisaBarselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (VisastartDate) params.append("startDate", VisastartDate);
    if (VisaendDate) params.append("endDate", VisaendDate);
    if (VisaBarselectedDepType)
      params.append("approvingDepTypeID", VisaBarselectedDepType);

    const url = `${URL.BASE_URL}/api/Dashboard/get-visa-statistics?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setbusinessVisaRequest(response.data))
      .catch((error) => console.error(error));
  };
  const getRegistrationFeeStatistics = (
    ParticpationstartDate,
    ParticpationendDate,
    ParticpationBarselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (ParticpationstartDate)
      params.append("startDate", ParticpationstartDate);
    if (ParticpationendDate) params.append("endDate", ParticpationendDate);
    if (ParticpationBarselectedDepType)
      params.append("approvingDepTypeID", ParticpationBarselectedDepType);

    const url = `${
      URL.BASE_URL
    }/api/Dashboard/get-registerationFee-statistics?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setbusinessRegistrationFeeRequest(response.data))
      .catch((error) => console.error(error));
  };
  const getAllowanceStatistics = (
    AllowancestartDate,
    AllowanceendDate,
    AllowanceBarselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (AllowancestartDate) params.append("startDate", AllowancestartDate);
    if (AllowanceendDate) params.append("endDate", AllowanceendDate);
    if (AllowanceBarselectedDepType)
      params.append("approvingDepTypeID", AllowanceBarselectedDepType);

    const url = `${URL.BASE_URL}/api/Dashboard/get-allowance-statistics?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setbusinessAllowanceRequest(response.data))
      .catch((error) => console.error(error));
  };
  const getDepartmentWithHomeRequestCount = async (
    HomeStatusBarStartDate,
    HomeStatusBarEndDate,
    HomeStatusBarselectedDepType
  ) => {
    try {
      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (HomeStatusBarStartDate)
        params.append("startDate", HomeStatusBarStartDate);
      if (HomeStatusBarEndDate) params.append("endDate", HomeStatusBarEndDate);
      if (HomeStatusBarselectedDepType)
        params.append("approvingDepTypeID", HomeStatusBarselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/Dashboard/get-department-withHomeRequest-count?${
        params.toString() ? params.toString() : ""
      }`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setHomeRequestCount(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getHomeFlightStatistics = (
    HomeFlightBarStartDate,
    HomeFlightBarEndDate,
    HomeFlightBarselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (HomeFlightBarStartDate)
      params.append("startDate", HomeFlightBarStartDate);
    if (HomeFlightBarEndDate) params.append("endDate", HomeFlightBarEndDate);
    if (HomeFlightBarselectedDepType)
      params.append("approvingDepTypeID", HomeFlightBarselectedDepType);

    const url = `${URL.BASE_URL}/api/Dashboard/get-planeClass-statistics?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setHomeRequestPlane(response.data))
      .catch((error) => console.error(error));
  };
  const getdepartmentwithBusinessRequestcount = (
    BusinessStatusBarStartDate,
    BusinessStatusBarEndDate,
    BusinessStatusBarselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (BusinessStatusBarStartDate)
      params.append("startDate", BusinessStatusBarStartDate);
    if (BusinessStatusBarEndDate)
      params.append("endDate", BusinessStatusBarEndDate);
    if (BusinessStatusBarselectedDepType)
      params.append("approvingDepTypeID", BusinessStatusBarselectedDepType);

    const url = `${
      URL.BASE_URL
    }/api/Dashboard/get-department-withBussinessRequest-count?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setbusinessrequestcount(response.data))
      .catch((error) => console.error(error));
  };
  const getTransferPieTotal = (
    transferpiestartDate,
    transferpieendDate,
    TransferselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (transferpiestartDate) params.append("startDate", transferpiestartDate);
    if (transferpieendDate) params.append("endDate", transferpieendDate);
    if (TransferselectedDepType)
      params.append("approvingDepTypeID", TransferselectedDepType);

    const url = `${URL.BASE_URL}/api/Dashboard/get-transportation-total-count?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setpieTransportationtotalcount(response.data))
      .catch((error) => console.error(error));
  };
  const getAccomdationPieTotal = (
    AccomdationpiestartDate,
    AccomdationpieendDate,
    AccomdationselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (AccomdationpiestartDate)
      params.append("startDate", AccomdationpiestartDate);
    if (AccomdationpieendDate) params.append("endDate", AccomdationpieendDate);
    if (AccomdationselectedDepType)
      params.append("approvingDepTypeID", AccomdationselectedDepType);

    const url = `${URL.BASE_URL}/api/Dashboard/get-accomdation-total-count?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setpieAccomdationtotalcount(response.data))
      .catch((error) => console.error(error));
  };
  const getAllowancePieTotal = (
    AllowancepiestartDate,
    AllowancepieendDate,
    selectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (AllowancepiestartDate)
      params.append("startDate", AllowancepiestartDate);
    if (AllowancepieendDate) params.append("endDate", AllowancepieendDate);
    if (selectedDepType) params.append("approvingDepTypeID", selectedDepType);

    const url = `${URL.BASE_URL}/api/Dashboard/get-allowance-total-count?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setpieallowancetotalcount(response.data))
      .catch((error) => console.error(error));
  };
  const getVisaPieTotal = (
    VisaPiestartDate,
    VisaPieendDate,
    VisaselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (VisaPiestartDate) params.append("startDate", VisaPiestartDate);
    if (VisaPieendDate) params.append("endDate", VisaPieendDate);
    if (VisaselectedDepType)
      params.append("approvingDepTypeID", VisaselectedDepType);

    const url = `${URL.BASE_URL}/api/Dashboard/get-visa-total-count?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setpieVisatotalcount(response.data))
      .catch((error) => console.error(error));
  };
  const getParticpationPieTotal = (
    ParticpationsPieStartDate,
    ParticpationsPieendDate,
    ParticpationselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (ParticpationsPieStartDate)
      params.append("startDate", ParticpationsPieStartDate);
    if (ParticpationsPieendDate)
      params.append("endDate", ParticpationsPieendDate);
    if (ParticpationselectedDepType)
      params.append("approvingDepTypeID", ParticpationselectedDepType);

    const url = `${
      URL.BASE_URL
    }/api/Dashboard/get-registerationFee-total-count?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setpieregistrationFeetotalcount(response.data))
      .catch((error) => console.error(error));
  };
  const getOverallPieTotal = (
    OverallTotalPiestartDate,
    OverallTotalPieendDate,
    TotalselectedDepType
  ) => {
    // Construct query parameters dynamically
    const params = new URLSearchParams();
    if (OverallTotalPiestartDate)
      params.append("startDate", OverallTotalPiestartDate);
    if (OverallTotalPieendDate)
      params.append("endDate", OverallTotalPieendDate);
    if (TotalselectedDepType)
      params.append("approvingDepTypeID", TotalselectedDepType);

    const url = `${
      URL.BASE_URL
    }/api/Dashboard/get-total-registerationServices?${
      params.toString() ? params.toString() : ""
    }`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => setpieAlltotalcount(response.data))
      .catch((error) => console.error(error));
  };
  const getallDepartmentTypes = () => {
    axios
      .get(`${URL.BASE_URL}/api/BusinessRequest/get-all-department-types`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        console.log(response.data); // Ensure the response is an array
        setdepTypes(response.data);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    getDepartmentWithHomeRequestCount(
      HomeStatusBarStartDate,
      HomeStatusBarEndDate,
      HomeStatusBarselectedDepType
    );
    getHomeFlightStatistics(
      HomeFlightBarStartDate,
      HomeFlightBarEndDate,
      HomeFlightBarselectedDepType
    );
    getdepartmentwithBusinessRequestcount(
      BusinessStatusBarStartDate,
      BusinessStatusBarEndDate,
      BusinessStatusBarselectedDepType
    );
    getTransportationStatistics(startDate, endDate, TransferBarselectedDepType); // Pass null or selected dates
    getAllowanceStatistics(
      AllowancestartDate,
      AllowanceendDate,
      AllowanceBarselectedDepType
    );
    getRegistrationFeeStatistics(
      ParticpationstartDate,
      ParticpationendDate,
      ParticpationBarselectedDepType
    );
    getVisaStatistics(VisastartDate, VisaendDate, VisaBarselectedDepType);
    getAccomdationStatistics(
      AccomdationstartDate,
      AccomdationendDate,
      AccomdationBarselectedDepType
    );
    getTransferPieTotal(
      transferpiestartDate,
      transferpieendDate,
      TransferselectedDepType
    );
    getAccomdationPieTotal(
      AccomdationpiestartDate,
      AccomdationpieendDate,
      AccomdationselectedDepType
    );
    getAllowancePieTotal(
      AllowancepiestartDate,
      AllowancepieendDate,
      selectedDepType
    );
    getVisaPieTotal(VisaPiestartDate, VisaPieendDate, VisaselectedDepType);
    getParticpationPieTotal(
      ParticpationsPieStartDate,
      ParticpationsPieendDate,
      ParticpationselectedDepType
    );
    getOverallPieTotal(
      OverallTotalPiestartDate,
      OverallTotalPieendDate,
      TotalselectedDepType
    );
    getallDepartmentTypes();
  }, [
    HomeStatusBarStartDate,
    HomeStatusBarEndDate,
    HomeStatusBarselectedDepType,
    HomeFlightBarStartDate,
    HomeFlightBarEndDate,
    HomeFlightBarselectedDepType,
    BusinessStatusBarStartDate,
    BusinessStatusBarEndDate,
    BusinessStatusBarselectedDepType,
    startDate,
    endDate,
    AllowancestartDate,
    AllowanceendDate,
    ParticpationstartDate,
    ParticpationendDate,
    VisastartDate,
    VisaendDate,
    AccomdationstartDate,
    AccomdationendDate,
    transferpiestartDate,
    transferpieendDate,
    AccomdationpiestartDate,
    AccomdationpieendDate,
    AllowancepiestartDate,
    AllowancepieendDate,
    VisaPiestartDate,
    VisaPieendDate,
    ParticpationsPieStartDate,
    ParticpationsPieendDate,
    OverallTotalPiestartDate,
    OverallTotalPieendDate,
    selectedDepType,
    TransferselectedDepType,
    AccomdationselectedDepType,
    VisaselectedDepType,
    ParticpationselectedDepType,
    TotalselectedDepType,
    TransferBarselectedDepType,
    AllowanceBarselectedDepType,
    ParticpationBarselectedDepType,
    VisaBarselectedDepType,
    AccomdationBarselectedDepType,
  ]);
  //Chart Defintion
  const AlltotalcostPie = {
    labels: ["USD Total", "EGP Total", "EUR Total", "GBP Total"],
    datasets: [
      {
        label: "Overall Total Cost",
        data: [
          pieAlltotalcount.totalAmountUSD,
          pieAlltotalcount.totalAmountEGP,
          pieAlltotalcount.totalAmountEUR,
          pieAlltotalcount.totalAmountGBP,
        ],
        backgroundColor: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b"],
        hoverBackgroundColor: ["#a3d9ff", "#85bde1", "#5a8ab5", "#4a6c92"],
      },
    ],
  };
  const AccomdationtotalcostPie = {
    labels: ["USD Total", "EGP Total", "EUR Total", "GBP Total"],
    datasets: [
      {
        label: "Total Accomdation Cost",
        data: [
          pieAccomdationtotalcount.totalAmountUSD,
          pieAccomdationtotalcount.totalAmountEGP,
          pieAccomdationtotalcount.totalAmountEUR,
          pieAccomdationtotalcount.totalAmountGBP,
        ],
        backgroundColor: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b"],
        hoverBackgroundColor: ["#a3d9ff", "#85bde1", "#5a8ab5", "#4a6c92"],
      },
    ],
  };
  const Pieoptions = {
    plugins: {
      legend: {
        display: true,
        position: "left",
      },
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          size: 12,
        },
        formatter: (value) => `${value}`, // Customize label format
      },
    },
  };
  const allowancetotalcostPie = {
    labels: ["USD Total", "EGP Total", "EUR Total", "GBP Total"],
    datasets: [
      {
        label: "Total Allowance Cost",
        data: [
          pieallowancetotalcount.totalAmountUSD,
          pieallowancetotalcount.totalAmountEGP,
          pieallowancetotalcount.totalAmountEUR,
          pieallowancetotalcount.totalAmountGBP,
        ],
        backgroundColor: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b"],
        hoverBackgroundColor: ["#a3d9ff", "#85bde1", "#5a8ab5", "#4a6c92"],
      },
    ],
  };
  const TransportationtotalcostPie = {
    labels: ["USD Total", "EGP Total", "EUR Total", "GBP Total"],
    datasets: [
      {
        label: "Total Allowance Cost",
        data: [
          pieTransportationtotalcount.totalAmountUSD,
          pieTransportationtotalcount.totalAmountEGP,
          pieTransportationtotalcount.totalAmountEUR,
          pieTransportationtotalcount.totalAmountGBP,
        ],
        backgroundColor: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b"],
        hoverBackgroundColor: ["#a3d9ff", "#85bde1", "#5a8ab5", "#4a6c92"],
      },
    ],
  };

  const VisatotalcostPie = {
    labels: ["USD Total", "EGP Total", "EUR Total", "GBP Total"],
    datasets: [
      {
        label: "Total Visa Cost",
        data: [
          pieVisatotalcount.totalAmountUSD,
          pieVisatotalcount.totalAmountEGP,
          pieVisatotalcount.totalAmountEUR,
          pieVisatotalcount.totalAmountGBP,
        ],
        backgroundColor: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b"],
        hoverBackgroundColor: ["#a3d9ff", "#85bde1", "#5a8ab5", "#4a6c92"],
      },
    ],
  };

  const RegistrationFeetotalcostPie = {
    labels: ["USD Total", "EGP Total", "EUR Total", "GBP Total"],
    datasets: [
      {
        label: "Total Allowance Cost",
        data: [
          pieregistrationFeetotalcount.totalAmountUSD,
          pieregistrationFeetotalcount.totalAmountEGP,
          pieregistrationFeetotalcount.totalAmountEUR,
          pieregistrationFeetotalcount.totalAmountGBP,
        ],
        backgroundColor: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b"],
        hoverBackgroundColor: ["#a3d9ff", "#85bde1", "#5a8ab5", "#4a6c92"],
      },
    ],
  };

  //Home Request Count Chart
  const data = [
    ["Department", "Approved", "Rejected", "Pending"],
    ...HomeRequestCount.filter(
      (dept) =>
        dept.approvedCount > 0 ||
        dept.rejectedCount > 0 ||
        dept.pendingCount > 0
      // dept.totalCount > 0
    ).map((department) => [
      department.departmentName,
      department.approvedCount,
      department.rejectedCount,
      department.pendingCount,
      // department.totalCount,
    ]),
  ];

  const options = {
    title: "Home Request Statistics",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 14, maxLines: 3 }, // Limit to 3 lines
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#4CAF50", "#E53935", "#FFC107", "#3c89db"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };
  /*
  (USD)Approved: #91c221
  (GBP)Rejected: #f32525
  (EGP)Pending: #f7a10f
  (EUR)Total: #3c89db
  */
  //Home Plane Class
  const homePlaneClassdata = [
    ["Department", "Business", "Economy"],
    ...HomeRequestPlane.filter(
      (dept) => dept.businessClassCounts > 0 || dept.economyClassCounts > 0
    ).map((department) => [
      department.departmentName,
      department.businessClassCounts,
      department.economyClassCounts,
    ]),
  ];

  const homeplaneClassoptions = {
    title: "Home Flight Class Statistics",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 12, maxLines: 3 }, // Limit to 3 lines
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#79c1fb", "#3c89db"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };
  //Business Request Count
  const businessRequestdata = [
    ["Department", "Approved", "Rejected", "Pending"],
    ...businessrequestcount
      .filter(
        (dept) =>
          dept.approvedCount > 0 ||
          dept.rejectedCount > 0 ||
          dept.pendingCount > 0
        // dept.totalCount > 0
      )
      .map((department) => [
        department.departmentName,
        department.approvedCount,
        department.rejectedCount,
        department.pendingCount,
        // department.totalCount,
      ]),
  ];

  const businessRequestoptions = {
    title: "Busienss Request Statistics",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 12, maxLines: 3 }, // Limit to 3 lines
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#4CAF50", "#E53935", "#FFC107", "#3c89db"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };
  //Business Request Transportation Count
  const businessTransportationRequestdata = [
    ["Department", "USD", "EGP", "EUR", "GBP"],
    ...businesstransportationRequest
      .filter(
        (dept) =>
          dept.totalAmountUSD > 0 ||
          dept.totalAmountEGP > 0 ||
          dept.totalAmountEUR > 0 ||
          dept.totalAmountGBP > 0
      )
      .map((department) => [
        department.departmentName,
        department.totalAmountUSD,
        department.totalAmountEGP,
        department.totalAmountEUR,
        department.totalAmountGBP,
      ]),
  ];

  const businessTransportationRequestoptions = {
    title: "Business Request Transfer Statistics",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 14, maxLines: 3 }, // Limit to 3 lines
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };
  //Business Request Allowance Count
  const businessAllowanceRequestdata = [
    ["Department", "USD", "EGP", "EUR", "GBP"],
    ...businessAllowanceRequest
      .filter(
        (dept) =>
          dept.totalAmountUSD > 0 ||
          dept.totalAmountEGP > 0 ||
          dept.totalAmountEUR > 0 ||
          dept.totalAmountGBP > 0
      )
      .map((department) => [
        department.departmentName,
        department.totalAmountUSD,
        department.totalAmountEGP,
        department.totalAmountEUR,
        department.totalAmountGBP,
      ]),
  ];

  const businessAllowanceRequestoptions = {
    title: "Busienss Request Allowance Statistics",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 14, maxLines: 3 }, // Limit to 3 lines
      titleTextStyle: { fontSize: 12 },
    },
    // colors: ["#4CAF50", "#FFC107", "#1E88E5", "#E53935"],
    colors: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b"],

    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };
  //Business Request Participation Fee Count
  const businessRegistrationRequestdata = [
    ["Department", "USD", "EGP", "EUR", "GBP"],
    ...businessRegistrationFeeRequest
      .filter(
        (dept) =>
          dept.totalAmountUSD > 0 ||
          dept.totalAmountEGP > 0 ||
          dept.totalAmountEUR > 0 ||
          dept.totalAmountGBP > 0
      )
      .map((department) => [
        department.departmentName,
        department.totalAmountUSD,
        department.totalAmountEGP,
        department.totalAmountEUR,
        department.totalAmountGBP,
      ]),
  ];

  const businessRegistrationRequestoptions = {
    title: "Busienss Request Particpation Statistics",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 14, maxLines: 3 }, // Limit to 3 lines
      titleTextStyle: { fontSize: 12 },
    },
    // colors: ["#4CAF50", "#FFC107", "#1E88E5", "#E53935"],
    colors: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };
  //Business Request Visa Count
  const businessVisaRequestdata = [
    ["Department", "USD", "EGP", "EUR", "GBP"],
    ...businessVisaRequest
      .filter(
        (dept) =>
          dept.totalAmountUSD > 0 ||
          dept.totalAmountEGP > 0 ||
          dept.totalAmountEUR > 0 ||
          dept.totalAmountGBP > 0
      )
      .map((department) => [
        department.departmentName,
        department.totalAmountUSD,
        department.totalAmountEGP,
        department.totalAmountEUR,
        department.totalAmountGBP,
      ]),
  ];

  const businessVisaRequestoptions = {
    title: "Busienss Request Visa Statistics",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 14, maxLines: 3 }, // Limit to 3 lines
      titleTextStyle: { fontSize: 12 },
    },
    // colors: ["#4CAF50", "#FFC107", "#1E88E5", "#E53935"],
    colors: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b"],

    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };
  //Business Request Accomdation Count
  const businessAccomdationRequestdata = [
    ["Department", "USD", "EGP", "EUR", "GBP"],
    ...businessrequestAccomdation
      .filter(
        (dept) =>
          dept.totalAmountUSD > 0 ||
          dept.totalAmountEGP > 0 ||
          dept.totalAmountEUR > 0 ||
          dept.totalAmountGBP > 0
      )
      .map((department) => [
        department.departmentName,
        department.totalAmountUSD,
        department.totalAmountEGP,
        department.totalAmountEUR,
        department.totalAmountGBP,
      ]),
  ];

  const businessAccomdationRequestoptions = {
    title: "Busienss Request Accomdation Statistics",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 14, maxLines: 3 }, // Limit to 3 lines
      titleTextStyle: { fontSize: 12 },
    },
    // colors: ["#4CAF50", "#FFC107", "#1E88E5", "#E53935"],
    colors: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b"],

    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };
  return (
    <div className="container">
      <div className="horizontal-rule mb-4">
        <hr />
        <h5 className="horizontal-rule-text fs-5">Business Request Charts</h5>
      </div>
      <div className="charts-container">
        <div className="chart">
          <h6>Total Allowance Cost</h6>
          <div className="expandable-filter-section">
            <button
              className="mb-3"
              style={{
                backgroundColor: "#355c7b",
                color: "white",
                fontSize: "0.8rem",
              }}
              onClick={() => {
                if (isAllowanceExpanded) {
                  setSelectedDepType(""); // Reset depTypeId
                  setAllowancepieStartDate(null); // Reset startDate
                  setAllowancepieEndDate(null); // Reset endDate
                }
                setisAllowanceExpanded(!isAllowanceExpanded); // Toggle the filter visibility
              }}
            >
              {isAllowanceExpanded ? "Hide Filter" : "Filter"}
            </button>
            {isAllowanceExpanded && (
              <div className="content mt-3">
                <div>
                  <div className="form-group">
                    <select
                      className="form-select form-select-lg custom-select"
                      value={selectedDepType}
                      style={{ fontSize: "0.8rem" }}
                      onChange={(e) => setSelectedDepType(e.target.value)}
                      name="otherTransferId"
                    >
                      <option value="">All Department Types</option>
                      {Array.isArray(depTypes) &&
                        depTypes.map((data) => (
                          <option key={data.rowId} value={data.rowId}>
                            {data.depTypeName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-12 col-sm-6">
                    <div className="form-group">
                      <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        style={{ fontSize: "0.8rem" }}
                        id="startDate"
                        onChange={(e) =>
                          setAllowancepieStartDate(e.target.value || null)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="form-group">
                      <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                        End Date
                      </label>
                      <input
                        type="date"
                        style={{ fontSize: "0.8rem" }}
                        className="form-control"
                        id="endDate"
                        onChange={(e) =>
                          setAllowancepieEndDate(e.target.value || null)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Pie data={allowancetotalcostPie} options={Pieoptions} />
          <br />
          <JSONToCSVDownloader
            data={pieallowancetotalcount}
            headers={PieAllowanceTotalCountHeader}
            filename="total_allowance_report.csv"
          />
        </div>
        <div className="chart">
          <h6>Total Participation Cost</h6>
          <button
            className="mb-3"
            style={{
              backgroundColor: "#355c7b",
              color: "white",
              fontSize: "0.8rem",
            }}
            onClick={() => {
              if (isParticpationExpanded) {
                // Reset fields when hiding the filter
                setParticpationselectedDepType(""); // Reset depTypeId
                setParticpationsPieStartDate(null); // Reset startDate
                setParticpationsPieEndDate(null); // Reset endDate
              }
              setisParticpationExpanded(!isParticpationExpanded); // Toggle the filter visibility
            }}
          >
            {isParticpationExpanded ? "Hide Filter" : "Filter"}
          </button>
          {isParticpationExpanded && (
            <div className="content mt-3">
              <div>
                <div className="form-group">
                  <select
                    className="form-select form-select-lg custom-select"
                    style={{ fontSize: "0.8rem" }}
                    value={ParticpationselectedDepType}
                    onChange={(e) =>
                      setParticpationselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                  >
                    <option value="">All Department Types</option>
                    {Array.isArray(depTypes) &&
                      depTypes.map((data) => (
                        <option key={data.rowId} value={data.rowId}>
                          {data.depTypeName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      style={{ fontSize: "0.8rem" }}
                      id="startDate"
                      onChange={(e) =>
                        setParticpationsPieStartDate(e.target.value || null)
                      }
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      style={{ fontSize: "0.8rem" }}
                      className="form-control"
                      id="endDate"
                      onChange={(e) =>
                        setParticpationsPieEndDate(e.target.value || null)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <Pie options={Pieoptions} data={RegistrationFeetotalcostPie} />
          <br />
          <JSONToCSVDownloader
            data={pieregistrationFeetotalcount}
            headers={PieRegistrationFeeTotalCountHeader}
            filename="total_registration_report.csv"
          />
        </div>
        <div className="chart">
          <h6>Total Visa Cost</h6>
          <button
            className="mb-3"
            style={{
              backgroundColor: "#355c7b",
              color: "white",
              fontSize: "0.8rem",
            }}
            onClick={() => {
              if (isVisaExpanded) {
                // Reset fields when hiding the filter
                setVisaselectedDepType(""); // Reset depTypeId
                setVisaPieStartDate(null); // Reset startDate
                setVisaPieEndDate(null); // Reset endDate
              }
              setisVisaExpanded(!isVisaExpanded); // Toggle the filter visibility
            }}
          >
            {isVisaExpanded ? "Hide Filter" : "Filter"}
          </button>
          {isVisaExpanded && (
            <div className="content mt-3">
              <div>
                <div className="form-group">
                  <select
                    style={{ fontSize: "0.8rem" }}
                    className="form-select form-select-lg custom-select"
                    value={VisaselectedDepType}
                    onChange={(e) => {
                      setVisaselectedDepType(e.target.value);
                    }}
                    name="planeClassId"
                    required
                  >
                    <option value="">Select Type</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      style={{ fontSize: "0.8rem" }}
                      className="form-control"
                      id="startDate"
                      onChange={(e) =>
                        setVisaPieStartDate(e.target.value || null)
                      }
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      style={{ fontSize: "0.8rem" }}
                      className="form-control"
                      id="endDate"
                      onChange={(e) =>
                        setVisaPieEndDate(e.target.value || null)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <Pie options={Pieoptions} data={VisatotalcostPie} />
          <br />
          <JSONToCSVDownloader
            data={pieVisatotalcount}
            headers={PieVisaTotalCountHeader}
            filename="total_visa_report.csv"
          />
        </div>
      </div>
      <div className="charts-container">
        <div className="chart">
          <h6>Total Transfer Cost</h6>
          <button
            className="mb-3"
            style={{
              backgroundColor: "#355c7b",
              color: "white",
              fontSize: "0.8rem",
            }}
            onClick={() => {
              if (isTransferExpanded) {
                // Reset fields when hiding the filter
                setTransferselectedDepType(""); // Reset depTypeId
                settransferpieStartDate(null); // Reset startDate
                settransferpieEndDate(null); // Reset endDate
              }
              setisTransferExpanded(!isTransferExpanded); // Toggle the filter visibility
            }}
          >
            {isTransferExpanded ? "Hide Filter" : "Filter"}
          </button>
          {isTransferExpanded && (
            <div className="content mt-3">
              <div>
                <div className="form-group">
                  <select
                    className="form-select form-select-lg custom-select"
                    value={TransferselectedDepType}
                    style={{ fontSize: "0.8rem" }}
                    onChange={(e) => {
                      setTransferselectedDepType(e.target.value);
                    }}
                    name="planeClassId"
                    required
                  >
                    <option value="">Select Type</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      style={{ fontSize: "0.8rem" }}
                      className="form-control"
                      id="startDate"
                      onChange={(e) =>
                        settransferpieStartDate(e.target.value || null)
                      }
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      style={{ fontSize: "0.8rem" }}
                      className="form-control"
                      id="endDate"
                      onChange={(e) =>
                        settransferpieEndDate(e.target.value || null)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <Pie options={Pieoptions} data={TransportationtotalcostPie} />
          <br />
          <JSONToCSVDownloader
            data={pieTransportationtotalcount}
            headers={PieTransportationTotalCountHeader}
            filename="total_transportation_report.csv"
          />
        </div>
        <div className="chart">
          <h6>Total Accomdation Cost</h6>
          <button
            className="mb-3"
            style={{
              backgroundColor: "#355c7b",
              color: "white",
              fontSize: "0.8rem",
            }}
            onClick={() => {
              if (isAccomdationExpanded) {
                // Reset fields when hiding the filter
                setAccomdationselectedDepType(""); // Reset depTypeId
                setAccomdationpieStartDate(null); // Reset startDate
                setAccomdationpieEndDate(null); // Reset endDate
              }
              setisAccomdationExpanded(!isAccomdationExpanded); // Toggle the filter visibility
            }}
          >
            {isAccomdationExpanded ? "Hide Filter" : "Filter"}
          </button>
          {isAccomdationExpanded && (
            <div className="content mt-3">
              <div>
                <div className="form-group">
                  <select
                    style={{ fontSize: "0.8rem" }}
                    className="form-select form-select-lg custom-select"
                    value={AccomdationselectedDepType}
                    onChange={(e) => {
                      setAccomdationselectedDepType(e.target.value);
                    }}
                    name="planeClassId"
                    required
                  >
                    <option value="">Select Type</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      style={{ fontSize: "0.8rem" }}
                      className="form-control"
                      id="startDate"
                      onChange={(e) =>
                        setAccomdationpieStartDate(e.target.value || null)
                      }
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      style={{ fontSize: "0.8rem" }}
                      id="endDate"
                      onChange={(e) =>
                        setAccomdationpieEndDate(e.target.value || null)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <Pie options={Pieoptions} data={AccomdationtotalcostPie} />
          <br />
          <JSONToCSVDownloader
            data={pieAccomdationtotalcount}
            headers={PieAccomdationTotalCountHeader}
            filename="total_accomdation_report.csv"
          />
        </div>
        <div className="chart">
          <h6>Total Cost</h6>
          <button
            className="mb-3"
            style={{
              backgroundColor: "#355c7b",
              color: "white",
              fontSize: "0.8rem",
            }}
            onClick={() => {
              if (isOverallExpanded) {
                // Reset fields when hiding the filter
                setTotalselectedDepType(""); // Reset depTypeId
                setOverallTotalPiestartDate(null); // Reset startDate
                setOverallTotalPieendDate(null); // Reset endDate
              }
              setIsExpandedisOverallExpanded(!isOverallExpanded); // Toggle the filter visibility
            }}
          >
            {isOverallExpanded ? "Hide Filter" : "Filter"}
          </button>
          {isOverallExpanded && (
            <div className="content mt-3">
              <div>
                <div className="form-group">
                  <select
                    className="form-select form-select-lg custom-select"
                    style={{ fontSize: "0.8rem" }}
                    value={TotalselectedDepType}
                    onChange={(e) => {
                      setTotalselectedDepType(e.target.value);
                    }}
                    name="planeClassId"
                    required
                  >
                    <option value="">Select Type</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      style={{ fontSize: "0.8rem" }}
                      className="form-control"
                      id="startDate"
                      onChange={(e) =>
                        setOverallTotalPiestartDate(e.target.value || null)
                      }
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      style={{ fontSize: "0.8rem" }}
                      className="form-control"
                      id="endDate"
                      onChange={(e) =>
                        setOverallTotalPieendDate(e.target.value || null)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <Pie options={Pieoptions} data={AlltotalcostPie} />
          <br />
          <JSONToCSVDownloader
            data={pieAlltotalcount}
            headers={PieAllTotalCountHeader}
            filename="total_OverallTotal_report.csv"
          />
        </div>
      </div>
      <div className="horizontal-rule mb-4">
        <hr />
        <h5 className="horizontal-rule-text fs-5">
          Business Request Statistics
        </h5>
      </div>
      {/* Busienss Request Statistics  */}
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", margin: "0 auto", fontSize: "24px" }}
        />
      ) : error ? (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ fontSize: "12px", padding: "12px" }}
        />
      ) : (
        <>
          <div className="chart">
            <div className="row mb-3">
              <div className="col-12 col-sm-4">
                <div>
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Department Type
                    </label>
                    <select
                      style={{ fontSize: "0.8rem" }}
                      className="form-select form-select-lg custom-select"
                      value={BusinessStatusBarselectedDepType}
                      onChange={(e) =>
                        setBusinessStatusBarselectedDepType(e.target.value)
                      }
                      name="otherTransferId"
                    >
                      <option value="">All Department Types</option>
                      {Array.isArray(depTypes) &&
                        depTypes.map((data) => (
                          <option key={data.rowId} value={data.rowId}>
                            {data.depTypeName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="startDate"
                    onChange={(e) =>
                      setBusinessStatusBarStartDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="endDate"
                    onChange={(e) =>
                      setBusinessStatusBarEndDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
            </div>
            <Chart
              chartType="BarChart"
              width="100%"
              height="500px"
              style={{ fontSize: "0.8rem" }}
              data={businessRequestdata}
              options={businessRequestoptions}
              legendToggle
            />
            <JSONToCSVDownloader
              data={businessrequestcount}
              headers={BusinessRequestCountheaders}
              filename="businessrequest_departments_report.csv"
            />
          </div>
        </>
      )}
      {/*Business request Transfer Statistics*/}
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", margin: "0 auto", fontSize: "24px" }}
        />
      ) : error ? (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ fontSize: "18px", padding: "12px" }}
        />
      ) : (
        <>
          <div>
            <div className="chart">
              <div className="row mb-3">
                <div className="col-12 col-sm-4">
                  <div>
                    <div className="form-group">
                      <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                        Department Type
                      </label>
                      <select
                        style={{ fontSize: "0.8rem" }}
                        className="form-select form-select-lg custom-select"
                        value={TransferBarselectedDepType}
                        onChange={(e) =>
                          setTransferBarselectedDepType(e.target.value)
                        }
                        name="otherTransferId"
                      >
                        <option value="">All Department Types</option>
                        {Array.isArray(depTypes) &&
                          depTypes.map((data) => (
                            <option key={data.rowId} value={data.rowId}>
                              {data.depTypeName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-4">
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      style={{ fontSize: "0.8rem" }}
                      className="form-control"
                      id="startDate"
                      onChange={(e) => setStartDate(e.target.value || null)}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-4">
                  <div className="form-group">
                    <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      style={{ fontSize: "0.8rem" }}
                      className="form-control"
                      id="endDate"
                      onChange={(e) => setEndDate(e.target.value || null)}
                    />
                  </div>
                </div>
              </div>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={businessTransportationRequestdata}
                options={businessTransportationRequestoptions}
                legendToggle
              />

              <JSONToCSVDownloader
                data={businesstransportationRequest}
                headers={Transportationheaders}
                filename="businessrequest_transportation_report.csv"
              />
            </div>
          </div>
        </>
      )}
      {/*Busienss Request Allowance Statistics*/}
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", margin: "0 auto", fontSize: "24px" }}
        />
      ) : error ? (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ fontSize: "12px", padding: "12px" }}
        />
      ) : (
        <>
          <div className="chart">
            <div className="row mb-3">
              <div className="col-12 col-sm-4">
                <div>
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Department Type
                    </label>
                    <select
                      className="form-select form-select-lg custom-select"
                      style={{ fontSize: "0.8rem" }}
                      value={AllowanceBarselectedDepType}
                      onChange={(e) =>
                        setAllowanceBarselectedDepType(e.target.value)
                      }
                      name="otherTransferId"
                    >
                      <option value="">All Department Types</option>
                      {Array.isArray(depTypes) &&
                        depTypes.map((data) => (
                          <option key={data.rowId} value={data.rowId}>
                            {data.depTypeName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="startDate"
                    onChange={(e) =>
                      setAllowanceStartDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="endDate"
                    onChange={(e) =>
                      setAllowanceEndDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
            </div>
            <Chart
              chartType="BarChart"
              width="100%"
              height="500px"
              data={businessAllowanceRequestdata}
              options={businessAllowanceRequestoptions}
              legendToggle
            />
            <JSONToCSVDownloader
              data={businessAllowanceRequest}
              headers={Allowanceheaders}
              filename="businessrequest_Allowance_report.csv"
            />
          </div>
        </>
      )}
      {/* Busienss Request Particpation Statistics */}
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", margin: "0 auto", fontSize: "24px" }}
        />
      ) : error ? (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ fontSize: "12px", padding: "12px" }}
        />
      ) : (
        <>
          <div className="chart">
            <div className="row mb-3">
              <div className="col-12 col-sm-4">
                <div>
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Department Type
                    </label>
                    <select
                      style={{ fontSize: "0.8rem" }}
                      className="form-select form-select-lg custom-select"
                      value={ParticpationBarselectedDepType}
                      onChange={(e) =>
                        setParticpationBarselectedDepType(e.target.value)
                      }
                      name="otherTransferId"
                    >
                      <option value="">All Department Types</option>
                      {Array.isArray(depTypes) &&
                        depTypes.map((data) => (
                          <option key={data.rowId} value={data.rowId}>
                            {data.depTypeName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="startDate"
                    onChange={(e) =>
                      setParticpationStartDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="endDate"
                    onChange={(e) =>
                      setParticpationEndDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
            </div>
            <Chart
              chartType="BarChart"
              width="100%"
              height="500px"
              data={businessRegistrationRequestdata}
              options={businessRegistrationRequestoptions}
              legendToggle
            />
            <JSONToCSVDownloader
              data={businessRegistrationFeeRequest}
              headers={RegistrationFeeheaders}
              filename="businessrequest_RegistrationFee_report.csv"
            />
          </div>
        </>
      )}
      {/* Busienss Request Visa Statistics */}
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", margin: "0 auto", fontSize: "24px" }}
        />
      ) : error ? (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ fontSize: "12px", padding: "12px" }}
        />
      ) : (
        <>
          <div className="chart">
            <div className="row mb-3">
              <div className="col-12 col-sm-4">
                <div>
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Department Type
                    </label>
                    <select
                      style={{ fontSize: "0.8rem" }}
                      className="form-select form-select-lg custom-select"
                      value={VisaBarselectedDepType}
                      onChange={(e) =>
                        setVisaBarselectedDepType(e.target.value)
                      }
                      name="otherTransferId"
                    >
                      <option value="">All Department Types</option>
                      {Array.isArray(depTypes) &&
                        depTypes.map((data) => (
                          <option key={data.rowId} value={data.rowId}>
                            {data.depTypeName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                    Start Date
                  </label>
                  <input
                    style={{ fontSize: "0.8rem" }}
                    type="date"
                    className="form-control"
                    id="startDate"
                    onChange={(e) => setVisaStartDate(e.target.value || null)}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="endDate"
                    onChange={(e) => setVisaEndDate(e.target.value || null)}
                  />
                </div>
              </div>
            </div>
            <Chart
              chartType="BarChart"
              width="100%"
              height="500px"
              data={businessVisaRequestdata}
              options={businessVisaRequestoptions}
              legendToggle
            />
            <JSONToCSVDownloader
              data={businessVisaRequest}
              headers={Visaheaders}
              filename="businessrequest_Visa_report.csv"
            />
          </div>
        </>
      )}
      {/* Busienss Request Accomdation Statistics */}
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", margin: "0 auto", fontSize: "24px" }}
        />
      ) : error ? (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ fontSize: "12px", padding: "12px" }}
        />
      ) : (
        <>
          <div className="chart">
            <div className="row mb-3">
              <div className="col-12 col-sm-4">
                <div>
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Department Type
                    </label>
                    <select
                      className="form-select form-select-lg custom-select"
                      style={{ fontSize: "0.8rem" }}
                      value={AccomdationBarselectedDepType}
                      onChange={(e) =>
                        setAccomdationBarselectedDepType(e.target.value)
                      }
                      name="otherTransferId"
                    >
                      <option value="">All Department Types</option>
                      {Array.isArray(depTypes) &&
                        depTypes.map((data) => (
                          <option key={data.rowId} value={data.rowId}>
                            {data.depTypeName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="startDate"
                    onChange={(e) =>
                      setAccomdationStartDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="endDate"
                    onChange={(e) =>
                      setAccomdationEndDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
            </div>
            <Chart
              chartType="BarChart"
              width="100%"
              height="500px"
              data={businessAccomdationRequestdata}
              options={businessAccomdationRequestoptions}
              legendToggle
            />
            <JSONToCSVDownloader
              data={businessrequestAccomdation}
              headers={Accomdationheaders}
              filename="businessrequest_Accomdation_report.csv"
            />
          </div>
        </>
      )}
      <div className="horizontal-rule mb-4">
        <hr />
        <h5 className="horizontal-rule-text fs-5">Home Request Statistics</h5>
      </div>
      {/* Home Request Statistics */}
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", margin: "0 auto", fontSize: "24px" }}
        />
      ) : error ? (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ fontSize: "12px", padding: "12px" }}
        />
      ) : (
        <>
          <div className="chart">
            <div className="row mb-3">
              <div className="col-12 col-sm-4">
                <div>
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Department Type
                    </label>
                    <select
                      style={{ fontSize: "0.8rem" }}
                      className="form-select form-select-lg custom-select"
                      value={HomeStatusBarselectedDepType}
                      onChange={(e) =>
                        setHomeStatusBarselectedDepType(e.target.value)
                      }
                      name="otherTransferId"
                    >
                      <option value="">All Department Types</option>
                      {Array.isArray(depTypes) &&
                        depTypes.map((data) => (
                          <option key={data.rowId} value={data.rowId}>
                            {data.depTypeName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="startDate"
                    onChange={(e) =>
                      setHomeStatusBarStartDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="endDate"
                    onChange={(e) =>
                      setHomeStatusBarEndDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
            </div>
            <Chart
              chartType="BarChart"
              width="100%"
              height="500px"
              data={data}
              options={options}
              legendToggle
            />
            <JSONToCSVDownloader
              data={HomeRequestCount}
              headers={HomeRequestCountheaders}
              filename="homerequest_departments_report.csv"
            />
          </div>
        </>
      )}
      {/* Home Flight Class Statistics */}
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", margin: "0 auto", fontSize: "24px" }}
        />
      ) : error ? (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ fontSize: "12px", padding: "12px" }}
        />
      ) : (
        <>
          <div className="chart">
            <div className="row mb-3">
              <div className="col-12 col-sm-4">
                <div>
                  <div className="form-group">
                    <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                      Department Type
                    </label>
                    <select
                      style={{ fontSize: "0.8rem" }}
                      className="form-select form-select-lg custom-select"
                      value={HomeFlightBarselectedDepType}
                      onChange={(e) =>
                        setHomeFlightBarselectedDepType(e.target.value)
                      }
                      name="otherTransferId"
                    >
                      <option value="">All Department Types</option>
                      {Array.isArray(depTypes) &&
                        depTypes.map((data) => (
                          <option key={data.rowId} value={data.rowId}>
                            {data.depTypeName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="startDate" style={{ fontSize: "0.8rem" }}>
                    Start Date
                  </label>
                  <input
                    style={{ fontSize: "0.8rem" }}
                    type="date"
                    className="form-control"
                    id="startDate"
                    onChange={(e) =>
                      setHomeFlightBarStartDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4">
                <div className="form-group">
                  <label htmlFor="endDate" style={{ fontSize: "0.8rem" }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    style={{ fontSize: "0.8rem" }}
                    className="form-control"
                    id="endDate"
                    onChange={(e) =>
                      setHomeFlightBarEndDate(e.target.value || null)
                    }
                  />
                </div>
              </div>
            </div>
            <Chart
              chartType="BarChart"
              width="100%"
              height="500px"
              data={homePlaneClassdata}
              options={homeplaneClassoptions}
              legendToggle
            />
            <JSONToCSVDownloader
              data={HomeRequestPlane}
              headers={HomeRequestFlightStatsheaders}
              filename="homerequest_flight_statistics_report.csv"
            />
          </div>
        </>
      )}
    </div>
  );
};
export default Statistics;
