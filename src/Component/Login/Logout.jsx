import React from "react";
import { useUser } from "../Entities/";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import { deleteTokenFromLocalStorage } from "../Util/Authenticate";
const Logout = (props) => {
  const [user, { setUser }] = useUser();
  let history = useHistory();

  return (
    <React.Fragment>
      <div className="mt-2 mb-0">
        <ul id="items" className=" " style={{ marginBottom: "-14px" }}>
          <div className="col-md-12">
            <div className="row justify-content-end">
              <div className="col-auto">
                <li>
                  <h5>
                    {" "}
                    <IconButton
                      style={{
                        zoom: 1,
                        cursor: "Pointer",
                        color: "#d73738",
                        fontSize: "30px",
                      }}
                      className="fas fa-sign-out-alt "
                      aria-label="logout"
                      title="logout"
                      onClick={(e) => {
                        deleteTokenFromLocalStorage();
                        window.location.reload();
                        //history.push("/login");
                      }}
                    />
                    &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  </h5>
                </li>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </React.Fragment>
  );
};

export default Logout;
