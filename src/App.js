import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import Login from "./Component/Login/login";
import Applicant from "./Component/Applicant/Applicant";
import AddHomeTravel from "./Component/Applicant/AddEventRequest";
import MyEventRequests from "./Component/Applicant/MyEventRequests";
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
import EventRequestDetails from "./Component/Applicant/EventRequestDetails";
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
import AckAfterBudget from "./Component/AckAfterBudget/AckAfterBudget";
import Accommodation from "./Component/Accommodation/Accommodation";
import PublicAffairs from "./Component/PublicAffairs/PublicAffairs";
import ITEventList from "./Component/IT/ITEventList";
import Details from "./Component/IT/Details";
import SecurityCheck from "./Component/SecurityCheck/SecurityCheck";
import SecurityCheckEventList from "./Component/SecurityCheck/SecurityCheckEventList";
import SecurityCheckEventDetails from "./Component/SecurityCheck/SecurityCheckEventDetails";
import EventDetailsPublicAffairs from "./Component/PublicAffairs/EventDetailsPublicAffairs";
import EventListPublicAffairs from "./Component/PublicAffairs/EventListPublicAffairs";
import EventListAccommodation from "./Component/Accommodation/EventListAccommodation";
import EventDetailsAccommodation from "./Component/Accommodation/EventDetailsAccommodation";
import EventListTransportation from "./Component/Transportation/EventListTransportation";
import EventDetailsTransportation from "./Component/Transportation/EventDetailsTransportation";
import Transportation from "./Component/Transportation/Transportation";
import EventListAckAfterBudget from "./Component/AckAfterBudget/EventListAckAfterBudget";
import EventDetailsAckAfterBudget from "./Component/AckAfterBudget/EventDetailsAckAfterBudget";
import EventListBOM from "./Component/BOM/EventListBOM";
import EventDetailsBOM from "./Component/BOM/EventDetailsBOM";
import EventDetailsCOO from "./Component/COO/EventDetailsCOO";
import EAF from "./Component/EAF/EAF";
import EventListEAF from "./Component/EAF/EventListEAF";
import EventDetailsEAF from "./Component/EAF/EventDetailsEAF";
import MyEventListEAF from "./Component/EAF/MyEventListEAF";
import EventAddEAF from "./Component/EAF/EventAddEAF";
import MyEventDetailsEAF from "./Component/EAF/MyEventDetailsEAF";
import AdminMyEventRequetDetails from "./Component/Admin/AdminMyEventRequetDetails";
import MyEventDetailsVCB from "./Component/VCB/MyEventDetailsVCB";
import MyEventDetailsPRE from "./Component/President/MyEventDetailsPRE";
import COOAllRequestsDetails from "./Component/COO/COOAllRequestsDetails";
import COOAllEventRequestsList from "./Component/COO/COOAllEventRequestsList";
import BOMAllRequestsDetails from "./Component/BOM/BOMAllRequestsDetails";
import BOMAllEventRequestsList from "./Component/BOM/BOMAllEventRequestsList";
import Marcom from "./Component/Marcom/Marcom";
import MAREventDetails from "./Component/Marcom/MAREventDetails";
import MAREventList from "./Component/Marcom/MAREventList";
// import MARCOMTabs from "./Component/Marcom/MARCOMTabs";
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
                    : user.type === "Office of The President"
                    ? President
                    : user.type === "Business Operation Manager"
                    ? BOM
                    : user.type === "COO"
                    ? COO
                    : user.type === "Marcom"
                    ? Marcom
                    : user.type === "Budget Office"
                    ? BudgetOffice
                    : user.type === "IT"
                    ? IT
                    : user.type === "SecurityCheck"
                    ? SecurityCheck
                    : user.type === "Public Affairs"
                    ? PublicAffairs
                    : user.type === "Accommodation"
                    ? Accommodation
                    : user.type === "Transportation"
                    ? Transportation
                    : user.type === "Estates and Facilities Executive Director"
                    ? EAF
                    : user.type === "Campus" ||
                      user.type === "Security" ||
                      user.type === "HSE"
                    ? AckAfterBudget
                    : Applicant
                }
              />
              {user.type === "HOD" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/all-event-request-list-bom"
                      component={BOMAllEventRequestsList}
                    />
                    <ProtectedRoute
                      path="/all-event-request-details-bom"
                      component={BOMAllRequestsDetails}
                    />
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
                    <ProtectedRoute
                      path="/hod-my-event-request-details"
                      component={AdminMyEventRequetDetails}
                    />
                    <ProtectedRoute
                      path="/event-approval-list-bom"
                      component={EventListBOM}
                    />
                    <ProtectedRoute
                      path="/event-details-bom"
                      component={EventDetailsBOM}
                    />
                    <ProtectedRoute
                      path="/event-approval-list-eaf"
                      component={EventListEAF}
                    />
                    <ProtectedRoute
                      path="/event-request-details-eaf"
                      component={EventDetailsEAF}
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
                          path="/event-request-list-coo"
                          component={BusinessRequestListCOO}
                        />
                        <ProtectedRoute
                          path="/event-request-details-coo"
                          component={EventDetailsCOO}
                        />
                        <ProtectedRoute
                          path="/all-event-request-list-coo"
                          component={COOAllEventRequestsList}
                        />
                        <ProtectedRoute
                          path="/all-event-request-details-coo"
                          component={COOAllRequestsDetails}
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
                        <ProtectedRoute
                          path="/event-my-request-details-vcb"
                          component={MyEventDetailsVCB}
                        />
                        <Route path="/" exact component={VCB} />
                        <Route path="*" exact component={Page404} />
                      </Switch>
                    </>
                  ) : (
                    <>
                      <Switch>
                        <ProtectedRoute
                          path="/event-request-list-coo"
                          component={BusinessRequestListCOO}
                        />
                        <ProtectedRoute
                          path="/event-request-details-coo"
                          component={EventDetailsCOO}
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
                        <ProtectedRoute
                          path="/event-my-request-details-vcb"
                          component={MyEventDetailsVCB}
                        />
                        <Route path="/" exact component={VCB} />
                        <Route path="*" exact component={Page404} />
                      </Switch>
                    </>
                  )}
                </>
              ) : user.type === "Office of The President" ? (
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
                    <ProtectedRoute
                      path="/event-my-request-details-president"
                      component={MyEventDetailsPRE}
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
              ) : user.type === "Business Operation Manager" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/all-event-request-list-bom"
                      component={BOMAllEventRequestsList}
                    />
                    <ProtectedRoute
                      path="/all-event-request-details-bom"
                      component={BOMAllRequestsDetails}
                    />
                    <ProtectedRoute
                      path="/event-approval-list-bom"
                      component={EventListBOM}
                    />
                    <ProtectedRoute
                      path="/event-details-bom"
                      component={EventDetailsBOM}
                    />
                    <Route path="/" exact component={BOM} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "COO" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/all-event-request-list-coo"
                      component={COOAllEventRequestsList}
                    />
                    <ProtectedRoute
                      path="/all-event-request-details-coo"
                      component={COOAllRequestsDetails}
                    />
                    <ProtectedRoute
                      path="/event-request-list-coo"
                      component={BusinessRequestListCOO}
                    />
                    <ProtectedRoute
                      path="/event-request-details-coo"
                      component={EventDetailsCOO}
                    />
                    <Route path="/" exact component={COO} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Budget Office" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/event-request-list-budget-office"
                      component={BOEventList}
                    />
                    <ProtectedRoute
                      path="/event-request-details-budget-office"
                      component={BOEventDetails}
                    />
                    <Route path="/" exact component={BudgetOffice} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Marcom" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/event-request-list-marcom"
                      component={MAREventList}
                    />
                    <ProtectedRoute
                      path="/event-request-details-marcom"
                      component={MAREventDetails}
                    />
                    <Route path="/" exact component={Marcom} />
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
                    <ProtectedRoute path="/event-details" component={Details} />

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
              ) : user.type === "SecurityCheck" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/event-approval-list-security-check"
                      component={SecurityCheckEventList}
                    />
                    <ProtectedRoute
                      path="/event-details-security-check"
                      component={SecurityCheckEventDetails}
                    />
                    <Route path="/" exact component={SecurityCheck} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Public Affairs" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/event-approval-list-public-affairs"
                      component={EventListPublicAffairs}
                    />
                    <ProtectedRoute
                      path="/event-details-public-affairs"
                      component={EventDetailsPublicAffairs}
                    />
                    <Route path="/" exact component={PublicAffairs} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Accommodation" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/event-approval-list-accommodation"
                      component={EventListAccommodation}
                    />
                    <ProtectedRoute
                      path="/event-details-accommodation"
                      component={EventDetailsAccommodation}
                    />
                    <Route path="/" exact component={Accommodation} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Transportation" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/event-approval-list-transportation"
                      component={EventListTransportation}
                    />
                    <ProtectedRoute
                      path="/event-details-transportation"
                      component={EventDetailsTransportation}
                    />
                    <Route path="/" exact component={Transportation} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Estates and Facilities Executive Director" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/event-approval-list-eaf"
                      component={EventListEAF}
                    />
                    <ProtectedRoute
                      path="/event-request-details-eaf"
                      component={EventDetailsEAF}
                    />
                    <ProtectedRoute
                      path="/add-event-request-eaf"
                      exact
                      component={EventAddEAF}
                    />
                    <ProtectedRoute
                      path="/my-event-request-eaf"
                      exact
                      component={MyEventListEAF}
                    />
                    <ProtectedRoute
                      path="/my-event-request-details-eaf"
                      exact
                      component={MyEventDetailsEAF}
                    />
                    <Route path="/" exact component={EAF} />
                    <Route path="*" exact component={Page404} />
                  </Switch>
                </>
              ) : user.type === "Campus" ||
                user.type === "Security" ||
                user.type === "HSE" ? (
                <>
                  <Switch>
                    <ProtectedRoute
                      path="/event-approval-list-ack"
                      component={EventListAckAfterBudget}
                    />
                    <ProtectedRoute
                      path="/event-details-ack"
                      component={EventDetailsAckAfterBudget}
                    />
                    <Route path="/" exact component={AckAfterBudget} />
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
                      component={MyEventRequests}
                    />
                    <ProtectedRoute
                      path="/event-request-details"
                      exact
                      component={EventRequestDetails}
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
      <ToastContainer
        position="top-center" // Toast will appear at bottom-left
        autoClose={2000} // Auto close after 2 seconds
        hideProgressBar={true} // Hide the progress bar
        icon={false} // Disable all icons globally
        closeOnClick={true} // Toast closes when clicked
      />
    </Router>
  );
}

export default App;
