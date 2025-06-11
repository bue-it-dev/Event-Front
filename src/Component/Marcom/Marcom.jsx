import React from "react";
import MARCOMTabs from "./MARCOMTabs";
import { useHistory } from "react-router-dom"; // useHistory instead of useNavigate for v5
const Marcom = () => {
  const history = useHistory(); // useHistory hook
  React.useEffect(() => {
    history.push("/event-request-list-marcom");
  }, [history]);
  return (
    <div>
      {/* <h4>Budget Office Portal</h4> */}
      <MARCOMTabs />
    </div>
  );
};

export default Marcom;
