import React from "react";
import "./Page404.css";
import { Link } from "react-router-dom";
import Logo from "../Assets/BUE-Logo.png";

export default function Page404() {
  return (
    <React.Fragment>
      <div className="container-fluid">
        {/*   <Cover_Photo FirstTitle="Page Not Found"   /> */}

        <br />
        <br />
        <img
          src={Logo}
          width="25%"
          height="25%"
          alt="404 Page Not Found !"
          title="404 Page Not Found "
        />
        <br />
        <br />
        <h2>This Page Not Found !</h2>
        <h5>Sorry, we weren't able to find the page you're looking for !</h5>
        <br />
        <button>
          {" "}
          <Link to="/dashboard" className="buttonHome">
            Go Back To Home
          </Link>
        </button>
        <br />
        <br />
        <br />
        <br />
      </div>
    </React.Fragment>
  );
}
