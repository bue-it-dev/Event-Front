import "./login.css";
import BUELogo from "../Assets/BUE-Logo.png";
import React, { useState } from "react";
import { ForgotYourPassword } from "../Requests/mutators";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import URL from "../Util/config";
const ForgottenPassword = () => {
  const [isLoading, setisLoading] = React.useState(true);
  const { register, handleSubmit } = useForm({
    //validationSchema: schema,
    mode: "onBlur",
    submitFocusError: true,
    reValidateMode: "onChange",
  });
  const [userData, setUserData] = useState({
    email: "",
  });
  const onSubmit = async () => {
    try {
      //console.log("Username Entered",userData);
      setisLoading(true);
      await ForgotYourPassword(userData.email);
      setisLoading(false);
      window.location.replace(`${config.BASE_URL}/CCCS/#/login`);
      alert("Reset Password Email Sent");
    } catch (err) {
      alert("Error while Resetting your password, Email not found");
    }
  };
  React.useEffect(() => {
    setisLoading(false);
  }, []);
  return (
    <div>
      <React.Fragment>
        <form
          className="form-signin"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="container" style={{ minHeight: 500 }}>
            <div className="card-home card-container-home">
              <div className="row ">
                <img
                  alt="BUE Logo"
                  id="form-img"
                  className="form-img-card "
                  src={BUELogo}
                />
              </div>
              <p id="profile-name" className="profile-name-card"></p>
              <div className="mr-5">
                <div className="floating-label">
                  <input
                    className="floating-input inputmargin"
                    type="email"
                    id="inputEmail"
                    placeholder="Email Address"
                    autoFocus
                    value={userData.email}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        email: e.target.value,
                      });
                    }}
                    name="email"
                    inputRef={register}
                    required
                    autoComplete="off"
                  />
                  <label className="label-login" htmlFor="email">
                    <b>Please Enter Your Email Address</b>
                  </label>
                </div>
              </div>
              <button
                className="btn btn-lg btn-primary btn-block btn-signin"
                type="submit"
                disabled={isLoading}
              >
                {isLoading == true
                  ? "Generating Password..."
                  : "Generate New Password"}
              </button>
            </div>
            <br></br>
          </div>
        </form>
      </React.Fragment>
    </div>
  );
};

export default ForgottenPassword;
