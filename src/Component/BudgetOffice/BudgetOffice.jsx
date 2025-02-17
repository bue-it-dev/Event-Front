import React from "react";
import BudgetOfficeTabs from "./BudgetOfficeTabs";
import { useHistory } from "react-router-dom"; // useHistory instead of useNavigate for v5
const BudgetOffice = () => {
  const history = useHistory(); // useHistory hook
  React.useEffect(() => {
    history.push("/business-request-list-budget-office");
  }, [history]);
  return (
    <div>
      {/* <h4>Budget Office Portal</h4> */}
      <BudgetOfficeTabs />
    </div>
  );
};

export default BudgetOffice;
