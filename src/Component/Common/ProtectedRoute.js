import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser } from "../Util/Authenticate";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  //console.log("Shaaban Debug", Authenticate.getCurrentUser());
  //console.log("Ya current user", getCurrentUser());
  return (
    <Route
      {...rest}
      render={(props) => {
        if (getCurrentUser() === null) {
          //console.log("Mafysh User Loggged in ysta");
          return <Redirect to="/" />;
        } else {
          //console.log("Fy User Loggged in ysta");
          return Component ? <Component {...props} /> : render(props);
        }
      }}
    />
  );
};

export default ProtectedRoute;
