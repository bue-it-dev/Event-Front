import React, { useState } from "react";
import axios from "axios";
import Button from "../Button/Button";
import ActionModal from "../ActionModal/ActionModal";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Person from "../Assets/person.png";
import URL from "../Util/config";
import "./UserProfile.css";
const UserProfile = (props) => {
  const [isLoading, setisLoading] = React.useState(true);
  const userData = props.UserData;
  const [newValues, setNewValues] = useState({
    username: userData.username,
    email: userData.email,
    roleId: userData.roleId,
  });
  const [passwordValue, setpasswordValue] = useState({
    password: userData.password,
  });
  const [open, setOpen] = React.useState(false);
  const [passwordopen, setPasswordOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setNewValues({
      username: userData.username,
      email: userData.email,
      roleId: userData.roleId,
    });
  };
  const handlePassswordClickOpen = () => {
    setPasswordOpen(true);
    setpasswordValue({
      password: userData.password,
    });
  };
  const handlePassswordClickClose = () => {
    setPasswordOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleView = async (newData) => {
    try {
      await axios
        .put(
          `${URL.BASE_URL}/api/Users/UpdateUserData?userId=${userData.userId}`,
          {
            userId: newData.userId,
            username: newData.username,
            email: newData.email,
            roleId: newData.roleId,
          }
        )
        .then((response) => {
          //console.log("Response: " + response);
          try {
            //console.log('Response: ' + response)
            // if(response.statuscode !== 200)
            // {
            //   alert("Error in Updating Data");
            // }
            alert("Updates Occured Successfully");
            setOpen(false);
          } catch (err) {
            //console.log('Response: ' + response)
            alert("Error in Updating Data");
          }
        });
    } catch (err) {
      // //console.log('Response: ' + response)
      alert("Error in Updating Data");
    }
    //console.log('Response: ');
  };
  const handlePasswordView = (newData2) => {
    try {
      setisLoading(true);
      axios
        .put(
          `${URL.BASE_URL}/api/Users/ChangeMyPassword?userId=${userData.userId}`,
          {
            password: newData2.password,
          }
        )
        .then((response) => {
          setisLoading(false);
          alert("Password Occured Successfully");
          setPasswordOpen(false);
          //console.log('Response: ' + response.data.item)
        });
    } catch (err) {
      setisLoading(false);
      alert("Error in Updating Password");
    }
  };
  React.useEffect(() => {
    setisLoading(false);
  }, []);
  return (
    <div>
      <Tooltip title="View User">
        <Button btnType="saveBtn" clicked={handleClickOpen}>
          <img
            src={Person}
            alt="logo"
            width="50px"
            height="600px"
            className="img-fluid"
            style={{ marginTop: 5 }}
          />
        </Button>
      </Tooltip>
      <ActionModal
        title="User Profile"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            disabled
            readonly
            value={newValues.username}
          />
          <TextField
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            value={newValues.email}
            disabled
            // onChange={event => {
            //   setNewValues({
            //     ...newValues,
            //     email: event.target.value
            //   });
            // }}
          />
          <Button btnType="saveBtn" clicked={() => handlePassswordClickOpen()}>
            Generate New Password
          </Button>
          {passwordopen == true ? (
            <div class="form-outline mb-4">
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                value={passwordValue.password}
                onChange={(event) => {
                  setpasswordValue({
                    ...passwordValue,
                    password: event.target.value,
                  });
                }}
              />
              <Button
                btnType="saveBtn"
                clicked={() => handlePasswordView(passwordValue)}
                disabled={isLoading}
              >
                {isLoading == true ? "Changing Password..." : "Change Password"}
              </Button>
              <Button
                btnType="saveBtn"
                clicked={() => handlePassswordClickClose()}
              >
                Cancel
              </Button>
            </div>
          ) : null}
        </DialogContent>
        {/* <DialogActions>
          <Button btnType="saveBtn" clicked={handleClose}>
            Cancel
          </Button>
          <Button btnType="saveBtn" clicked={() => handleView(newValues)}>
            Change
          </Button>
        </DialogActions> */}
      </ActionModal>
    </div>
  );
};

export default UserProfile;
