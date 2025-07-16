import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { Pie, Doughnut } from "react-chartjs-2";
import { getToken } from "../Util/Authenticate";
import URL from "../Util/config";
import { Spin, Alert } from "antd";
import JSONToCSVDownloader from "../shared_components/JSONToCSVDownloader";

const Statistics = () => {
  //State variables for Statistics component
  //Overview
  const [Overviewloading, setOverviewloading] = useState(true);
  //Budget Loading
  const [loading, setLoading] = useState(true);
  const [eventBudgetCostloading, seteventBudgetCostloading] = useState(true);
  //Marcom Loading
  const [eventMarcomloading, seteventMarcomloading] = useState(true);
  //IT Loading
  const [eventITloading, seteventITloading] = useState(true);
  const [eventITComploading, seteventITComploading] = useState(true);
  const [eventITServiceloading, seteventITServiceloading] = useState(true);
  //Transportation Loading
  const [eventTransloading, seteventTransloading] = useState(true);
  const [eventTransServiceloading, seteventTransServiceloading] =
    useState(true);
  const [eventTransComploading, seteventTransComploading] = useState(true);
  //Accommodation Loading
  const [eventAccommCountloading, seteventAccommCountloading] = useState(true);
  const [eventAccommServiceloading, seteventAccommServiceloading] =
    useState(true);
  const [eventAccommCompCountloading, seteventAccommCompCountloading] =
    useState(true);
  //OverView Error
  const [Overviewerror, setOverviewerror] = useState(null);
  //Budget Error
  const [error, setError] = useState(null);
  const [eventBudgetCosterror, seteventBudgetCosterror] = useState(null);
  //Marcom Error
  const [eventMarcomError, seteventMarcomError] = useState(null);
  //IT Error
  const [eventITError, seteventITError] = useState(null);
  const [eventITCompError, seteventITCompError] = useState(null);
  const [eventITServiceError, seteventITServiceError] = useState(null);
  //Transportation Error
  const [eventTransError, seteventTransError] = useState(null);
  const [eventTransSericeError, seteventTransSericeError] = useState(null);
  const [eventTransCompError, seteventTransCompError] = useState(null);
  //Accommodation Error
  const [eventAccommCountError, seteventAccommCountError] = useState(null);
  const [eventAccommServiceError, seteventAccommServiceError] = useState(null);
  const [eventAccommCountCompError, seteventAccommCountCompError] =
    useState(null);
  //Department Types State Variables
  const [depTypes, setdepTypes] = useState([]);
  //Overview Statistics State Variables
  const [eventapprovaloverviewState, seteventapprovaloverviewState] = useState(
    []
  );
  const [
    eventapprovaloverviewselectedDepType,
    seteventapprovaloverviewselectedDepType,
  ] = useState("");
  const [eventapprovaloverviewStartDate, seteventapprovaloverviewStartDate] =
    useState(null);
  const [eventapprovaloverviewEndDate, seteventapprovaloverviewEndDate] =
    useState(null);
  //Event Budget Per Department Statistics State Variables
  const [eventbudgetperdepartment, seteventbudgetperdepartment] = useState([]);
  const [
    budgetperdepartmentselectedDepType,
    setbudgetperdepartmentselectedDepType,
  ] = useState("");
  const [BudgetPerDepartmentStartDate, setBudgetPerDepartmentStartDate] =
    useState(null);
  const [BudgetPerDepartmentEndDate, setBudgetPerDepartmentEndDate] =
    useState(null);

  //Event Budget Estimated Cost Per Department Statistics State Variables
  const [eventbudgetperdepartmentcost, seteventbudgetperdepartmentcost] =
    useState([]);
  const [
    budgetperdepartmentcostselectedDepType,
    setbudgetperdepartmentcostselectedDepType,
  ] = useState("");
  const [
    BudgetPerDepartmentCostStartDate,
    setBudgetPerDepartmentCostStartDate,
  ] = useState(null);
  const [BudgetPerDepartmentCostEndDate, setBudgetPerDepartmenCostEndDate] =
    useState(null);

  //Marcom Count Per Department Statistics State Variables
  const [eventmarcomperdepartment, seteventmarcomperdepartment] = useState([]);
  const [
    marcomperdepartmentselectedDepType,
    setmarcomperdepartmentselectedDepType,
  ] = useState("");
  const [MarcomPerDepartmentStartDate, setMarcomPerDepartmentStartDate] =
    useState(null);
  const [MarcomPerDepartmentEndDate, setMarcomPerDepartmentEndDate] =
    useState(null);

  //IT Count Per Department Statistics State Variables
  const [eventITperdepartment, seteventITperdepartment] = useState([]);
  const [ITperdepartmentselectedDepType, setITperdepartmentselectedDepType] =
    useState("");
  const [ITPerDepartmentStartDate, setITPerDepartmentStartDate] =
    useState(null);
  const [ITPerDepartmentEndDate, setITPerDepartmentEndDate] = useState(null);

  //IT Component Count Per Department Statistics State Variables
  const [eventITCompperdepartment, seteventITCompperdepartment] = useState([]);
  const [
    ITCompperdepartmentselectedDepType,
    setITCompperdepartmentselectedDepType,
  ] = useState("");
  const [ITCompPerDepartmentStartDate, setITCompPerDepartmentStartDate] =
    useState(null);
  const [ITCompPerDepartmentEndDate, setITCompPerDepartmentEndDate] =
    useState(null);

  //IT Serivce Count Per Department Statistics State Variables
  const [eventITServiceCountState, seteventITServiceCountState] = useState([]);
  const [ITServiceCountselectedDepType, setITServiceCountselectedDepType] =
    useState("");
  const [ITServiceCountStartDate, setITServiceCountStartDate] = useState(null);
  const [ITServiceCountEndDate, setITServiceCountEndDate] = useState(null);

  //Event Transportation Per Department Statistics State Variables
  const [eventTransperdepartment, seteventTransperdepartment] = useState([]);
  const [
    TransperdepartmentselectedDepType,
    setTransperdepartmentselectedDepType,
  ] = useState("");
  const [TransPerDepartmentStartDate, setTransPerDepartmentStartDate] =
    useState(null);
  const [TransPerDepartmentEndDate, setTransPerDepartmentEndDate] =
    useState(null);

  //Event Transportation Component Most used Statistics State Variables
  const [eventTransSerivceCountState, seteventTransSerivceCountState] =
    useState([]);
  const [TransServiceCountStartDate, setTransServiceCountStartDate] =
    useState(null);
  const [TransServiceCountEndDate, setTransServiceCountEndDate] =
    useState(null);

  //Event Transportation Component Count Statistics State Variables
  const [eventTransCompCount, seteventTransCompCount] = useState([]);
  const [TransCompCountselectedDepType, setTransCompCountselectedDepType] =
    useState("");
  const [TransCompCountStartDate, setTransCompCountStartDate] = useState(null);
  const [TransCompCountEndDate, setTransCompCountEndDate] = useState(null);

  //Event Accommodation Count Per Department Statistics State Variables
  const [eventAccommCountData, seteventAccommCountData] = useState([]);
  const [AccommCountselectedDepType, setAccommCountselectedDepType] =
    useState("");
  const [AccommCountStartDate, setAccommCountStartDate] = useState(null);
  const [AccommCountEndDate, setAccommCountEndDate] = useState(null);
  //Event Accommodation Component Most used Statistics State Variables
  const [eventAccommSerivceCountState, seteventAccommSerivceCountState] =
    useState([]);
  const [AccommServiceCountStartDate, setAccommServiceCountStartDate] =
    useState(null);
  const [AccommServiceCountEndDate, setAccommServiceCountEndDate] =
    useState(null);
  //Event Accommodation Component Count Statistics State Variables
  const [eventAccommCompCount, seteventAccommCompCount] = useState([]);
  const [AccommCountCompselectedDepType, setAccommCountCompselectedDepType] =
    useState("");
  const [AccommCountCompStartDate, setAccommCountCompStartDate] =
    useState(null);
  const [AccommCompCountEndDate, setAccommCompCountEndDate] = useState(null);
  //Request Approval Summary Chart and CSV Data Preparation
  //Home Request Count Chart
  const eventapprovaloverviewdata = [
    ["Department", "Approved", "Rejected", "Pending"],
    ...eventapprovaloverviewState
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

  const eventapprovaloverviewoptions = {
    title: "Request Status by Department",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Number of Requests",
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

  // const eventapprovaloverviewheaders = [
  //   "departmentName",
  //   "approvedCount",
  //   "rejectedCount",
  //   "pendingCount",
  //   // "totalCount",
  // ];

  const eventapprovaloverviewheaders = [
    { key: "departmentName", label: "Department Name" },
    { key: "approvedCount", label: "Approved" },
    { key: "rejectedCount", label: "Rejected" },
    { key: "pendingCount", label: "Pending" },
  ];
  //Budget Per Department Bar Chart & CSV Data Preparation
  const eventbudgetperdepartmentdata = [
    ["Department", "Number of Requests"],
    ...eventbudgetperdepartment
      .filter((dept) => dept.count > 0)
      .map((department) => [department.departmentName, department.count]),
  ];
  const eventbudgetperdepartmentoptions = {
    title: "Departments Requesting Budget Service",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Number of Requests",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#43749b", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const BudgetPerDepartmentHeaders = [
    { key: "departmentName", label: "Department Name" },
    { key: "count", label: "Number of Requests" },
  ];

  //Budget Per Department Cost Bar Chart & CSV Data Preparation
  const eventbudgetperdepartmentCostdata = [
    ["Department", "Total Estimated Cost (EGP)"],
    ...eventbudgetperdepartmentcost
      .filter((dept) => dept.totalBudget > 0)
      .map((department) => [department.departmentName, department.totalBudget]),
  ];
  const eventbudgetperdepartmentcostoptions = {
    title: "Total Estimated Cost by Department",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Total Estimated Cost (EGP)",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#43749b", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const BudgetPerDepartmentCostHeaders = [
    { key: "departmentName", label: "Department Name" },
    { key: "totalBudget", label: "Total Estimated Cost (EGP)" },
  ];

  //Marcom Per Department Cost Bar Chart & CSV Data Preparation
  const eventmarcomperdepartmentdata = [
    ["Department", "Number of Requests"],
    ...eventmarcomperdepartment
      .filter((dept) => dept.count > 0)
      .map((department) => [department.departmentName, department.count]),
  ];
  const eventmarcomperdepartmentoptions = {
    title: "Departments Requesting Marcom Service",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Number of Requests",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#43749b", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const MarcomPerDepartmentHeaders = [
    { key: "departmentName", label: "Department Name" },
    { key: "count", label: "Number of Requests" },
  ];

  //IT Per Department Cost Bar Chart & CSV Data Preparation
  const eventITperdepartmentdata = [
    ["Department", "Number of Requests"],
    ...eventITperdepartment
      .filter((dept) => dept.count > 0)
      .map((department) => [department.departmentName, department.count]),
  ];
  const eventITperdepartmentoptions = {
    title: "Departments Requesting IT Service",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Number of Requests",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#43749b", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const ITPerDepartmentHeaders = [
    { key: "departmentName", label: "Department Name" },
    { key: "count", label: "Number of Requests" },
  ];

  //IT Service Count Bar Chart & CSV Data Preparation
  const eventITServiceCountdata = [
    ["IT Component", "Usage Count"],
    ...eventITServiceCountState
      .filter((dept) => dept.totalCount > 0)
      .sort((a, b) => b.totalCount - a.totalCount) // descending sort
      .map((department) => [department.serviceType, department.totalCount]),
  ];
  const eventITServiceCountoptions = {
    title: "Most Used IT Components",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Usage Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "IT Component",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#43749b", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const ITServiceCountHeaders = [
    { key: "serviceType", label: "IT Component" },
    { key: "totalCount", label: "Usage Count" },
  ];

  // IT Service Type Count Bar Chart & CSV Data Preparation
  const eventITCompCountdata = (() => {
    // Get unique service types from the data
    const serviceTypes = [
      ...new Set(eventITCompperdepartment.map((item) => item.serviceType)),
    ];

    // Get unique departments
    const departments = [
      ...new Set(eventITCompperdepartment.map((item) => item.departmentName)),
    ];

    // Create header row with department name and all service types
    const header = ["Department", ...serviceTypes];

    // Create data rows for each department
    const dataRows = departments
      .map((department) => {
        const row = [department];

        // For each service type, find the count for this department
        serviceTypes.forEach((serviceType) => {
          const found = eventITCompperdepartment.find(
            (item) =>
              item.departmentName === department &&
              item.serviceType === serviceType
          );
          row.push(found ? found.count : 0);
        });

        return row;
      })
      .filter((row) => {
        // Filter out departments with no counts (all service types are 0)
        return row.slice(1).some((count) => count > 0);
      });

    return [header, ...dataRows];
  })();

  const eventITCompCountoptions = {
    title: "Most Used IT Component by Department",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Usage Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: [
      "#79c1fb", // light blue
      "#65a2d5", // medium blue
      "#43749b", // desaturated blue
      "#355c7b", // deep blue
      "#2a4a5b", // deep teal
      "#4c6b82", // steel blue (replacement for green)
      "#597f9c", // cool denim (replacement for red)
      "#3f5e74", // desaturated indigo (replacement for purple)
      "#5a6e7f", // blue-gray (replacement for black)
    ],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  // Headers for CSV export
  const ITCompCountHeaders = [
    { key: "departmentName", label: "Department" },
    { key: "serviceType", label: "IT Component" },
    { key: "count", label: "Usage Count" },
  ];

  //Trans Per Department Cost Bar Chart & CSV Data Preparation
  const eventTransperdepartmentdata = [
    ["Department", "Number of Requests"],
    ...eventTransperdepartment
      .filter((dept) => dept.count > 0)
      .map((department) => [department.departmentName, department.count]),
  ];
  const eventTransperdepartmentoptions = {
    title: "Departments Requesting Transportation Service",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Number of Requests",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#43749b", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const TransPerDepartmentHeaders = [
    { key: "departmentName", label: "Department" },
    { key: "count", label: "Number of Requests" },
  ];

  //Transportation Service Count Bar Chart & CSV Data Preparation
  const eventTransServiceCountdata = [
    ["Tranportation Service", "Usage Count"],
    ...eventTransSerivceCountState
      .filter((dept) => dept.totalCount > 0)
      .sort((a, b) => b.totalCount - a.totalCount) // descending sort
      .map((department) => [department.serviceType, department.totalCount]),
  ];
  const eventTransServiceCountoptions = {
    title: "Most Used Transportation Services",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Usage Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Tranportation Service",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#43749b", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const TransServiceCountHeaders = [
    { key: "serviceType", label: "Tranportation Service" },
    { key: "totalCount", label: "Usage Count" },
  ];

  // Transportation Service Type Count Bar Chart & CSV Data Preparation
  const eventTransCompCountdata = (() => {
    // Get unique service types from the data
    const serviceTypes = [
      ...new Set(eventTransCompCount.map((item) => item.serviceType)),
    ];

    // Get unique departments
    const departments = [
      ...new Set(eventTransCompCount.map((item) => item.departmentName)),
    ];

    // Create header row with department name and all service types
    const header = ["Department", ...serviceTypes];

    // Create data rows for each department
    const dataRows = departments
      .map((department) => {
        const row = [department];

        // For each service type, find the count for this department
        serviceTypes.forEach((serviceType) => {
          const found = eventTransCompCount.find(
            (item) =>
              item.departmentName === department &&
              item.serviceType === serviceType
          );
          row.push(found ? found.count : 0);
        });

        return row;
      })
      .filter((row) => {
        // Filter out departments with no counts (all service types are 0)
        return row.slice(1).some((count) => count > 0);
      });

    return [header, ...dataRows];
  })();

  const eventTransCompCountoptions = {
    title: "Most Used Transportation Service by Department",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Usage Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#65a2d5", "#43749b", "#43749b", "#355c7b", "#2a4a5b"], // Added more colors for potential service types
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  // Headers for CSV export
  const TransCompCountHeaders = [
    { key: "departmentName", label: "Department" },
    { key: "serviceType", label: "Service Type" },
    { key: "count", label: "Usage Count" },
  ];

  //Accommodation Per Department Cost Bar Chart & CSV Data Preparation
  const eventAccommCountdata = [
    ["Department", "Number of Requests"],
    ...eventTransperdepartment
      .filter((dept) => dept.count > 0)
      .map((department) => [department.departmentName, department.count]),
  ];
  const eventAccommCountoptions = {
    title: "Departments Requesting Accommodation Service",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Number of Requests",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#43749b", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const AccommCountPerDepartmentHeaders = [
    { key: "departmentName", label: "Department" },
    { key: "count", label: "Number of Requests" },
  ];

  //Transportation Service Count Bar Chart & CSV Data Preparation
  const eventAccommServiceCountdata = [
    ["Component", "Usage Count"],
    ...eventAccommSerivceCountState
      .filter((dept) => dept.totalCount > 0)
      .sort((a, b) => b.totalCount - a.totalCount) // descending sort
      .map((department) => [department.serviceType, department.totalCount]),
  ];
  const eventAccommServiceCountoptions = {
    title: "Most Used Accommodation Services",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Usage Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Accommodation Service",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#43749b", "#65a2d5", "#43749b", "#355c7b"],
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  const AccommServiceCountHeaders = [
    { key: "serviceType", label: "Accommodation Service" },
    { key: "totalCount", label: "Usage Count" },
  ];

  // Accommodation Service Type Count Bar Chart & CSV Data Preparation
  const eventAccommCompCountdata = (() => {
    // Get unique service types from the data
    const serviceTypes = [
      ...new Set(eventAccommCompCount.map((item) => item.serviceType)),
    ];

    // Get unique departments
    const departments = [
      ...new Set(eventAccommCompCount.map((item) => item.departmentName)),
    ];

    // Create header row with department name and all service types
    const header = ["Department", ...serviceTypes];

    // Create data rows for each department
    const dataRows = departments
      .map((department) => {
        const row = [department];

        // For each service type, find the count for this department
        serviceTypes.forEach((serviceType) => {
          const found = eventAccommCompCount.find(
            (item) =>
              item.departmentName === department &&
              item.serviceType === serviceType
          );
          row.push(found ? found.count : 0);
        });

        return row;
      })
      .filter((row) => {
        // Filter out departments with no counts (all service types are 0)
        return row.slice(1).some((count) => count > 0);
      });

    return [header, ...dataRows];
  })();

  const eventAccommCompCountoptions = {
    title: "Most Used Accommodation Service by Department",
    chartArea: { width: "50%" },
    isStacked: true,
    hAxis: {
      title: "Usage Count",
      minValue: 0,
      textStyle: { fontSize: 12 },
      titleTextStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Department",
      textStyle: { fontSize: 12, maxLines: 3 },
      titleTextStyle: { fontSize: 12 },
    },
    colors: ["#79c1fb", "#65a2d5", "#43749b", "#355c7b", "#2a4a5b"], // Added more colors for potential service types
    legend: { position: "top", textStyle: { fontSize: 12 } },
    bar: { groupWidth: "65%" },
  };

  // Headers for CSV export
  const AccommCompCountHeaders = [
    { key: "departmentName", label: "Department Name" },
    { key: "serviceType", label: "Accommodation Service" },
    { key: "totalCount", label: "Usage Count" },
  ];

  //   const TransCompCountHeaders = ["departmentName", "count", "serviceType"];
  // Function to fetch Data from the Backend
  // Event Overivew  Per Department Statistics
  const GetOveriewRequestApprovals = async (
    eventapprovaloverviewStartDate,
    eventapprovaloverviewEndDate,
    eventapprovaloverviewselectedDepType
  ) => {
    try {
      setOverviewloading(true);
      setOverviewerror(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (eventapprovaloverviewStartDate)
        params.append("startDate", eventapprovaloverviewStartDate);
      if (eventapprovaloverviewEndDate)
        params.append("endDate", eventapprovaloverviewEndDate);
      if (eventapprovaloverviewselectedDepType)
        params.append(
          "approvingDepTypeID",
          eventapprovaloverviewselectedDepType
        );

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-approval-summary-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventapprovaloverviewState(response.data.data || []);
    } catch (Overviewerror) {
      console.error("Error fetching transportation statistics:", error);
      setOverviewerror("No data available for the selected criteria.");
    } finally {
      setOverviewloading(false);
    }
  };
  // for Event Budget Per Department Statistics
  const GetBudgetPerDepartment = async (
    BudgetPerDepartmentStartDate,
    BudgetPerDepartmentEndDate,
    budgetperdepartmentselectedDepType
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (BudgetPerDepartmentStartDate)
        params.append("startDate", BudgetPerDepartmentStartDate);
      if (BudgetPerDepartmentEndDate)
        params.append("endDate", BudgetPerDepartmentEndDate);
      if (budgetperdepartmentselectedDepType)
        params.append("approvingDepTypeID", budgetperdepartmentselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-budget-count-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventbudgetperdepartment(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transportation statistics:", error);
      setError("No data available for the selected criteria.");
    } finally {
      setLoading(false);
    }
  };

  // for Event Budget Per Department Cost Statistics
  const GetBudgetPerDepartmentCost = async (
    BudgetPerDepartmentCostStartDate,
    BudgetPerDepartmentCostEndDate,
    budgetperdepartmentcostselectedDepType
  ) => {
    try {
      seteventBudgetCostloading(true);
      seteventBudgetCosterror(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (BudgetPerDepartmentCostStartDate)
        params.append("startDate", BudgetPerDepartmentCostStartDate);
      if (BudgetPerDepartmentCostEndDate)
        params.append("endDate", BudgetPerDepartmentCostEndDate);
      if (budgetperdepartmentcostselectedDepType)
        params.append(
          "approvingDepTypeID",
          budgetperdepartmentcostselectedDepType
        );

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-budget-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventbudgetperdepartmentcost(response.data.data || []);
    } catch (eventBudgetCosterror) {
      console.eventBudgetCosterror(
        "Error fetching transportation statistics:",
        eventBudgetCosterror
      );
      seteventBudgetCosterror("No data available for the selected criteria.");
    } finally {
      seteventBudgetCostloading(false);
    }
  };
  // for Event Marcom Per Department Statistics
  const GetMarcomCountPerDepartment = async (
    MarcomPerDepartmentStartDate,
    MarcomPerDepartmentEndDate,
    marcomperdepartmentselectedDepType
  ) => {
    try {
      seteventMarcomloading(true);
      seteventMarcomError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (MarcomPerDepartmentStartDate)
        params.append("startDate", MarcomPerDepartmentStartDate);
      if (MarcomPerDepartmentEndDate)
        params.append("endDate", MarcomPerDepartmentEndDate);
      if (marcomperdepartmentselectedDepType)
        params.append("approvingDepTypeID", marcomperdepartmentselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-marcom-count-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventmarcomperdepartment(response.data.data || []);
    } catch (eventMarcomError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventMarcomError("No data available for the selected criteria.");
    } finally {
      seteventMarcomloading(false);
    }
  };
  // for Event IT Per Department Statistics
  const GetITCountPerDepartment = async (
    ITPerDepartmentStartDate,
    ITPerDepartmentEndDate,
    ITperdepartmentselectedDepType
  ) => {
    try {
      seteventITloading(true);
      seteventITError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (ITPerDepartmentStartDate)
        params.append("startDate", ITPerDepartmentStartDate);
      if (ITPerDepartmentEndDate)
        params.append("endDate", ITPerDepartmentEndDate);
      if (ITperdepartmentselectedDepType)
        params.append("approvingDepTypeID", ITperdepartmentselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-it-count-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventITperdepartment(response.data.data || []);
    } catch (eventITError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventITError("No data available for the selected criteria.");
    } finally {
      seteventITloading(false);
    }
  };

  const GetITServiceCount = async (
    ITServiceCountStartDate,
    ITServiceCountEndDate
  ) => {
    try {
      seteventITServiceloading(true);
      seteventITServiceError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (ITServiceCountStartDate)
        params.append("startDate", ITServiceCountStartDate);
      if (ITServiceCountEndDate)
        params.append("endDate", ITServiceCountEndDate);
      //   if (ITperdepartmentselectedDepType)
      //     params.append("approvingDepTypeID", ITperdepartmentselectedDepType);

      const url = `${URL.BASE_URL}/api/EventDashboard/it-service-type-totals${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventITServiceCountState(response.data.data || []);
    } catch (eventITServiceError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventITServiceError("No data available for the selected criteria.");
    } finally {
      seteventITServiceloading(false);
    }
  };

  // for Event Most Used IT Component by Department
  const GetITCompCountPerDepartment = async (
    ITCompPerDepartmentStartDate,
    ITCompPerDepartmentEndDate,
    ITCompperdepartmentselectedDepType
  ) => {
    try {
      seteventITComploading(true);
      seteventITCompError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (ITCompPerDepartmentStartDate)
        params.append("startDate", ITCompPerDepartmentStartDate);
      if (ITCompPerDepartmentEndDate)
        params.append("endDate", ITCompPerDepartmentEndDate);
      if (ITCompperdepartmentselectedDepType)
        params.append("approvingDepTypeID", ITCompperdepartmentselectedDepType);

      const url = `${URL.BASE_URL}/api/EventDashboard/department-it-type-count${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventITCompperdepartment(response.data.data || []);
    } catch (eventITCompError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventITCompError("No data available for the selected criteria.");
    } finally {
      seteventITComploading(false);
    }
  };
  // for Event Transportation Per Department Statistics
  const GetTransCountPerDepartment = async (
    TransPerDepartmentStartDate,
    TransPerDepartmentEndDate,
    TransperdepartmentselectedDepType
  ) => {
    try {
      seteventTransloading(true);
      seteventTransError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (TransPerDepartmentStartDate)
        params.append("startDate", TransPerDepartmentStartDate);
      if (TransPerDepartmentEndDate)
        params.append("endDate", TransPerDepartmentEndDate);
      if (TransperdepartmentselectedDepType)
        params.append("approvingDepTypeID", TransperdepartmentselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-transportation-count-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventTransperdepartment(response.data.data || []);
    } catch (eventTransError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventTransError("No data available for the selected criteria.");
    } finally {
      seteventTransloading(false);
    }
  };

  const GetTransServiceCount = async (
    TransServiceCountStartDate,
    TransServiceCountEndDate
  ) => {
    try {
      seteventTransServiceloading(true);
      seteventTransSericeError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (TransServiceCountStartDate)
        params.append("startDate", TransServiceCountStartDate);
      if (TransServiceCountEndDate)
        params.append("endDate", TransServiceCountEndDate);
      //   if (ITperdepartmentselectedDepType)
      //     params.append("approvingDepTypeID", ITperdepartmentselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/transportation-service-type-totals${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventTransSerivceCountState(response.data.data || []);
    } catch (eventTransSericeError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventTransSericeError("No data available for the selected criteria.");
    } finally {
      seteventTransServiceloading(false);
    }
  };

  // for Event Transportation Per Department Statistics
  const GetTransCompCountPerDepartment = async (
    TransCompCountStartDate,
    TransCompCountEndDate,
    TransCompCountselectedDepType
  ) => {
    try {
      seteventTransComploading(true);
      seteventTransCompError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (TransCompCountStartDate)
        params.append("startDate", TransCompCountStartDate);
      if (TransCompCountEndDate)
        params.append("endDate", TransCompCountEndDate);
      if (TransCompCountselectedDepType)
        params.append("approvingDepTypeID", TransCompCountselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/department-transportation-type-count${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventTransCompCount(response.data.data || []);
    } catch (eventTransCompError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventTransCompError("No data available for the selected criteria.");
    } finally {
      seteventTransComploading(false);
    }
  };

  // for Event Accommodation Count Per Department Statistics
  const GetAccommCountPerDepartment = async (
    AccommCountStartDate,
    AccommCountEndDate,
    AccommCountselectedDepType
  ) => {
    try {
      seteventAccommCountloading(true);
      seteventAccommCountError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (AccommCountStartDate)
        params.append("startDate", AccommCountStartDate);
      if (AccommCountEndDate) params.append("endDate", AccommCountEndDate);
      if (AccommCountselectedDepType)
        params.append("approvingDepTypeID", AccommCountselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/get-accommodation-count-for-departments${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventAccommCountData(response.data.data || []);
    } catch (eventAccommCountError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventAccommCountError("No data available for the selected criteria.");
    } finally {
      seteventAccommCountloading(false);
    }
  };

  // for Event Accommodation Count Per Department Statistics
  const GetAccommServiceCounts = async (
    AccommServiceCountStartDate,
    AccommServiceCountEndDate
  ) => {
    try {
      seteventAccommServiceloading(true);
      seteventAccommServiceError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (AccommServiceCountStartDate)
        params.append("startDate", AccommServiceCountStartDate);
      if (AccommServiceCountEndDate)
        params.append("endDate", AccommServiceCountEndDate);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/accommodation-service-type-totals${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventAccommSerivceCountState(response.data.data || []);
    } catch (eventAccommServiceError) {
      console.log(
        "Error fetching transportation statistics:",
        eventAccommServiceError
      );

      seteventAccommServiceError(
        "No data available for the selected criteria."
      );
    } finally {
      seteventAccommServiceloading(false);
    }
  };

  // for Event Transportation Per Department Statistics
  const GetAccommCompCountPerDepartment = async (
    AccommCountCompStartDate,
    AccommCompCountEndDate,
    AccommCountCompselectedDepType
  ) => {
    try {
      seteventAccommCompCountloading(true);
      seteventAccommCountCompError(null);

      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (AccommCountCompStartDate)
        params.append("startDate", AccommCountCompStartDate);
      if (AccommCompCountEndDate)
        params.append("endDate", AccommCompCountEndDate);
      if (AccommCountCompselectedDepType)
        params.append("approvingDepTypeID", AccommCountCompselectedDepType);

      const url = `${
        URL.BASE_URL
      }/api/EventDashboard/department-accommodation-type-count${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      seteventAccommCompCount(response.data.data || []);
    } catch (eventAccommCountCompError) {
      //   console.eventMarcomError(
      //     "Error fetching transportation statistics:",
      //     eventMarcomError
      //   );
      seteventAccommCountCompError(
        "No data available for the selected criteria."
      );
    } finally {
      seteventAccommCompCountloading(false);
    }
  };
  const getallDepartmentTypes = async () => {
    try {
      const response = await axios.get(
        `https://hcms.bue.edu.eg/TravelBE/api/BusinessRequest/get-all-department-types`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      console.log("Department types response:", response.data);
      setdepTypes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching department types:", error);
      // Don't set error state for this as it's not critical for the main functionality
    }
  };

  useEffect(() => {
    GetOveriewRequestApprovals(
      eventapprovaloverviewStartDate,
      eventapprovaloverviewEndDate,
      eventapprovaloverviewselectedDepType
    );
  }, [
    eventapprovaloverviewStartDate,
    eventapprovaloverviewEndDate,
    eventapprovaloverviewselectedDepType,
  ]); // Empty dependency array to run only once on mount
  useEffect(() => {
    GetBudgetPerDepartment(
      BudgetPerDepartmentStartDate,
      BudgetPerDepartmentEndDate,
      budgetperdepartmentselectedDepType
    );
  }, [
    BudgetPerDepartmentStartDate,
    BudgetPerDepartmentEndDate,
    budgetperdepartmentselectedDepType,
  ]);
  useEffect(() => {
    GetBudgetPerDepartmentCost(
      BudgetPerDepartmentCostStartDate,
      BudgetPerDepartmentCostEndDate,
      budgetperdepartmentcostselectedDepType
    );
  }, [
    BudgetPerDepartmentCostStartDate,
    BudgetPerDepartmentCostEndDate,
    budgetperdepartmentcostselectedDepType,
  ]);
  useEffect(() => {
    GetMarcomCountPerDepartment(
      MarcomPerDepartmentStartDate,
      MarcomPerDepartmentEndDate,
      marcomperdepartmentselectedDepType
    );
  }, [
    MarcomPerDepartmentStartDate,
    MarcomPerDepartmentEndDate,
    marcomperdepartmentselectedDepType,
  ]);
  useEffect(() => {
    GetITCountPerDepartment(
      ITPerDepartmentStartDate,
      ITPerDepartmentEndDate,
      ITperdepartmentselectedDepType
    );
  }, [
    ITPerDepartmentStartDate,
    ITPerDepartmentEndDate,
    ITperdepartmentselectedDepType,
  ]);
  useEffect(() => {
    GetITServiceCount(ITServiceCountStartDate, ITServiceCountEndDate);
  }, [ITServiceCountStartDate, ITServiceCountEndDate]);
  useEffect(() => {
    GetITCompCountPerDepartment(
      ITCompPerDepartmentStartDate,
      ITCompPerDepartmentEndDate,
      ITCompperdepartmentselectedDepType
    );
  }, [
    ITCompPerDepartmentStartDate,
    ITCompPerDepartmentEndDate,
    ITCompperdepartmentselectedDepType,
  ]);
  useEffect(() => {
    GetTransCountPerDepartment(
      TransPerDepartmentStartDate,
      TransPerDepartmentEndDate,
      TransperdepartmentselectedDepType
    );
  }, [
    TransPerDepartmentStartDate,
    TransPerDepartmentEndDate,
    TransperdepartmentselectedDepType,
  ]);
  useEffect(() => {
    GetTransServiceCount(TransServiceCountStartDate, TransServiceCountEndDate);
  }, [TransServiceCountStartDate, TransServiceCountEndDate]);
  useEffect(() => {
    GetTransCompCountPerDepartment(
      TransCompCountStartDate,
      TransCompCountEndDate,
      TransCompCountselectedDepType
    );
  }, [
    TransCompCountStartDate,
    TransCompCountEndDate,
    TransCompCountselectedDepType,
  ]);
  useEffect(() => {
    GetAccommCountPerDepartment(
      AccommCountStartDate,
      AccommCountEndDate,
      AccommCountselectedDepType
    );
  }, [AccommCountStartDate, AccommCountEndDate, AccommCountselectedDepType]);
  useEffect(() => {
    GetAccommCompCountPerDepartment(
      AccommCountCompStartDate,
      AccommCompCountEndDate,
      AccommCountCompselectedDepType
    );
  }, [
    AccommCountCompStartDate,
    AccommCompCountEndDate,
    AccommCountCompselectedDepType,
  ]);
  useEffect(() => {
    GetAccommServiceCounts(
      AccommServiceCountStartDate,
      AccommServiceCountEndDate
    );
  }, [AccommServiceCountStartDate, AccommServiceCountEndDate]);
  useEffect(() => {
    getallDepartmentTypes();
  }, []);

  // // Show loading only when there's no data yet and it's the initial load
  // const isOverviewInitialLoad =
  //   Overviewloading &&
  //   eventapprovaloverviewState.length === 0 &&
  //   !Overviewerror;

  // if (isOverviewInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isInitialLoad =
  //   loading && eventbudgetperdepartment.length === 0 && !error;

  // if (isInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isBudgetCostInitialLoad =
  //   eventBudgetCostloading &&
  //   eventbudgetperdepartmentCostdata.length === 0 &&
  //   !eventBudgetCosterror;

  // if (isBudgetCostInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isMarcomInitialLoad =
  //   eventMarcomloading &&
  //   eventmarcomperdepartment.length === 0 &&
  //   !eventMarcomError;

  // if (isMarcomInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isITInitialLoad =
  //   eventITloading && eventITperdepartment.length === 0 && !eventITError;

  // if (isITInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isITServiceCountInitialLoad =
  //   eventITServiceloading &&
  //   eventITServiceCountState.length === 0 &&
  //   !eventITServiceError;

  // if (isITServiceCountInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isITCompInitialLoad =
  //   eventITComploading &&
  //   eventITCompperdepartment.length === 0 &&
  //   !eventITCompError;

  // if (isITCompInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isTransInitialLoad =
  //   eventTransloading &&
  //   eventTransperdepartment.length === 0 &&
  //   !eventTransError;

  // if (isTransInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isTransServiceCountInitialLoad =
  //   eventTransServiceloading &&
  //   eventTransSerivceCountState.length === 0 &&
  //   !eventTransSericeError;

  // if (isTransServiceCountInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isTransCompCountInitialLoad =
  //   eventTransComploading &&
  //   eventTransCompCount.length === 0 &&
  //   !eventTransCompError;

  // if (isTransCompCountInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isAccommCountInitialLoad =
  //   eventAccommCountloading &&
  //   eventAccommCountData.length === 0 &&
  //   !eventAccommCountError;

  // if (isAccommCountInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isAccommServiceCountInitialLoad =
  //   eventAccommServiceloading &&
  //   eventAccommSerivceCountState.length === 0 &&
  //   !eventAccommServiceError;

  // if (isAccommServiceCountInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  // const isAccommCompCountInitialLoad =
  //   eventAccommCompCountloading &&
  //   eventAccommCompCount.length === 0 &&
  //   !eventAccommCountCompError;

  // if (isAccommCompCountInitialLoad) {
  //   return (
  //     <Spin
  //       size="large"
  //       style={{ display: "block", margin: "50px auto", fontSize: "24px" }}
  //     />
  //   );
  // }

  return (
    <>
      {/* Business request Transfer Statistics */}
      <div>
        <div>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              marginBottom: "30px",
              padding: "20px 0",
            }}
          >
            <hr
              style={{
                border: "none",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, #0058af, transparent)",
                margin: "0",
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                padding: "12px 30px",
                borderRadius: "25px",
                boxShadow: "0 4px 12px lightgrey",
                border: "2px solid #0058af",
                position: "relative",
                zIndex: 1,
              }}
            >
              <h5
                style={{
                  margin: "0",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#2c3e50",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Statistics
              </h5>
            </div>
          </div>
        </div>

        <div
          className="chart"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Filters Section - Always visible */}
          <div className="row mb-4">
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div>
                <div className="form-group">
                  <label
                    htmlFor="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      color: "#495057",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Department Type
                  </label>
                  <select
                    id="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      height: "2.5rem",
                    }}
                    className="form-select form-select-lg custom-select"
                    value={eventapprovaloverviewselectedDepType}
                    onChange={(e) =>
                      seteventapprovaloverviewselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                    onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    //disabled={Overviewloading}
                  >
                    <option value="">All Department Types</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div className="form-group">
                <label
                  htmlFor="eventapprovaloverviewStartDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="eventapprovaloverviewStartDate"
                  value={eventapprovaloverviewStartDate || ""}
                  onChange={(e) =>
                    seteventapprovaloverviewStartDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={Overviewloading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="eventapprovaloverviewEndDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="eventapprovaloverviewEndDate"
                  value={eventapprovaloverviewEndDate || ""}
                  onChange={(e) =>
                    seteventapprovaloverviewEndDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={Overviewloading}
                />
              </div>
            </div>
          </div>

          {/* Loading indicator for filter changes */}
          {/* {Overviewloading && (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <Spin size="small" /> Loading...
    </div>
  )} */}

          {/* Error Message */}
          {Overviewerror && (
            <div
              className="alert alert-danger alert-dismissible"
              style={{
                fontSize: "0.7rem",
                padding: "15px 20px",
                margin: "20px 0",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
                backgroundColor: "#f8d7da",
                borderLeft: "4px solid #dc3545",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fas fa-exclamation-triangle mr-3"
                  style={{ color: "#dc3545", fontSize: "0.7rem" }}
                ></i>
                <span style={{ color: "#721c24", fontWeight: "500" }}>
                  {Overviewerror}
                </span>
              </div>
              <button
                type="button"
                className="close"
                onClick={() => setOverviewerror(null)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "0.7rem",
                  color: "#721c24",
                  cursor: "pointer",
                }}
              >
                <span>&times;</span>
              </button>
            </div>
          )}

          {/* Chart and Download Section */}
          {!Overviewerror && eventapprovaloverviewState.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e9ecef",
              }}
            >
              {/* <div
                style={{
                  marginBottom: "20px",
                  paddingBottom: "15px",
                  borderBottom: "2px solid #e9ecef",
                }}
              >
                <h5
                  style={{
                    color: "#495057",
                    fontWeight: "600",
                    margin: "0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="fas fa-chart-bar mr-2"
                    style={{ color: "#007bff" }}
                  ></i>
                  Request Approval Summary
                </h5>
              </div> */}

              <div style={{ marginBottom: "20px" }}>
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="500px"
                  data={eventapprovaloverviewdata}
                  options={eventapprovaloverviewoptions}
                  legendToggle
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <JSONToCSVDownloader
                  data={eventapprovaloverviewState}
                  headers={eventapprovaloverviewheaders}
                  filename="request_approval_summary_report.csv"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#218838";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download CSV Report
                </JSONToCSVDownloader>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!Overviewerror &&
            !Overviewloading &&
            eventapprovaloverviewState.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "2px dashed #dee2e6",
                  margin: "20px 0",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <i
                    className="fas fa-chart-line"
                    style={{
                      fontSize: "25px",
                      color: "#6c757d",
                      // marginBottom: "15px",
                    }}
                  ></i>
                </div>
                <h6
                  style={{
                    color: "#6c757d",
                    fontWeight: "500",
                    marginBottom: "10px",
                  }}
                >
                  No Data Available
                </h6>
                <p
                  style={{
                    color: "#868e96",
                    margin: "0",
                    fontSize: "0.7rem",
                  }}
                >
                  No data available for the selected criteria. Try adjusting
                  your filters.
                </p>
              </div>
            )}
        </div>

        <div>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              marginBottom: "30px",
              padding: "20px 0",
            }}
          >
            <hr
              style={{
                border: "none",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, #0058af, transparent)",
                margin: "0",
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                padding: "12px 30px",
                borderRadius: "25px",
                boxShadow: "0 4px 12px lightgrey",
                border: "2px solid #0058af",
                position: "relative",
                zIndex: 1,
              }}
            >
              <h5
                style={{
                  margin: "0",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#2c3e50",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Budget Service
              </h5>
            </div>
          </div>
        </div>
        <div
          className="chart"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Filters Section - Always visible */}
          <div className="row mb-4">
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div>
                <div className="form-group">
                  <label
                    htmlFor="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      color: "#495057",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Department Type
                  </label>
                  <select
                    id="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      height: "2.5rem",
                    }}
                    className="form-select form-select-lg custom-select"
                    value={budgetperdepartmentselectedDepType}
                    onChange={(e) =>
                      setbudgetperdepartmentselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                    onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    //disabled={loading}
                  >
                    <option value="">All Department Types</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div className="form-group">
                <label
                  htmlFor="BudgetPerDepartmentStartDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="BudgetPerDepartmentStartDate"
                  value={BudgetPerDepartmentStartDate || ""}
                  onChange={(e) =>
                    setBudgetPerDepartmentStartDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={loading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="BudgetPerDepartmentEndDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="BudgetPerDepartmentEndDate"
                  value={BudgetPerDepartmentEndDate || ""}
                  onChange={(e) =>
                    setBudgetPerDepartmentEndDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="alert alert-danger alert-dismissible"
              style={{
                fontSize: "0.7rem",
                padding: "15px 20px",
                margin: "20px 0",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
                backgroundColor: "#f8d7da",
                borderLeft: "4px solid #dc3545",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fas fa-exclamation-triangle mr-3"
                  style={{ color: "#dc3545", fontSize: "0.7rem" }}
                ></i>
                <span style={{ color: "#721c24", fontWeight: "500" }}>
                  {error}
                </span>
              </div>
              <button
                type="button"
                className="close"
                onClick={() => setError(null)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "0.7rem",
                  color: "#721c24",
                  cursor: "pointer",
                }}
              >
                <span>&times;</span>
              </button>
            </div>
          )}

          {/* Chart and Download Section */}
          {!error && eventbudgetperdepartment.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="500px"
                  data={eventbudgetperdepartmentdata}
                  options={eventbudgetperdepartmentoptions}
                  legendToggle
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <JSONToCSVDownloader
                  data={eventbudgetperdepartment}
                  headers={BudgetPerDepartmentHeaders}
                  filename="event_request_budget_per_department_report.csv"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#218838";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download CSV Report
                </JSONToCSVDownloader>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!error && !loading && eventbudgetperdepartment.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "2px dashed #dee2e6",
                margin: "20px 0",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <i
                  className="fas fa-chart-line"
                  style={{
                    fontSize: "0.7rem",
                    color: "#6c757d",
                    marginBottom: "15px",
                  }}
                ></i>
              </div>
              <h6
                style={{
                  color: "#6c757d",
                  fontWeight: "500",
                  marginBottom: "10px",
                }}
              >
                No Data Available
              </h6>
              <p
                style={{
                  color: "#868e96",
                  margin: "0",
                  fontSize: "0.7rem",
                }}
              >
                No data available for the selected criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}
        </div>

        <br />

        <div
          className="chart"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Filters Section - Always visible */}
          <div className="row mb-4">
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div>
                <div className="form-group">
                  <label
                    htmlFor="departmentType2"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      color: "#495057",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Department Type
                  </label>
                  <select
                    id="departmentType2"
                    style={{
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      height: "2.5rem",
                    }}
                    className="form-select form-select-lg custom-select"
                    value={budgetperdepartmentcostselectedDepType}
                    onChange={(e) =>
                      setbudgetperdepartmentcostselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                    onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    //disabled={eventBudgetCostloading}
                  >
                    <option value="">All Department Types</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div className="form-group">
                <label
                  htmlFor="BudgetPerDepartmentCostStartDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="BudgetPerDepartmentCostStartDate"
                  value={BudgetPerDepartmentCostStartDate || ""}
                  onChange={(e) =>
                    setBudgetPerDepartmentCostStartDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventBudgetCostloading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="BudgetPerDepartmentCostEndDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="BudgetPerDepartmentCostEndDate"
                  value={BudgetPerDepartmentCostEndDate || ""}
                  onChange={(e) =>
                    setBudgetPerDepartmenCostEndDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventBudgetCostloading}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {eventBudgetCosterror && (
            <div
              className="alert alert-danger alert-dismissible"
              style={{
                fontSize: "0.7rem",
                padding: "15px 20px",
                margin: "20px 0",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
                backgroundColor: "#f8d7da",
                borderLeft: "4px solid #dc3545",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fas fa-exclamation-triangle mr-3"
                  style={{ color: "#dc3545", fontSize: "0.7rem" }}
                ></i>
                <span style={{ color: "#721c24", fontWeight: "500" }}>
                  {eventBudgetCosterror}
                </span>
              </div>
              <button
                type="button"
                className="close"
                onClick={() => seteventBudgetCosterror(null)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "0.7rem",
                  color: "#721c24",
                  cursor: "pointer",
                }}
              >
                <span>&times;</span>
              </button>
            </div>
          )}

          {/* Chart and Download Section */}
          {!eventBudgetCosterror && eventbudgetperdepartmentcost.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="500px"
                  data={eventbudgetperdepartmentCostdata}
                  options={eventbudgetperdepartmentcostoptions}
                  legendToggle
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <JSONToCSVDownloader
                  data={eventbudgetperdepartmentcost}
                  headers={BudgetPerDepartmentCostHeaders}
                  filename="event_request_cost_budget_per_department_report.csv"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#218838";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download CSV Report
                </JSONToCSVDownloader>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!eventBudgetCosterror &&
            !eventBudgetCostloading &&
            eventbudgetperdepartmentcost.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "2px dashed #dee2e6",
                  margin: "20px 0",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <i
                    className="fas fa-chart-line"
                    style={{
                      fontSize: "25px",
                      color: "#6c757d",
                      // marginBottom: "15px",
                    }}
                  ></i>
                </div>
                <h6
                  style={{
                    color: "#6c757d",
                    fontWeight: "500",
                    marginBottom: "10px",
                  }}
                >
                  No Data Available
                </h6>
                <p
                  style={{
                    color: "#868e96",
                    margin: "0",
                    fontSize: "0.7rem",
                  }}
                >
                  No data available for the selected criteria. Try adjusting
                  your filters.
                </p>
              </div>
            )}
        </div>

        <div>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              marginBottom: "30px",
              padding: "20px 0",
            }}
          >
            <hr
              style={{
                border: "none",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, #0058af, transparent)",
                margin: "0",
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                padding: "12px 30px",
                borderRadius: "25px",
                boxShadow: "0 4px 12px lightgrey",
                border: "2px solid #0058af",
                position: "relative",
                zIndex: 1,
              }}
            >
              <h5
                style={{
                  margin: "0",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#2c3e50",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Marcom Service
              </h5>
            </div>
          </div>
        </div>
        <div
          className="chart"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Filters Section - Always visible */}
          <div className="row mb-4">
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div>
                <div className="form-group">
                  <label
                    htmlFor="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      color: "#495057",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Department Type
                  </label>
                  <select
                    id="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      height: "auto",
                      height: "2.5rem",
                    }}
                    className="form-select form-select-lg custom-select"
                    value={marcomperdepartmentselectedDepType}
                    onChange={(e) =>
                      setmarcomperdepartmentselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                    onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    //disabled={eventMarcomloading}
                  >
                    <option value="">All Department Types</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div className="form-group">
                <label
                  htmlFor="MarcomPerDepartmentStartDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="MarcomPerDepartmentStartDate"
                  value={MarcomPerDepartmentStartDate || ""}
                  onChange={(e) =>
                    setMarcomPerDepartmentStartDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventMarcomloading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="MarcomPerDepartmentEndDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="MarcomPerDepartmentEndDate"
                  value={MarcomPerDepartmentEndDate || ""}
                  onChange={(e) =>
                    setMarcomPerDepartmentEndDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventMarcomloading}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {eventMarcomError && (
            <div
              className="alert alert-danger alert-dismissible"
              style={{
                fontSize: "0.7rem",
                padding: "15px 20px",
                margin: "20px 0",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
                backgroundColor: "#f8d7da",
                borderLeft: "4px solid #dc3545",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fas fa-exclamation-triangle mr-3"
                  style={{ color: "#dc3545", fontSize: "0.7rem" }}
                ></i>
                <span style={{ color: "#721c24", fontWeight: "500" }}>
                  {eventMarcomError}
                </span>
              </div>
              <button
                type="button"
                className="close"
                onClick={() => seteventMarcomError(null)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "0.7rem",
                  color: "#721c24",
                  cursor: "pointer",
                }}
              >
                <span>&times;</span>
              </button>
            </div>
          )}

          {/* Chart and Download Section */}
          {!eventMarcomError && eventmarcomperdepartment.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="500px"
                  data={eventmarcomperdepartmentdata}
                  options={eventmarcomperdepartmentoptions}
                  legendToggle
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <JSONToCSVDownloader
                  data={eventmarcomperdepartment}
                  headers={MarcomPerDepartmentHeaders}
                  filename="event_request_marcom_per_department_report.csv"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#218838";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download CSV Report
                </JSONToCSVDownloader>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!eventMarcomError &&
            !eventMarcomloading &&
            eventmarcomperdepartment.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "2px dashed #dee2e6",
                  margin: "20px 0",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <i
                    className="fas fa-chart-line"
                    style={{
                      fontSize: "25px",
                      color: "#6c757d",
                      // marginBottom: "15px",
                    }}
                  ></i>
                </div>
                <h6
                  style={{
                    color: "#6c757d",
                    fontWeight: "500",
                    marginBottom: "10px",
                  }}
                >
                  No Data Available
                </h6>
                <p
                  style={{
                    color: "#868e96",
                    margin: "0",
                    fontSize: "0.7rem",
                  }}
                >
                  No data available for the selected criteria. Try adjusting
                  your filters.
                </p>
              </div>
            )}
        </div>

        <br />
        <div>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              marginBottom: "30px",
              padding: "20px 0",
            }}
          >
            <hr
              style={{
                border: "none",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, #0058af, transparent)",
                margin: "0",
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                padding: "12px 30px",
                borderRadius: "25px",
                boxShadow: "0 4px 12px lightgrey",
                border: "2px solid #0058af",
                position: "relative",
                zIndex: 1,
              }}
            >
              <h5
                style={{
                  margin: "0",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#2c3e50",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                IT Service
              </h5>
            </div>
          </div>
        </div>
        <div
          className="chart"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Filters Section - Always visible */}
          <div className="row mb-4">
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div>
                <div className="form-group">
                  <label
                    htmlFor="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      color: "#495057",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Department Type
                  </label>
                  <select
                    id="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      height: "2.5rem",
                    }}
                    className="form-select form-select-lg custom-select"
                    value={ITperdepartmentselectedDepType}
                    onChange={(e) =>
                      setITperdepartmentselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                    onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    //disabled={eventITloading}
                  >
                    <option value="">All Department Types</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div className="form-group">
                <label
                  htmlFor="ITPerDepartmentStartDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="ITPerDepartmentStartDate"
                  value={ITPerDepartmentStartDate || ""}
                  onChange={(e) =>
                    setITPerDepartmentStartDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventITloading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="ITPerDepartmentEndDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="ITPerDepartmentEndDate"
                  value={ITPerDepartmentEndDate || ""}
                  onChange={(e) =>
                    setITPerDepartmentEndDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventITloading}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {eventITError && (
            <div
              className="alert alert-danger alert-dismissible"
              style={{
                fontSize: "0.7rem",
                padding: "15px 20px",
                margin: "20px 0",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
                backgroundColor: "#f8d7da",
                borderLeft: "4px solid #dc3545",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fas fa-exclamation-triangle mr-3"
                  style={{ color: "#dc3545", fontSize: "0.7rem" }}
                ></i>
                <span style={{ color: "#721c24", fontWeight: "500" }}>
                  {eventITError}
                </span>
              </div>
              <button
                type="button"
                className="close"
                onClick={() => seteventITError(null)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "0.7rem",
                  color: "#721c24",
                  cursor: "pointer",
                }}
              >
                <span>&times;</span>
              </button>
            </div>
          )}

          {/* Chart and Download Section */}
          {!eventITError && eventITperdepartment.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="500px"
                  data={eventITperdepartmentdata}
                  options={eventITperdepartmentoptions}
                  legendToggle
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <JSONToCSVDownloader
                  data={eventITperdepartment}
                  headers={ITPerDepartmentHeaders}
                  filename="event_request_IT_per_department_report.csv"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#218838";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download CSV Report
                </JSONToCSVDownloader>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!eventITError &&
            !eventITloading &&
            eventITperdepartment.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "2px dashed #dee2e6",
                  margin: "20px 0",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <i
                    className="fas fa-chart-line"
                    style={{
                      fontSize: "25px",
                      color: "#6c757d",
                      // marginBottom: "15px",
                    }}
                  ></i>
                </div>
                <h6
                  style={{
                    color: "#6c757d",
                    fontWeight: "500",
                    marginBottom: "10px",
                  }}
                >
                  No Data Available
                </h6>
                <p
                  style={{
                    color: "#868e96",
                    margin: "0",
                    fontSize: "0.7rem",
                  }}
                >
                  No data available for the selected criteria. Try adjusting
                  your filters.
                </p>
              </div>
            )}
        </div>

        <br />
        <div
          className="chart"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Filters Section - Always visible */}
          <div className="row mb-4">
            <div className="col-md-6 col-sm-6 mb-3 mb-sm-0">
              <div className="form-group">
                <label
                  htmlFor="ITServiceCountStartDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                  }}
                  className="form-control"
                  id="ITServiceCountStartDate"
                  value={ITServiceCountStartDate || ""}
                  onChange={(e) =>
                    setITServiceCountStartDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventITServiceloading}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="form-group">
                <label
                  htmlFor="ITServiceCountEndDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                  }}
                  className="form-control"
                  id="ITServiceCountEndDate"
                  value={ITServiceCountEndDate || ""}
                  onChange={(e) =>
                    setITServiceCountEndDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventITServiceloading}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {eventITServiceError && (
            <div
              className="alert alert-danger alert-dismissible"
              style={{
                fontSize: "0.7rem",
                padding: "15px 20px",
                margin: "20px 0",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
                backgroundColor: "#f8d7da",
                borderLeft: "4px solid #dc3545",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fas fa-exclamation-triangle mr-3"
                  style={{ color: "#dc3545", fontSize: "0.7rem" }}
                ></i>
                <span style={{ color: "#721c24", fontWeight: "500" }}>
                  {eventITServiceError}
                </span>
              </div>
              <button
                type="button"
                className="close"
                onClick={() => seteventITServiceError(null)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "0.7rem",
                  color: "#721c24",
                  cursor: "pointer",
                }}
              >
                <span>&times;</span>
              </button>
            </div>
          )}

          {/* Chart and Download Section */}
          {!eventITServiceError && eventITServiceCountState.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="500px"
                  data={eventITServiceCountdata}
                  options={eventITServiceCountoptions}
                  legendToggle
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <JSONToCSVDownloader
                  data={eventITServiceCountState}
                  headers={ITServiceCountHeaders}
                  filename="event_request_IT_Service_count_report.csv"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#218838";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download CSV Report
                </JSONToCSVDownloader>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!eventITServiceError &&
            !eventITServiceloading &&
            eventITServiceCountState.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "2px dashed #dee2e6",
                  margin: "20px 0",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <i
                    className="fas fa-chart-line"
                    style={{
                      fontSize: "25px",
                      color: "#6c757d",
                      // marginBottom: "15px",
                    }}
                  ></i>
                </div>
                <h6
                  style={{
                    color: "#6c757d",
                    fontWeight: "500",
                    marginBottom: "10px",
                  }}
                >
                  No Data Available
                </h6>
                <p
                  style={{
                    color: "#868e96",
                    margin: "0",
                    fontSize: "0.7rem",
                  }}
                >
                  No data available for the selected criteria. Try adjusting
                  your filters.
                </p>
              </div>
            )}
        </div>

        <br />
        <div
          className="chart"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Filters Section - Always visible */}
          <div className="row mb-4">
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div>
                <div className="form-group">
                  <label
                    htmlFor="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      color: "#495057",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Department Type
                  </label>
                  <select
                    id="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      height: "2.5rem",
                    }}
                    className="form-select form-select-lg custom-select"
                    value={ITCompperdepartmentselectedDepType}
                    onChange={(e) =>
                      setITCompperdepartmentselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                    onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    //disabled={eventITComploading}
                  >
                    <option value="">All Department Types</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div className="form-group">
                <label
                  htmlFor="ITCompPerDepartmentStartDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="ITCompPerDepartmentStartDate"
                  value={ITCompPerDepartmentStartDate || ""}
                  onChange={(e) =>
                    setITCompPerDepartmentStartDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventITComploading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="ITCompPerDepartmentEndDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="ITCompPerDepartmentEndDate"
                  value={ITCompPerDepartmentEndDate || ""}
                  onChange={(e) =>
                    setITCompPerDepartmentEndDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventITComploading}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {eventITCompError && (
            <div
              className="alert alert-danger alert-dismissible"
              style={{
                fontSize: "0.7rem",
                padding: "15px 20px",
                margin: "20px 0",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
                backgroundColor: "#f8d7da",
                borderLeft: "4px solid #dc3545",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fas fa-exclamation-triangle mr-3"
                  style={{ color: "#dc3545", fontSize: "0.7rem" }}
                ></i>
                <span style={{ color: "#721c24", fontWeight: "500" }}>
                  {eventITCompError}
                </span>
              </div>
              <button
                type="button"
                className="close"
                onClick={() => seteventITCompError(null)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "0.7rem",
                  color: "#721c24",
                  cursor: "pointer",
                }}
              >
                <span>&times;</span>
              </button>
            </div>
          )}

          {/* Chart and Download Section */}
          {!eventITCompError && eventITCompperdepartment.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="500px"
                  data={eventITCompCountdata}
                  options={eventITCompCountoptions}
                  legendToggle
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <JSONToCSVDownloader
                  data={eventITCompperdepartment}
                  headers={ITCompCountHeaders}
                  filename="event_request_IT_Component_per_department_report.csv"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#218838";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download CSV Report
                </JSONToCSVDownloader>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!eventITCompError &&
            !eventITComploading &&
            eventITCompperdepartment.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "2px dashed #dee2e6",
                  margin: "20px 0",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <i
                    className="fas fa-chart-line"
                    style={{
                      fontSize: "25px",
                      color: "#6c757d",
                      // marginBottom: "15px",
                    }}
                  ></i>
                </div>
                <h6
                  style={{
                    color: "#6c757d",
                    fontWeight: "500",
                    marginBottom: "10px",
                  }}
                >
                  No Data Available
                </h6>
                <p
                  style={{
                    color: "#868e96",
                    margin: "0",
                    fontSize: "0.7rem",
                  }}
                >
                  No data available for the selected criteria. Try adjusting
                  your filters.
                </p>
              </div>
            )}
        </div>

        <div>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              marginBottom: "30px",
              padding: "20px 0",
            }}
          >
            <hr
              style={{
                border: "none",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, #0058af, transparent)",
                margin: "0",
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                padding: "12px 30px",
                borderRadius: "25px",
                boxShadow: "0 4px 12px lightgrey",
                border: "2px solid #0058af",
                position: "relative",
                zIndex: 1,
              }}
            >
              <h5
                style={{
                  margin: "0",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#2c3e50",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Transportation Service
              </h5>
            </div>
          </div>
        </div>
        <div
          className="chart"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Filters Section - Always visible */}
          <div className="row mb-4">
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div>
                <div className="form-group">
                  <label
                    htmlFor="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      color: "#495057",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Department Type
                  </label>
                  <select
                    id="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      height: "2.5rem",
                    }}
                    className="form-select form-select-lg custom-select"
                    value={TransperdepartmentselectedDepType}
                    onChange={(e) =>
                      setTransperdepartmentselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                    onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    //disabled={eventTransloading}
                  >
                    <option value="">All Department Types</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div className="form-group">
                <label
                  htmlFor="TransPerDepartmentStartDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="TransPerDepartmentStartDate"
                  value={TransPerDepartmentStartDate || ""}
                  onChange={(e) =>
                    setTransPerDepartmentStartDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventTransloading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="TransPerDepartmentEndDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="TransPerDepartmentEndDate"
                  value={TransPerDepartmentEndDate || ""}
                  onChange={(e) =>
                    setTransPerDepartmentEndDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventTransloading}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {eventTransError && (
            <div
              className="alert alert-danger alert-dismissible"
              style={{
                fontSize: "0.7rem",
                padding: "15px 20px",
                margin: "20px 0",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
                backgroundColor: "#f8d7da",
                borderLeft: "4px solid #dc3545",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fas fa-exclamation-triangle mr-3"
                  style={{ color: "#dc3545", fontSize: "0.7rem" }}
                ></i>
                <span style={{ color: "#721c24", fontWeight: "500" }}>
                  {eventTransError}
                </span>
              </div>
              <button
                type="button"
                className="close"
                onClick={() => seteventTransError(null)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "0.7rem",
                  color: "#721c24",
                  cursor: "pointer",
                }}
              >
                <span>&times;</span>
              </button>
            </div>
          )}

          {/* Chart and Download Section */}
          {!eventTransError && eventTransperdepartment.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="500px"
                  data={eventTransperdepartmentdata}
                  options={eventTransperdepartmentoptions}
                  legendToggle
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <JSONToCSVDownloader
                  data={eventTransperdepartment}
                  headers={TransPerDepartmentHeaders}
                  filename="event_request_Transportation_per_department_report.csv"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#218838";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download CSV Report
                </JSONToCSVDownloader>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!eventTransError &&
            !eventTransloading &&
            eventTransperdepartment.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "2px dashed #dee2e6",
                  margin: "20px 0",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <i
                    className="fas fa-chart-line"
                    style={{
                      fontSize: "25px",
                      color: "#6c757d",
                      // marginBottom: "15px",
                    }}
                  ></i>
                </div>
                <h6
                  style={{
                    color: "#6c757d",
                    fontWeight: "500",
                    marginBottom: "10px",
                  }}
                >
                  No Data Available
                </h6>
                <p
                  style={{
                    color: "#868e96",
                    margin: "0",
                    fontSize: "0.7rem",
                  }}
                >
                  No data available for the selected criteria. Try adjusting
                  your filters.
                </p>
              </div>
            )}
        </div>

        <div
          className="chart"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Filters Section - Always visible */}
          <div className="row mb-4">
            <div className="col-md-6 col-sm-6 mb-3 mb-sm-0">
              <div className="form-group">
                <label
                  htmlFor="TransServiceCountStartDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="TransServiceCountStartDate"
                  value={TransServiceCountStartDate || ""}
                  onChange={(e) =>
                    setTransServiceCountStartDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventTransServiceloading}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="form-group">
                <label
                  htmlFor="TransServiceCountEndDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="TransServiceCountEndDate"
                  value={TransServiceCountEndDate || ""}
                  onChange={(e) =>
                    setTransServiceCountEndDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventTransServiceloading}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {eventTransSericeError && (
            <div
              className="alert alert-danger alert-dismissible"
              style={{
                fontSize: "0.7rem",
                padding: "15px 20px",
                margin: "20px 0",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
                backgroundColor: "#f8d7da",
                borderLeft: "4px solid #dc3545",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fas fa-exclamation-triangle mr-3"
                  style={{ color: "#dc3545", fontSize: "0.7rem" }}
                ></i>
                <span style={{ color: "#721c24", fontWeight: "500" }}>
                  {eventTransSericeError}
                </span>
              </div>
              <button
                type="button"
                className="close"
                onClick={() => seteventTransSericeError(null)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "0.7rem",
                  color: "#721c24",
                  cursor: "pointer",
                }}
              >
                <span>&times;</span>
              </button>
            </div>
          )}

          {/* Chart and Download Section */}
          {!eventTransSericeError && eventTransSerivceCountState.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="500px"
                  data={eventTransServiceCountdata}
                  options={eventTransServiceCountoptions}
                  legendToggle
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <JSONToCSVDownloader
                  data={eventTransSerivceCountState}
                  headers={TransServiceCountHeaders}
                  filename="event_request_Transportation_Most_Used_Component_report.csv"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#218838";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download CSV Report
                </JSONToCSVDownloader>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!eventTransSericeError &&
            !eventTransServiceloading &&
            eventTransSerivceCountState.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "2px dashed #dee2e6",
                  margin: "20px 0",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <i
                    className="fas fa-chart-line"
                    style={{
                      fontSize: "25px",
                      color: "#6c757d",
                      // marginBottom: "15px",
                    }}
                  ></i>
                </div>
                <h6
                  style={{
                    color: "#6c757d",
                    fontWeight: "500",
                    marginBottom: "10px",
                  }}
                >
                  No Data Available
                </h6>
                <p
                  style={{
                    color: "#868e96",
                    margin: "0",
                    fontSize: "0.7rem",
                  }}
                >
                  No data available for the selected criteria. Try adjusting
                  your filters.
                </p>
              </div>
            )}
        </div>

        <div
          className="chart"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Filters Section - Always visible */}
          <div className="row mb-4">
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div>
                <div className="form-group">
                  <label
                    htmlFor="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      color: "#495057",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Department Type
                  </label>
                  <select
                    id="departmentType"
                    style={{
                      fontSize: "0.7rem",
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      height: "2.5rem",
                    }}
                    className="form-select form-select-lg custom-select"
                    value={TransCompCountselectedDepType}
                    onChange={(e) =>
                      setTransCompCountselectedDepType(e.target.value)
                    }
                    name="otherTransferId"
                    onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                    onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                    //disabled={eventTransComploading}
                  >
                    <option value="">All Department Types</option>
                    {depTypes.map((data) => (
                      <option key={data.rowId} value={data.rowId}>
                        {data.depTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4 mb-3 mb-sm-0">
              <div className="form-group">
                <label
                  htmlFor="TransCompCountStartDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="TransCompCountStartDate"
                  value={TransCompCountStartDate || ""}
                  onChange={(e) =>
                    setTransCompCountStartDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventTransComploading}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="TransCompCountEndDate"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "10px 12px",
                    height: "2.5rem",
                  }}
                  className="form-control"
                  id="TransCompCountEndDate"
                  value={TransCompCountEndDate || ""}
                  onChange={(e) =>
                    setTransCompCountEndDate(e.target.value || null)
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventTransComploading}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {eventTransCompError && (
            <div
              className="alert alert-danger alert-dismissible"
              style={{
                fontSize: "0.7rem",
                padding: "15px 20px",
                margin: "20px 0",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
                backgroundColor: "#f8d7da",
                borderLeft: "4px solid #dc3545",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fas fa-exclamation-triangle mr-3"
                  style={{ color: "#dc3545", fontSize: "0.7rem" }}
                ></i>
                <span style={{ color: "#721c24", fontWeight: "500" }}>
                  {eventTransCompError}
                </span>
              </div>
              <button
                type="button"
                className="close"
                onClick={() => seteventTransCompError(null)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "0.7rem",
                  color: "#721c24",
                  cursor: "pointer",
                }}
              >
                <span>&times;</span>
              </button>
            </div>
          )}

          {/* Chart and Download Section */}
          {!eventTransCompError && eventTransCompCount.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="500px"
                  data={eventTransCompCountdata}
                  options={eventTransCompCountoptions}
                  legendToggle
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <JSONToCSVDownloader
                  data={eventTransCompCount}
                  headers={TransCompCountHeaders}
                  filename="event_request_Transportation_Most_Used_Component_per_department_report.csv"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#218838";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download CSV Report
                </JSONToCSVDownloader>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!eventTransCompError &&
            !eventTransComploading &&
            eventTransCompCount.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "2px dashed #dee2e6",
                  margin: "20px 0",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <i
                    className="fas fa-chart-line"
                    style={{
                      fontSize: "25px",
                      color: "#6c757d",
                      // marginBottom: "15px",
                    }}
                  ></i>
                </div>
                <h6
                  style={{
                    color: "#6c757d",
                    fontWeight: "500",
                    marginBottom: "10px",
                  }}
                >
                  No Data Available
                </h6>
                <p
                  style={{
                    color: "#868e96",
                    margin: "0",
                    fontSize: "0.7rem",
                  }}
                >
                  No data available for the selected criteria. Try adjusting
                  your filters.
                </p>
              </div>
            )}
        </div>
      </div>
      <div>
        <div
          style={{
            position: "relative",
            textAlign: "center",
            marginBottom: "30px",
            padding: "20px 0",
          }}
        >
          <hr
            style={{
              border: "none",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, #0058af, transparent)",
              margin: "0",
              position: "absolute",
              top: "50%",
              left: "0",
              right: "0",
              transform: "translateY(-50%)",
            }}
          />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#f8f9fa",
              padding: "12px 30px",
              borderRadius: "25px",
              boxShadow: "0 4px 12px lightgrey",
              border: "2px solid #0058af",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h5
              style={{
                margin: "0",
                fontSize: "0.7rem",
                fontWeight: "600",
                color: "#2c3e50",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Accommodation Service
            </h5>
          </div>
        </div>
      </div>
      <div
        className="chart"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Filters Section - Always visible */}
        <div className="row mb-4">
          <div className="col-12 col-sm-4 mb-3 mb-sm-0">
            <div>
              <div className="form-group">
                <label
                  htmlFor="departmentType"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  <i
                    className="fas fa-building mr-2"
                    style={{ color: "#6c757d" }}
                  ></i>
                  Department Type
                </label>
                <select
                  id="departmentType"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    height: "2.5rem",
                  }}
                  className="form-select form-select-lg custom-select"
                  value={AccommCountselectedDepType}
                  onChange={(e) =>
                    setAccommCountselectedDepType(e.target.value)
                  }
                  name="otherTransferId"
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventAccommCountloading}
                >
                  <option value="">All Department Types</option>
                  {depTypes.map((data) => (
                    <option key={data.rowId} value={data.rowId}>
                      {data.depTypeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-4 mb-3 mb-sm-0">
            <div className="form-group">
              <label
                htmlFor="AccommCountStartDate"
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                <i
                  className="fas fa-calendar-alt mr-2"
                  style={{ color: "#6c757d" }}
                ></i>
                Start Date
              </label>
              <input
                type="date"
                style={{
                  fontSize: "0.7rem",
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  padding: "10px 12px",
                  height: "2.5rem",
                }}
                className="form-control"
                id="AccommCountStartDate"
                value={AccommCountStartDate || ""}
                onChange={(e) =>
                  setAccommCountStartDate(e.target.value || null)
                }
                onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                //disabled={eventAccommCountloading}
              />
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="form-group">
              <label
                htmlFor="AccommCountEndDate"
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                <i
                  className="fas fa-calendar-check mr-2"
                  style={{ color: "#6c757d" }}
                ></i>
                End Date
              </label>
              <input
                type="date"
                style={{
                  fontSize: "0.7rem",
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  padding: "10px 12px",
                  height: "2.5rem",
                }}
                className="form-control"
                id="AccommCountEndDate"
                value={AccommCountEndDate || ""}
                onChange={(e) => setAccommCountEndDate(e.target.value || null)}
                onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                //disabled={eventAccommCountloading}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {eventAccommCountError && (
          <div
            className="alert alert-danger alert-dismissible"
            style={{
              fontSize: "0.7rem",
              padding: "15px 20px",
              margin: "20px 0",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
              backgroundColor: "#f8d7da",
              borderLeft: "4px solid #dc3545",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <i
                className="fas fa-exclamation-triangle mr-3"
                style={{ color: "#dc3545", fontSize: "0.7rem" }}
              ></i>
              <span style={{ color: "#721c24", fontWeight: "500" }}>
                {eventAccommCountError}
              </span>
            </div>
            <button
              type="button"
              className="close"
              onClick={() => seteventAccommCountError(null)}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                fontSize: "0.7rem",
                color: "#721c24",
                cursor: "pointer",
              }}
            >
              <span>&times;</span>
            </button>
          </div>
        )}

        {/* Chart and Download Section */}
        {!eventAccommCountError && eventAccommCountData.length > 0 && (
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={eventAccommCountdata}
                options={eventAccommCountoptions}
                legendToggle
              />
            </div>

            <div
              style={{
                textAlign: "center",
                paddingTop: "15px",
                borderTop: "1px solid #e9ecef",
              }}
            >
              <JSONToCSVDownloader
                data={eventAccommCountData}
                headers={AccommCountPerDepartmentHeaders}
                filename="event_request_Accommodation_per_department_report.csv"
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "0.7rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#218838";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 4px 8px rgba(40, 167, 69, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#28a745";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 4px rgba(40, 167, 69, 0.3)";
                }}
              >
                <i className="fas fa-download mr-2"></i>
                Download CSV Report
              </JSONToCSVDownloader>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!eventAccommCountError &&
          !eventAccommCountloading &&
          eventAccommCountData.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "2px dashed #dee2e6",
                margin: "20px 0",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <i
                  className="fas fa-chart-line"
                  style={{
                    fontSize: "0.7rem",
                    color: "#6c757d",
                    marginBottom: "15px",
                  }}
                ></i>
              </div>
              <h6
                style={{
                  color: "#6c757d",
                  fontWeight: "500",
                  marginBottom: "10px",
                }}
              >
                No Data Available
              </h6>
              <p
                style={{
                  color: "#868e96",
                  margin: "0",
                  fontSize: "0.7rem",
                }}
              >
                No data available for the selected criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}
      </div>

      <div
        className="chart"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Filters Section - Always visible */}
        <div className="row mb-4">
          <div className="col-md-6 col-sm-6 mb-3 mb-sm-0">
            <div className="form-group">
              <label
                htmlFor="AccommServiceCountStartDate"
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                <i
                  className="fas fa-calendar-alt mr-2"
                  style={{ color: "#6c757d" }}
                ></i>
                Start Date
              </label>
              <input
                type="date"
                style={{
                  fontSize: "0.7rem",
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  padding: "10px 12px",
                  height: "2.5rem",
                }}
                className="form-control"
                id="AccommServiceCountStartDate"
                value={AccommServiceCountStartDate || ""}
                onChange={(e) =>
                  setAccommServiceCountStartDate(e.target.value || null)
                }
                onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                //disabled={eventAccommServiceloading}
              />
            </div>
          </div>
          <div className="col-md-6 col-sm-6">
            <div className="form-group">
              <label
                htmlFor="AccommServiceCountEndDate"
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                <i
                  className="fas fa-calendar-check mr-2"
                  style={{ color: "#6c757d" }}
                ></i>
                End Date
              </label>
              <input
                type="date"
                style={{
                  fontSize: "0.7rem",
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  padding: "10px 12px",
                  height: "2.5rem",
                }}
                className="form-control"
                id="AccommServiceCountEndDate"
                value={AccommServiceCountEndDate || ""}
                onChange={(e) =>
                  setAccommServiceCountEndDate(e.target.value || null)
                }
                onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                //disabled={eventAccommServiceloading}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {eventAccommServiceError && (
          <div
            className="alert alert-danger alert-dismissible"
            style={{
              fontSize: "0.7rem",
              padding: "15px 20px",
              margin: "20px 0",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
              backgroundColor: "#f8d7da",
              borderLeft: "4px solid #dc3545",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <i
                className="fas fa-exclamation-triangle mr-3"
                style={{ color: "#dc3545", fontSize: "0.7rem" }}
              ></i>
              <span style={{ color: "#721c24", fontWeight: "500" }}>
                {eventAccommServiceError}
              </span>
            </div>
            <button
              type="button"
              className="close"
              onClick={() => seteventAccommServiceError(null)}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                fontSize: "0.7rem",
                color: "#721c24",
                cursor: "pointer",
              }}
            >
              <span>&times;</span>
            </button>
          </div>
        )}

        {/* Chart and Download Section */}
        {!eventAccommServiceError &&
          eventAccommSerivceCountState.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="500px"
                  data={eventAccommServiceCountdata}
                  options={eventAccommServiceCountoptions}
                  legendToggle
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <JSONToCSVDownloader
                  data={eventAccommSerivceCountState}
                  headers={AccommServiceCountHeaders}
                  filename="event_request_Accommodation_Most_Used_Component_report.csv"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#218838";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <i className="fas fa-download mr-2"></i>
                  Download CSV Report
                </JSONToCSVDownloader>
              </div>
            </div>
          )}

        {/* No Data Message */}
        {!eventAccommServiceError &&
          !eventAccommServiceloading &&
          eventAccommSerivceCountState.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "2px dashed #dee2e6",
                margin: "20px 0",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <i
                  className="fas fa-chart-line"
                  style={{
                    fontSize: "0.7rem",
                    color: "#6c757d",
                    marginBottom: "15px",
                  }}
                ></i>
              </div>
              <h6
                style={{
                  color: "#6c757d",
                  fontWeight: "500",
                  marginBottom: "10px",
                }}
              >
                No Data Available
              </h6>
              <p
                style={{
                  color: "#868e96",
                  margin: "0",
                  fontSize: "0.7rem",
                }}
              >
                No data available for the selected criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}
      </div>

      <div
        className="chart"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Filters Section - Always visible */}
        <div className="row mb-4">
          <div className="col-12 col-sm-4 mb-3 mb-sm-0">
            <div>
              <div className="form-group">
                <label
                  htmlFor="departmentType"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  <i
                    className="fas fa-building mr-2"
                    style={{ color: "#6c757d" }}
                  ></i>
                  Department Type
                </label>
                <select
                  id="departmentType"
                  style={{
                    fontSize: "0.7rem",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    height: "2.5rem",
                  }}
                  className="form-select form-select-lg custom-select"
                  value={AccommCountCompselectedDepType}
                  onChange={(e) =>
                    setAccommCountCompselectedDepType(e.target.value)
                  }
                  name="otherTransferId"
                  onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                  //disabled={eventAccommCompCountloading}
                >
                  <option value="">All Department Types</option>
                  {depTypes.map((data) => (
                    <option key={data.rowId} value={data.rowId}>
                      {data.depTypeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-4 mb-3 mb-sm-0">
            <div className="form-group">
              <label
                htmlFor="AccommCountCompStartDate"
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                <i
                  className="fas fa-calendar-alt mr-2"
                  style={{ color: "#6c757d" }}
                ></i>
                Start Date
              </label>
              <input
                type="date"
                style={{
                  fontSize: "0.7rem",
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  padding: "10px 12px",
                  height: "2.5rem",
                }}
                className="form-control"
                id="AccommCountCompStartDate"
                value={AccommCountCompStartDate || ""}
                onChange={(e) =>
                  setAccommCountCompStartDate(e.target.value || null)
                }
                onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                //disabled={eventAccommCompCountloading}
              />
            </div>
          </div>
          <div className="col-12 col-sm-4">
            <div className="form-group">
              <label
                htmlFor="AccommCompCountEndDate"
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                <i
                  className="fas fa-calendar-check mr-2"
                  style={{ color: "#6c757d" }}
                ></i>
                End Date
              </label>
              <input
                type="date"
                style={{
                  fontSize: "0.7rem",
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  padding: "10px 12px",
                  height: "2.5rem",
                }}
                className="form-control"
                id="AccommCompCountEndDate"
                value={AccommCompCountEndDate || ""}
                onChange={(e) =>
                  setAccommCompCountEndDate(e.target.value || null)
                }
                onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                //disabled={eventAccommCompCountloading}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {eventAccommCountCompError && (
          <div
            className="alert alert-danger alert-dismissible"
            style={{
              fontSize: "0.7rem",
              padding: "15px 20px",
              margin: "20px 0",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
              backgroundColor: "#f8d7da",
              borderLeft: "4px solid #dc3545",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <i
                className="fas fa-exclamation-triangle mr-3"
                style={{ color: "#dc3545", fontSize: "0.7rem" }}
              ></i>
              <span style={{ color: "#721c24", fontWeight: "500" }}>
                {eventAccommCountCompError}
              </span>
            </div>
            <button
              type="button"
              className="close"
              onClick={() => seteventAccommCountCompError(null)}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                fontSize: "0.7rem",
                color: "#721c24",
                cursor: "pointer",
              }}
            >
              <span>&times;</span>
            </button>
          </div>
        )}

        {/* Chart and Download Section */}
        {!eventAccommCountCompError && eventAccommCompCount.length > 0 && (
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={eventAccommCompCountdata}
                options={eventAccommCompCountoptions}
                legendToggle
              />
            </div>

            <div
              style={{
                textAlign: "center",
                paddingTop: "15px",
                borderTop: "1px solid #e9ecef",
              }}
            >
              <JSONToCSVDownloader
                data={eventAccommCompCount}
                headers={AccommCompCountHeaders}
                filename="event_request_Accommodation__Comp_per_department_report.csv"
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "0.7rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#218838";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 4px 8px rgba(40, 167, 69, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#28a745";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 4px rgba(40, 167, 69, 0.3)";
                }}
              >
                <i className="fas fa-download mr-2"></i>
                Download CSV Report
              </JSONToCSVDownloader>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!eventAccommCountCompError &&
          !eventAccommCompCountloading &&
          eventAccommCompCount.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "2px dashed #dee2e6",
                margin: "20px 0",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <i
                  className="fas fa-chart-line"
                  style={{
                    fontSize: "0.7rem",
                    color: "#6c757d",
                    marginBottom: "15px",
                  }}
                ></i>
              </div>
              <h6
                style={{
                  color: "#6c757d",
                  fontWeight: "500",
                  marginBottom: "10px",
                }}
              >
                No Data Available
              </h6>
              <p
                style={{
                  color: "#868e96",
                  margin: "0",
                  fontSize: "0.7rem",
                }}
              >
                No data available for the selected criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}
      </div>
    </>
  );
};

export default Statistics;
