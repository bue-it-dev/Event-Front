import React from "react";
import "./Button.css";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const button = (props) => {
  let variant = "";
  let color = "";

  switch (props.btnType) {
    case "viewBtn":
      variant = "outlined";
      color = "secondary";
      break;
    case "ViewBtn":
      variant = "contained";
      color = "secondary";
      break;
    default:
      variant = "contained";
  }

  return (
    <Button
      {...props}
      variant={variant}
      color={color}
      component={Link}
      to={props.linkto}
      onClick={props.clicked}
      {...props.disabled}
    >
      {props.children}
    </Button>
  );
};

export default button;
