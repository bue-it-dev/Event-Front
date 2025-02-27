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
      case "/hod-add-event-request":
        return 0;
      case "/hod-my-events-request":
        return 1;
      case "/hod-event-approvals":
        return 2;
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
        history.push("/hod-add-event-request");
        break;
      case 1:
        history.push("/hod-my-events-request");
        break;
      case 2:
        history.push("/hod-event-approvals");
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
          <Tab label="New Event Request" {...a11yProps(0)} />
          <Tab label="My Events" {...a11yProps(1)} />
          <Tab label="Event Approvals" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
    </div>
  );
};

export default AdminTabs;
