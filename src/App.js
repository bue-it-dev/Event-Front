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
import BusinessRequestListCOO from "./Component/COO/BusinessRequestListCOO";
import BusinessRequestListVCB from "./Component/VCB/BusinessRequestListVCB";
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
import AdminAddHomeRequest from "./Component/Admin/AdminAddHomeRequest";
import EventRequestDetailsVCB from "./Component/VCB/EventRequestDetailsVCB";
import AdminEventAdd from "./Component/Admin/AdminEventAdd";
import AdminEventList from "./Component/Admin/AdminEventList";
import AdminEventApprovalsList from "./Component/Admin/AdminEventApprovalsList";
import AdminEventDetails from "./Component/Admin/AdminEventDetails";
import AddEventVCB from "./Component/VCB/AddEventVCB";
import BOEventList from "./Component/BudgetOffice/BOEventList";
import BOEventDetails from "./Component/BudgetOffice/BOEventDetails";
import VCBEventList from "./Component/VCB/VCBEventList";
import VCBApprovalDetails from "./Component/VCB/VCBApprovalDetails";
import AddNewEvent from "./Component/President/AddNewEvent";
import GetEventListForApprovals from "./Component/President/GetEventListForApprovals";
import GetEventList from "./Component/President/GetEventList";
import GetApprovalDetails from "./Component/President/GetApprovalDetails";
import IT from "./Component/IT/IT";
import ITEventList from "./Component/IT/ITEventList";

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
                    : user.type === "OfficeOfThePresident"
                    ? President
                    : user.type === "SecurityCheck"
                    ? HR
                    : user.type === "BOM"
                    ? BOM
                    : user.type === "COO"
                    ? COO
                    : user.type === "Travel_Office"
                    ? TravelOffice
                    : user.type === "BudgetOffice"
                    ? BudgetOffice
                    : user.type === "IT"
                    ? IT
                    : Applicant
                }
              />
              {user.type === "HOD" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/hod-add-event-request"
                      component={AdminEventAdd}
                    />
                    <ProtectedRoute
                      path="/hod-my-events-request"
                      component={AdminEventList}
                    />
                    <ProtectedRoute
                      path="/hod-event-approvals"
                      component={AdminEventApprovalsList}
                    />
                    <ProtectedRoute
                      path="/hod-event-request-details"
                      component={AdminEventDetails}
                    />
                    <Route path="/" exact component={Admin} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "VCB" ? (
                <>
                  {currentUser.isAcademic === "0" ? (
                    <>
                      <Switch>
                        <ProtectedRoute
                          path="/event-list-coo"
                          component={BusinessRequestListCOO}
                        />
                        <ProtectedRoute
                          path="/event-request-list-vcb"
                          component={BusinessRequestListVCB}
                        />
                        <ProtectedRoute
                          path="/add-event-VCB"
                          component={AddEventVCB}
                        />
                        <ProtectedRoute
                          path="/vcb-event-list"
                          component={VCBEventList}
                        />
                        <ProtectedRoute
                          path="/vcb-approval-details"
                          component={VCBApprovalDetails}
                        />
                        <Route path="/" exact component={VCB} />
                        <Route path="*" exact component={Page404} />
                      </Switch>
                    </>
                  ) : (
                    <>
                      <Switch>
                        <ProtectedRoute
                          path="/event-list-coo"
                          component={BusinessRequestListCOO}
                        />
                        <ProtectedRoute
                          path="/event-request-list-vcb"
                          component={BusinessRequestListVCB}
                        />
                        <ProtectedRoute
                          path="/add-event-VCB"
                          component={AddEventVCB}
                        />
                        <ProtectedRoute
                          path="/vcb-event-list"
                          component={VCBEventList}
                        />
                        <ProtectedRoute
                          path="/vcb-approval-details"
                          component={VCBApprovalDetails}
                        />
                        <Route path="/" exact component={VCB} />
                        <Route path="*" exact component={Page404} />
                      </Switch>
                    </>
                  )}
                </>
              ) : user.type === "OfficeOfThePresident" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/add-event"
                      exact
                      component={AddNewEvent}
                    />
                    <ProtectedRoute
                      path="/event-approval-list"
                      exact
                      component={GetEventListForApprovals}
                    />
                    <ProtectedRoute
                      path="/event-list"
                      exact
                      component={GetEventList}
                    />
                    <ProtectedRoute
                      path="/event-approval"
                      exact
                      component={GetApprovalDetails}
                    />

                    <Route path="/" exact component={President} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "HR" ? (
                <>
                  <Switch>
                    <Route path="/" exact component={HR} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Business_operation_manager" ? (
                <>
                  <Switch>
                    <Route path="/" exact component={BOM} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "COO" ? (
                <>
                  <Switch>
                    <Route path="/" exact component={COO} />
                    <Route path="*" exact component={Page404} />

                    <ProtectedRoute
                      path="/business-request-list-coo"
                      component={BusinessRequestListCOO}
                    />
                  </Switch>
                </>
              ) : user.type === "BudgetOffice" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/event-request-list-budget-office"
                      component={BOEventList}
                    />
                    <ProtectedRoute
                      path="/bo-event-request-details"
                      component={BOEventDetails}
                    />
                    <Route path="/" exact component={BudgetOffice} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "IT" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/event-request-list-IT"
                      component={ITEventList}
                    />
                    <ProtectedRoute
                      path="/event-request-list-IT-test"
                      component={ITEventList}
                    />
                    <Route path="/" exact component={IT} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Travel_Office" ? (
                <>
                  <Switch>
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
                      path="/my-event-requests"
                      exact
                      component={MyHomeRequests}
                    />
                    <ProtectedRoute
                      path="/event-request-details"
                      exact
                      component={HomeRequestDetails}
                    />
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
