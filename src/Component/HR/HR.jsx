import React from "react";
import HRTabs from "./HRTabs";
import { useHistory } from "react-router-dom"; // useHistory instead of useNavigate for v5
const HR = () => {
  const history = useHistory(); // useHistory hook
  React.useEffect(() => {
    history.push("/home-request-list-hr");
  }, [history]);
  return (
    <div>
      {/* <h4>Human Resources Portal</h4> */}
      <HRTabs />
    </div>
  );
};

export default HR;
