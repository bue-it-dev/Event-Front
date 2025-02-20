import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import Login from "./Component/Login/login";
import Applicant from "./Component/Applicant/Applicant";
import AddHomeTravel from "./Component/Applicant/AddHomeTravelRequest";
import MyHomeRequests from "./Component/Applicant/MyHomeRequests";
import Admin from "./Component/Admin/Admin";
import VCB from "./Component/VCB/VCB";
import HR from "./Component/HR/HR";
import BOM from "./Component/BOM/BOM";
import COO from "./Component/COO/COO";
import President from "./Component/President/President";
import TravelOffice from "./Component/TravelOffice/TravelOffice";
import BudgetOffice from "./Component/BudgetOffice/BudgetOffice";
import Page404 from "./Component/404 Page/Page404";
import {
  Switch,
  Route,
  HashRouter as Router,
  Redirect,
  useLocation,
} from "react-router-dom";
import Navbar from "./Component/Navbar/Navbar";
import { checkLoggedIn } from "./Component/Util/Authenticate";
import { getUserType, getCurrentUser } from "./Component/Util/Authenticate";
import { useUser } from "./Component/Entities";
import ProtectedRoute from "./Component/Common/ProtectedRoute";
import Header from "./Component/Header/Header";
import Footer from "./Component/NewFooter/Footer";
import HomeRequestDetails from "./Component/Applicant/HomeRequestDetails";
import HomeRequestListHOD from "./Component/Admin/HomeRequestListHOD";
import HomeRequestDetailsHOD from "./Component/Admin/HomeRequestDetailsHOD";
import HomeRequestDetailsVCB from "./Component/VCB/HomeRequestDetailsVCB";
import HomeRequestListVCB from "./Component/VCB/HomeRequestListVCB";
import HomeRequestListHR from "./Component/HR/HomeRequestListHR";
import BusinessRequestListHR from "./Component/HR/BusinessRequestListHR";
import HomeRequestDetailsHR from "./Component/HR/HomeRequestDetailsHR";
import HomeRequestListBOM from "./Component/BOM/HomeRequestListBOM";
import HomeRequestDetailsBOM from "./Component/BOM/HomeRequestDetailsBOM";
import HomeRequestListCOO from "./Component/COO/HomeRequestListCOO";
import HomeRequestDetailsCOO from "./Component/COO/HomeRequestDetailsCOO";
import HomeRequestDetailsTravel from "./Component/TravelOffice/HomeRequestDetailsTravel";
import HomeRequestListTravel from "./Component/TravelOffice/HomeRequestListTravel";
import AdminAddHomeRequest from "./Component/Admin/AdminAddHomeRequest";
import AdminMyRequests from "./Component/Admin/AdminMyRequests";
import VCBAddHomeRequest from "./Component/VCB/VCBAddHomeRequest";
import VCBMyRequests from "./Component/VCB/VCBMyRequests";
import HomeRequestDetailsPRE from "./Component/President/HomeRequestDetailsPRE";
import HomeRequestListPRE from "./Component/President/HomeRequestListPRE";
import PresidentAddHomeRequest from "./Component/President/PresidentAddHomeRequest";
import PresidentMyRequests from "./Component/President/PresidentMyRequests";
import HRAddHomeRequest from "./Component/HR/HRAddHomeRequest";
import HRMyRequests from "./Component/HR/HRMyRequests";
import AddBusinessTravelRequest from "./Component/Applicant/AddBusinessTravelRequest";
import MyBusinessRequests from "./Component/Applicant/MyBusinessRequests";
import BusinessRequestDetails from "./Component/Applicant/BusinessRequestDetails";
import BusinessRequestDetailsHR from "./Component/HR/BusinessRequestDetailsHR";
import BusinessRequestListTravel from "./Component/TravelOffice/BusinessRequestListTravel";
import BusinessRequestDetailsTO from "./Component/TravelOffice/BusinessRequestDetailsTO";
import BusinessRequestListBudget from "./Component/BudgetOffice/BusinessRequestListBudget";
import BusinessRequestDetailsBO from "./Component/BudgetOffice/BusinessRequestDetailsBO";
import BusinessRequestListHOD from "./Component/Admin/BusinessRequestListHOD";
import BusinessRequestDetailsHOD from "./Component/Admin/BusinessRequestDetailsHOD";
import BusinessRequestListVCB from "./Component/VCB/BusinessRequestListVCB";
import BusinessRequestDetailsVCB from "./Component/VCB/BusinessRequestDetailsVCB";
import BusinessRequestListBOM from "./Component/BOM/BusinessRequestListBOM";
import BusinessRequestDetailsBOM from "./Component/BOM/BusinessRequestDetailsBOM";
import BusinessRequestListCOO from "./Component/COO/BusinessRequestListCOO";
import BusinessRequestDetailsCOO from "./Component/COO/BusinessRequestDetailsCOO";
import Dashboard from "./Component/Dashboard/Dashboard";
import BusinessRequestListPRE from "./Component/President/BusinessRequestListPRE";
import BusinessRequestDetailsPRE from "./Component/President/BusinessRequestDetailsPRE";
import Home from "./Component/Dashboard/Home";
import BOMAddHomeRequest from "./Component/BOM/BOMAddHomeRequest";
import BOMMyRequests from "./Component/BOM/BOMMyRequests";
// import Reports from "./Component/Dashboard/Reports";
import BusinessReports from "./Component/Dashboard/BusinessReports";
import HomeReports from "./Component/Dashboard/HomeReports";
import Statistics from "./Component/Dashboard/Statistics";

import AdminAddBusinessRequest from "./Component/Admin/AdminAddBusinessRequest";
import AdminMyBusinessRequest from "./Component/Admin/AdminMyBusinessRequest";
import VCBAddBusinessRequest from "./Component/VCB/VCBAddBusinessRequest";
import VCBMyBusinessRequest from "./Component/VCB/VCBMyBusinessRequests";
import PresidentMyBusinessRequest from "./Component/President/PresidentMyBusinessRequest";
import PresidentAddBusinessRequest from "./Component/President/PresidentAddBusinessRequest";
function App() {
  const [user, { setUser }] = useUser();
  const currentUser = getCurrentUser();
  const location = useLocation(); // Get the current location
  React.useEffect(() => {
    (async () => {
      if (await checkLoggedIn()) {
        try {
          const userType = await getUserType();
          setUser({ ...user, loggedIn: true, type: userType, view: userType });
          console.log("current User", currentUser);
        } catch (err) {
          console.log("Error", err);
        }
      } else {
        console.log("Error");
      }
    })();
  }, []);
  return (
    <Router>
      <div className="App">
        <Route path="/login" exact component={Login} />
        {currentUser ? (
          <>
            <Navbar />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Header />
            <Switch>
              <ProtectedRoute
                path="/dashboard"
                component={
                  user.type === "HOD"
                    ? Admin
                    : user.type === "VCB"
                    ? VCB
                    : user.type === "HR"
                    ? HR
                    : user.type === "President"
                    ? President
                    : user.type === "Business_operation_manager"
                    ? BOM
                    : user.type === "COO"
                    ? COO
                    : user.type === "Travel_Office"
                    ? TravelOffice
                    : user.type === "Budget_Office"
                    ? BudgetOffice
                    : Applicant
                }
              />
              {user.type === "HOD" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/business-request-list-hod"
                      component={BusinessRequestListHOD}
                    />
                    <ProtectedRoute
                      path="/business-request-details-hod"
                      component={BusinessRequestDetailsHOD}
                    />
                    <ProtectedRoute
                      path="/hod-add-home-travel-request"
                      exact
                      component={AdminAddHomeRequest}
                    />
                    <ProtectedRoute
                      path="/hod-my-home-travel-request"
                      exact
                      component={AdminMyRequests}
                    />
                    <ProtectedRoute
                      path="/home-request-details"
                      exact
                      component={HomeRequestDetails}
                    />
                    <ProtectedRoute
                      path="/hod-add-business-travel-request"
                      exact
                      component={AdminAddBusinessRequest}
                    />
                    <ProtectedRoute
                      path="/hod-my-business-travel-request"
                      exact
                      component={AdminMyBusinessRequest}
                    />
                    <ProtectedRoute
                      path="/business-request-details"
                      exact
                      component={BusinessRequestDetails}
                    />
                    <ProtectedRoute
                      path="/home-request-list-hod"
                      component={HomeRequestListHOD}
                    />
                    <ProtectedRoute
                      path="/home-request-details-hod"
                      component={HomeRequestDetailsHOD}
                    />
                    <ProtectedRoute
                      path="/home-request-list-bom"
                      component={HomeRequestListBOM}
                    />
                    <ProtectedRoute
                      path="/home-request-details-bom"
                      component={HomeRequestDetailsBOM}
                    />
                    <ProtectedRoute
                      path="/business-request-list-bom"
                      component={BusinessRequestListBOM}
                    />
                    <ProtectedRoute
                      path="/business-request-details-bom"
                      component={BusinessRequestDetailsBOM}
                    />
                    <ProtectedRoute
                      path="/business-request-details-bom"
                      component={BusinessRequestDetailsBOM}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu"
                      component={Dashboard}
                    />
                    <Route path="/" exact component={Admin} />
                    <Route path="*" exact component={Page404} />
                    {/* <ProtectedRoute
                      path="/dashboard-menu/reports/business-reports"
                      component={BusinessReports}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu/reports/home-reports"
                      component={HomeReports}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu/statistics"
                      component={Statistics}
                    /> */}
                    {/* <ProtectedRoute
                      path="/dashboard-menu/home"
                      component={Home}
                    /> */}
                  </Switch>
                </>
              ) : user.type === "VCB" ? (
                <>
                  {currentUser.isAcademic === "0" ? (
                    <>
                      <Switch>
                        <ProtectedRoute
                          path="/home-request-create-vcb"
                          exact
                          component={VCBAddHomeRequest}
                        />
                        <ProtectedRoute
                          path="/my-home-request-list-vcb"
                          exact
                          component={VCBMyRequests}
                        />
                        <ProtectedRoute
                          path="/home-request-details"
                          exact
                          component={HomeRequestDetails}
                        />
                        <ProtectedRoute
                          path="/vcb-add-business-travel-request"
                          exact
                          component={VCBAddBusinessRequest}
                        />
                        <ProtectedRoute
                          path="/vcb-my-business-travel-request"
                          exact
                          component={VCBMyBusinessRequest}
                        />
                        <ProtectedRoute
                          path="/business-request-details"
                          exact
                          component={BusinessRequestDetails}
                        />
                        <ProtectedRoute
                          path="/home-request-list-vcb"
                          component={HomeRequestListVCB}
                        />
                        <ProtectedRoute
                          path="/home-request-details-vcb"
                          component={HomeRequestDetailsVCB}
                        />
                        <ProtectedRoute
                          path="/business-request-list-vcb"
                          component={BusinessRequestListVCB}
                        />
                        <ProtectedRoute
                          path="/business-request-details-vcb"
                          component={BusinessRequestDetailsVCB}
                        />
                        <ProtectedRoute
                          path="/home-request-list-coo"
                          component={HomeRequestListCOO}
                        />
                        <ProtectedRoute
                          path="/home-request-details-coo"
                          component={HomeRequestDetailsCOO}
                        />
                        <ProtectedRoute
                          path="/business-request-list-coo"
                          component={BusinessRequestListCOO}
                        />
                        <ProtectedRoute
                          path="/business-request-details-coo"
                          component={BusinessRequestDetailsCOO}
                        />
                        <ProtectedRoute
                          path="/dashboard-menu"
                          component={Dashboard}
                        />
                        <ProtectedRoute
                          path="/dashboard-menu/home"
                          component={Home}
                        />
                        <Route path="/" exact component={VCB} />
                        <Route path="*" exact component={Page404} />
                      </Switch>
                    </>
                  ) : (
                    <>
                      <Switch>
                        <ProtectedRoute
                          path="/home-request-create-vcb"
                          exact
                          component={VCBAddHomeRequest}
                        />
                        <ProtectedRoute
                          path="/my-home-request-list-vcb"
                          exact
                          component={VCBMyRequests}
                        />
                        <ProtectedRoute
                          path="/home-request-details"
                          exact
                          component={HomeRequestDetails}
                        />
                        <ProtectedRoute
                          path="/vcb-add-business-travel-request"
                          exact
                          component={VCBAddBusinessRequest}
                        />
                        <ProtectedRoute
                          path="/vcb-my-business-travel-request"
                          exact
                          component={VCBMyBusinessRequest}
                        />
                        <ProtectedRoute
                          path="/business-request-details"
                          exact
                          component={BusinessRequestDetails}
                        />
                        <ProtectedRoute
                          path="/home-request-list-vcb"
                          component={HomeRequestListVCB}
                        />
                        <ProtectedRoute
                          path="/home-request-details-vcb"
                          component={HomeRequestDetailsVCB}
                        />
                        <ProtectedRoute
                          path="/business-request-list-vcb"
                          component={BusinessRequestListVCB}
                        />
                        <ProtectedRoute
                          path="/business-request-details-vcb"
                          component={BusinessRequestDetailsVCB}
                        />
                        <Route path="/" exact component={VCB} />
                        <Route path="*" exact component={Page404} />
                      </Switch>
                    </>
                  )}
                </>
              ) : user.type === "President" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/president-add-home-travel-request"
                      exact
                      component={PresidentAddHomeRequest}
                    />
                    <ProtectedRoute
                      path="/president-my-home-travel-request"
                      exact
                      component={PresidentMyRequests}
                    />
                    <ProtectedRoute
                      path="/home-request-details"
                      exact
                      component={HomeRequestDetails}
                    />
                    <ProtectedRoute
                      path="/president-add-business-travel-request"
                      exact
                      component={PresidentAddBusinessRequest}
                    />
                    <ProtectedRoute
                      path="/president-my-business-travel-request"
                      exact
                      component={PresidentMyBusinessRequest}
                    />
                    <ProtectedRoute
                      path="/business-request-details"
                      exact
                      component={BusinessRequestDetails}
                    />
                    <ProtectedRoute
                      path="/home-request-list-president"
                      exact
                      component={HomeRequestListPRE}
                    />
                    <ProtectedRoute
                      path="/home-request-details-president"
                      component={HomeRequestDetailsPRE}
                    />
                    <ProtectedRoute
                      path="/business-request-list-president"
                      exact
                      component={BusinessRequestListPRE}
                    />
                    <ProtectedRoute
                      path="/business-request-details-president"
                      component={BusinessRequestDetailsPRE}
                    />
                    <Route path="/" exact component={President} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "HR" ? (
                <>
                  <Switch>
                    {/* <ProtectedRoute
                      path="/hr-add-home-travel-request"
                      exact
                      component={HRAddHomeRequest}
                    />
                    <ProtectedRoute
                      path="/hr-my-home-travel-request"
                      exact
                      component={HRMyRequests}
                    />
                    <ProtectedRoute
                      path="/home-request-details"
                      exact
                      component={HomeRequestDetails}
                    /> */}
                    <ProtectedRoute
                      path="/business-request-details-hr"
                      exact
                      component={BusinessRequestDetailsHR}
                    />
                    <ProtectedRoute
                      path="/home-request-list-hr"
                      component={HomeRequestListHR}
                    />
                    <ProtectedRoute
                      path="/business-request-list-hr"
                      component={BusinessRequestListHR}
                    />
                    <ProtectedRoute
                      path="/home-request-details-hr"
                      component={HomeRequestDetailsHR}
                    />
                    <Route path="/" exact component={HR} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Business_operation_manager" ? (
                <>
                  <Switch>
                    {/* <ProtectedRoute
                      path="/bom-add-home-travel-request"
                      exact
                      component={BOMAddHomeRequest}
                    />
                    <ProtectedRoute
                      path="/bom-my-home-travel-request"
                      exact
                      component={BOMMyRequests}
                    />
                    <ProtectedRoute
                      path="/home-request-details"
                      exact
                      component={HomeRequestDetails}
                    /> */}
                    <ProtectedRoute
                      path="/home-request-list-bom"
                      component={HomeRequestListBOM}
                    />
                    <ProtectedRoute
                      path="/home-request-details-bom"
                      component={HomeRequestDetailsBOM}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu/reports/business-reports"
                      component={BusinessReports}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu/reports/home-reports"
                      component={HomeReports}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu/statistics"
                      component={Statistics}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu"
                      component={Dashboard}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu/home"
                      component={Home}
                    />
                    <Route path="/" exact component={BOM} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "COO" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/home-request-list-coo"
                      component={HomeRequestListCOO}
                    />
                    <ProtectedRoute
                      path="/home-request-details-coo"
                      component={HomeRequestDetailsCOO}
                    />
                    <ProtectedRoute
                      path="/business-request-list-coo"
                      component={BusinessRequestListCOO}
                    />
                    <ProtectedRoute
                      path="/home-request-details-coo"
                      component={BusinessRequestDetailsCOO}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu/reports/business-reports"
                      component={BusinessReports}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu/reports/home-reports"
                      component={HomeReports}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu/statistics"
                      component={Statistics}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu"
                      component={Dashboard}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu/home"
                      component={Home}
                    />
                    <Route path="/" exact component={COO} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Budget_Office" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/business-request-list-budget-office"
                      component={BusinessRequestListBudget}
                    />
                    <ProtectedRoute
                      path="/business-request-details-budget-office"
                      component={BusinessRequestDetailsBO}
                    />
                    <Route path="/" exact component={BudgetOffice} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Travel_Office" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/home-request-list-travel-office"
                      component={HomeRequestListTravel}
                    />
                    <ProtectedRoute
                      path="/home-request-details-travel-office"
                      component={HomeRequestDetailsTravel}
                    />
                    <ProtectedRoute
                      path="/business-request-list-travel-office"
                      component={BusinessRequestListTravel}
                    />
                    <ProtectedRoute
                      path="/business-request-details-travel-office"
                      component={BusinessRequestDetailsTO}
                    />
                    <ProtectedRoute
                      path="/dashboard-menu"
                      component={Dashboard}
                    />
                    <Route path="/" exact component={TravelOffice} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/Event-request"
                      exact
                      component={AddHomeTravel}
                    />
                    <ProtectedRoute
                      path="/business-travel-request"
                      exact
                      component={AddBusinessTravelRequest}
                    />
                    <ProtectedRoute
                      path="/my-event-requests"
                      exact
                      component={MyHomeRequests}
                    />
                    <ProtectedRoute
                      path="/my-business-requests"
                      exact
                      component={MyBusinessRequests}
                    />
                    <ProtectedRoute
                      path="/home-request-details"
                      exact
                      component={HomeRequestDetails}
                    />
                    <ProtectedRoute
                      path="/business-request-details"
                      exact
                      component={BusinessRequestDetails}
                    />
                    {/* <Route path="/" exact component={Applicant} /> */}
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              )}
            </Switch>
            <Footer />
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
