import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import "./VCBTab.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useHistory, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const VCBTabs = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const getRoleID = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.isAcademic; // Adjust based on your token structure
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const roleID = getRoleID();

  // Map URL paths to tab index
  const getTabIndexFromPath = (path) => {
    switch (path) {
      case "/home-request-create-vcb":
        return 0;
      case "/my-home-request-list-vcb":
        return 1;
      case "/vcb-add-business-travel-request":
        return 2;
      case "/vcb-my-business-travel-request":
        return 3;
      case "/home-request-list-vcb":
        return 4;
      case "/business-request-list-vcb":
        return 5;
      default:
        return 0;
    }
  };

  const [value, setValue] = React.useState(
    getTabIndexFromPath(location.pathname)
  );

  useEffect(() => {
    // Update tab index when the URL changes
    setValue(getTabIndexFromPath(location.pathname));
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Navigate to the corresponding route
    switch (newValue) {
      case 0:
        history.push("/home-request-create-vcb");
        break;
      case 1:
        history.push("/my-home-request-list-vcb");
        break;
      case 2:
        history.push("/vcb-add-business-travel-request");
        break;
      case 3:
        history.push("/vcb-my-business-travel-request");
        break;
      case 4:
        history.push("/home-request-list-vcb");
        break;
      case 5:
        history.push("/business-request-list-vcb");
        break;
      default:
        break;
    }
  };

  return (
    <div className={classes.root}>
      <hr className="solid" />
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          <Tab label="New Home Leave Request" {...a11yProps(0)} />
          <Tab label="My Home Requests" {...a11yProps(1)} />
          <Tab label="New Business Leave Request" {...a11yProps(2)} />
          <Tab label="My Business Requests" {...a11yProps(3)} />
          <Tab label="VCB Home Requests Approvals" {...a11yProps(4)} />
          <Tab label="VCB Business Requests Approvals" {...a11yProps(5)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}></TabPanel>
      <TabPanel value={value} index={1}></TabPanel>
      <TabPanel value={value} index={2}></TabPanel>
      <TabPanel value={value} index={3}></TabPanel>
      <TabPanel value={value} index={4}></TabPanel>
      <TabPanel value={value} index={5}></TabPanel>
    </div>
  );
};

export default VCBTabs;
