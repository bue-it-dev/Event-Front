import "./login.css";
import BUELogo from "../Assets/BUE-Logo.png";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { AddNewUser } from "../Requests/mutators";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import URL from "../Util/config";
const schema = yup.object().shape({
  username: yup
    .string()
    .required("*Please enter a vaild Username.")
    .matches(/^[a-zA-Z\s0-9]*$/, "*Wrong Format: Only letters Allowed"),
  email: yup
    .string()
    .email("*Email is not valid")
    .required("*Please enter your email address."),
  password: yup
    .string()
    .required("*Please enter your Password.")
    .matches(
      /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,10}$/,
      "*Wrong Format: Maximum ten characters, at least one letter and one number"
    ),
});

const SignUp = () => {
  const [isLoading, setisLoading] = React.useState(true);
  const { register, handleSubmit } = useForm({
    validationSchema: schema,
    mode: "onBlur",
    submitFocusError: true,
    reValidateMode: "onChange",
  });
  const [userData, setUserData] = useState({
    userId: 0,
    username: "",
    email: "",
    password: "",
    roleId: 0,
    roleName: "",
    isAvaliable: 1,
  });
  const onSubmit = async () => {
    try {
      //console.log("I Am Here in the OnSubmit Function");
      setisLoading(true);
      await AddNewUser(userData);
      setisLoading(false);
      window.location.replace(`${URL.BASE_URL}/CCCS/#/login`);
      alert("Account Created Successfully, Please Login");
    } catch (err) {
      alert("Error while Creating your Account, Please Try Again");
      setisLoading(false);
    }
  };
  React.useEffect(() => {
    setisLoading(false);
  }, []);
  return (
    <div>
      <React.Fragment>
        <ValidatorForm
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
              <br></br>
              <h4>Sign Up</h4>
              <hr class="solid"></hr>
              <p id="profile-name" className="profile-name-card"></p>
              <div className="mr-5 w-100">
                <div className="form-outline w-100 mb-4">
                  <TextValidator
                    type="text"
                    placeholder="Username"
                    className="w-100"
                    value={userData.username}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        username: e.target.value,
                      });
                    }}
                    validators={["required", "isString"]}
                    errorMessages={[
                      "This Field is required",
                      "Wrong Format: Please Enter a Valid Username (e.g: User.Name)",
                    ]}
                    name="username"
                    label="Username"
                  />
                </div>
                <div className="form-outline w-100 mb-4">
                  <TextValidator
                    type="email"
                    placeholder="Email Address"
                    className="w-100"
                    value={userData.email}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        email: e.target.value,
                      });
                    }}
                    validators={["required", "isEmail"]}
                    errorMessages={[
                      "This Field is required",
                      "Wrong Format: Please Enter a Valid Email Address (e.g: email@mail.com)",
                    ]}
                    name="email"
                    label="Email Address"
                  />
                </div>
                <div className="form-outline w-100 mb-4">
                  <TextValidator
                    type="password"
                    placeholder="Password"
                    className="w-100"
                    value={userData.password}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        password: e.target.value,
                      });
                    }}
                    validators={["required"]}
                    errorMessages={["This Field is required"]}
                    name="password"
                    label="Password"
                  />
                </div>
              </div>
              <br></br>
              <button
                className="btn btn-lg btn-primary btn-block btn-signin"
                type="submit"
                value="Submit"
                id="submit"
                disabled={isLoading}
              >
                {isLoading == true ? "Signing Up..." : "Sign Up"}
              </button>
              <br></br>
              <hr class="solid"></hr>
              <Link to="/login">
                <strong>Already A Member</strong>
              </Link>
              <br></br>
            </div>
            <br></br>
          </div>
        </ValidatorForm>
      </React.Fragment>
    </div>
  );
};

export default SignUp;
