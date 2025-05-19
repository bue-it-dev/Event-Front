import React from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import URL from "../Util/config";
import "./Header.css";
const Header = () => {
  const [isLoading, setisLoading] = React.useState(true);
  const [error, seterror] = React.useState(false);
  const [userData, SetuserData] = React.useState([]);
  const userToken = localStorage.getItem("accessToken");
  const GetUserInfo = () => {
    var data = "";
    var config = {
      method: "Get",
      url: `${URL.BASE_URL}/api/UserRole/GetEmployeeDetails`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        SetuserData(response.data);
        setisLoading(false);
      })
      .catch(function (error) {});
  };
  React.useEffect(() => {
    GetUserInfo();
  }, []);
  return error === false ? (
    isLoading === true ? (
      <div className="container-fluid">
        <div className="row1">
          <div className="col1">
            {" "}
            <ReactLoading
              type="bars"
              color="black"
              height="250px"
              width="250px"
            />
          </div>
        </div>
        <br />
        <br />
      </div>
    ) : (
      <React.Fragment>
        <div className="container-fluid">
          <div className="frame">
            {/* <section style={{ textAlign: "left", marginBottom: "4px" }}>
              <i class="fa fa-id-badge" aria-hidden="true"></i> &nbsp;&nbsp;
              {userData.code}
              {" - "}{" "}
              {userData.fullName == "Youssef Youssef ."
                ? "Youssef Youssef"
                : userData.fullName}
            </section> */}
            <section style={{ textAlign: "left", marginBottom: "4px" }}>
              <i class="fa fa-user" aria-hidden="true"></i> &nbsp;&nbsp;
              {userData.code}
              {" - "}{" "}
              {userData.fullName == "Youssef Youssef ."
                ? "Youssef Youssef"
                : userData.fullName}
            </section>
            <section style={{ textAlign: "left", marginBottom: "4px" }}>
              <i class="fa fa-envelope" aria-hidden="true"></i> &nbsp;&nbsp;
              {userData.username + "@bue.edu.eg"}
            </section>
            <section style={{ textAlign: "left", marginBottom: "4px" }}>
              <i class="fa fa-building" aria-hidden="true"></i> &nbsp;&nbsp;
              {userData.jobName}
              {" - "}
              {userData.departmentName}
            </section>
            {/* <section style={{ textAlign: "left", marginBottom: "4px" }}>
              <i class="fa fa-briefcase" aria-hidden="true"></i> &nbsp;&nbsp;
              {userData.jobName}
            </section> */}
          </div>
          <br />
        </div>
      </React.Fragment>
    )
  ) : (
    <div className="">
      <h1>
        <strong>Error 404: User Not Allowed</strong>
      </h1>
    </div>
  );
};
export default Header;
