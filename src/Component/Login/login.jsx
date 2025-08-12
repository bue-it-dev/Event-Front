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
                      height="150px"
                      id="form-img"
                      className="form-img-card"
                      src={BUELogo}
                    />
                  </div>
                  {/* Header */}
                  <h6 className="text-center mb-4 mt-4 font-weight-bold">
                    Sign in to Your Event System
                  </h6>
                  <hr className="solid" />
                  <div className="mb-4">
                    <div
                      // className="card shadow-lg p-4 border-0"
                      style={{
                        maxWidth: "300px",
                        margin: "auto",
                      }}
                    >
                      {/* Username */}
                      <div className="form-group floating-label-group">
                        <input
                          type="text"
                          className="form-control"
                          id="inputEmail"
                          placeholder=" "
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          autoComplete="off"
                          autoFocus
                        />
                        <label htmlFor="inputEmail">
                          <b>Username</b>
                        </label>
                      </div>

                      {/* Password */}
                      <div className="form-group floating-label-group">
                        <input
                          type="password"
                          className="form-control"
                          id="inputPassword"
                          placeholder=" "
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label htmlFor="inputPassword">
                          <b>Password</b>
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr className="solid" />
                  <button
                    type="button"
                    className="btn btn-lg btn-primary d-block mx-auto btn-signin"
                    style={{
                      backgroundColor: "#57636f",
                      width: "200px", // narrower width
                    }}
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
                          19: "Event Office",
                        };
                        setUser({
                          ...user,
                          loggedIn: true,
                          userId: decodedToken.userId,
                          RoleID: decodedToken.RoleID,
                          type: roles[decodedToken.RoleID],
                        });
                        setisLoading(false);
                      } catch (err) {
                        console.log("ERR", err);
                        setisLoading(false);
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
