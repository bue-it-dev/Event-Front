import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import "./HRTab.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useHistory, useLocation } from "react-router-dom";

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

const HRTabs = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  // Map URL paths to tab index
  const getTabIndexFromPath = (path) => {
    switch (path) {
      // case "/hr-add-home-travel-request":
      //   return 0;
      // case "/hr-my-home-travel-request":
      //   return 1;
      case "/home-request-list-hr":
        return 0;
      case "/business-request-list-hr":
        return 1;
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
      // case 0:
      //   history.push("/hr-add-home-travel-request");
      //   break;
      // case 1:
      //   history.push("/hr-my-home-travel-request");
      //   break;
      case 0:
        history.push("/home-request-list-hr");
        break;
      case 1:
        history.push("/business-request-list-hr");
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
          {/* <Tab label="New Home Travel Request" {...a11yProps(0)} />
          <Tab label="My Requests" {...a11yProps(1)} /> */}
          <Tab label="Home Requests Approvals" {...a11yProps(0)} />
          <Tab label="Business Requests Approvals" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      {/* <TabPanel value={value} index={0}>
      </TabPanel>
      <TabPanel value={value} index={1}>
      </TabPanel> */}
      <TabPanel value={value} index={0}>
        {/* Add content for "Home Requests Approvals" */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* Add content for "Home Requests Approvals" */}
      </TabPanel>
    </div>
  );
};

export default HRTabs;
