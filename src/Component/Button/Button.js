import React from "react";
import "./Button.css";
//import Button from '@material-ui/core/Button';

const button = (props) => {
  let styleClass = "";

  switch (props.btnType) {
    case "ViewBtn":
      styleClass = "btn btn-danger btn-sm";
      break;
    case "saveBtn":
      styleClass = "btn btn-outline-danger btn-sm";
      break;
    default:
      styleClass = "btn btn-success btn-sm";
  }

  return (
    <button className={styleClass} onClick={props.clicked} {...props.disabled}>
      {props.children}
    </button>
  );
};

export default button;
