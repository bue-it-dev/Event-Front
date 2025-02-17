import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useHistory, useLocation } from "react-router-dom";
import "./AdminTabs.css";

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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const AdminTabs = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  // Map URL paths to tab index
  const getTabIndexFromPath = (path) => {
    switch (path) {
      case "/hod-add-home-travel-request":
        return 0;
      case "/hod-my-home-travel-request":
        return 1;
      case "/hod-add-business-travel-request":
        return 2;
      case "/hod-my-business-travel-request":
        return 3;
      case "/home-request-list-hod":
        return 4;
      case "/business-request-list-hod":
        return 5;
      default:
        return 0; // Default tab if no matching route
    }
  };

  // Initialize tab index based on the current URL
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
        history.push("/hod-add-home-travel-request");
        break;
      case 1:
        history.push("/hod-my-home-travel-request");
        break;
      case 2:
        history.push("/hod-add-business-travel-request");
        break;
      case 3:
        history.push("/hod-my-business-travel-request");
        break;
      case 4:
        history.push("/home-request-list-hod");
        break;
      case 5:
        history.push("/business-request-list-hod");
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
          <Tab label="My Home Request" {...a11yProps(1)} />
          <Tab label="New Business Leave Request" {...a11yProps(2)} />
          <Tab label="My Business Request" {...a11yProps(3)} />
          <Tab label="Home Request Approvals" {...a11yProps(4)} />
          <Tab label="Business Request Approvals" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
    </div>
  );
};

export default AdminTabs;
