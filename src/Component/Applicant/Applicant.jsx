import React from "react";
import ApplicantTabs from "./ApplicantTabs";
import { useHistory } from "react-router-dom"; // useHistory instead of useNavigate for v5

const Applicant = () => {
  const history = useHistory(); // useHistory hook
  React.useEffect(() => {
    history.push("/Event-request");
  }, [history]);
  return (
    <div>
      {/* <h3>Requester Portal</h3> */}

      <ApplicantTabs />
    </div>
  );
};

export default Applicant;
