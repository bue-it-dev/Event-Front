import React from "react";
import { useHistory } from "react-router-dom"; // useHistory instead of useNavigate for v5
import ITTabs from "./ITTabs";
const IT = () => {
  const history = useHistory(); // useHistory hook
  React.useEffect(() => {
    history.push("/event-request-list-IT");
  }, [history]);
  return (
    <div>
      {/* <h4>Budget Office Portal</h4> */}
      <ITTabs />
    </div>
  );
};

export default IT;
