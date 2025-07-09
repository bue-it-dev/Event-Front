import React, { useState } from "react";
import "./login.css";
import BUELogo from "../Assets/BUE-Logo.png";
import { Link, Redirect } from "react-router-dom";
import { login, saveTokenToLocalStorage } from "../Util/Authenticate";
import jwt from "jwt-decode";
import { useUser } from "../Entities";
import { toast } from "react-toastify";

const Login = () => {
  const [isLoading, setisLoading] = React.useState(true);
  React.useEffect(() => {
    setisLoading(false);
  }, []);
  const [user, { setUser }] = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  if (user.loggedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div>
      <React.Fragment>
        <form className="form-signin" autoComplete="off">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-8 col-xl-10">
              <div className="container" style={{ minHeight: 500 }}>
                <div className="card-home card-container-home">
                  <div className="row justify-content-center">
                    <img
                      alt="BUE Logo"
                      height="190px"
                      id="form-img"
                      className="form-img-card"
                      src={BUELogo}
                    />
                  </div>
                  <hr className="solid" />
                  <div className="mr-5">
                    <div className="floating-label">
                      <input
                        className="floating-input inputmargin"
                        type="text"
                        id="inputEmail"
                        placeholder="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        name="username"
                        required
                        autoComplete="off"
                      />
                      <label className="label-login" htmlFor="email">
                        <b>Username</b>
                      </label>
                    </div>

                    <div className="floating-label">
                      <input
                        className="floating-input inputmargin"
                        type="password"
                        id="inputPassword"
                        name="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <label className="label-login" htmlFor="password">
                        <b>Password</b>
                      </label>
                    </div>
                  </div>
                  <hr className="solid" />
                  <button
                    type="button"
                    className="btn btn-lg btn-primary btn-block btn-signin"
                    style={{ marginLeft: "0px", backgroundColor: "#57636f" }}
                    data-target="#sign-in-modal"
                    id="sign-in-btn"
                    data-dismiss="modal"
                    disabled={isLoading}
                    onClick={async () => {
                      try {
                        setisLoading(true);
                        const userObj = await login({ username, password });
                        saveTokenToLocalStorage(userObj.accessToken);
                        const decodedToken = jwt(userObj.accessToken);
                        const roles = {
                          1: "HOD",
                          2: "VCB",
                          3: "Public Affairs",
                          4: "Office of The President",
                          5: "Budget Office",
                          6: "Marcom",
                          7: "IT",
                          8: "Transportation",
                          9: "Accommodation",
                          10: "Campus",
                          11: "Security",
                          12: "HSE",
                          13: "Business Operation Manager",
                          14: "Estates and Facilities Executive Director",
                          15: "COO",
                          16: "Staff",
                          17: "Maintenance",
                          18: "Medical Service",
                        };
                        setUser({
                          ...user,
                          loggedIn: true,
                          userId: decodedToken.userId,
                          RoleID: decodedToken.RoleID,
                          type: roles[decodedToken.RoleID],
                        });
                        setisLoading(false);
                        // alert("Login Successfully");
                      } catch (err) {
                        console.log("ERR", err);
                        setisLoading(false);
                        // alert("Login Failed, Check username and password");
                        toast.error(
                          "Login Failed, Check username and password",
                          {
                            position: "top-center",
                          }
                        );
                      }
                    }}
                  >
                    {isLoading ? "Logging In..." : "Login"}
                  </button>
                </div>
                <br />
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    </div>
  );
};

export default Login;
