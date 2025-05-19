import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "./Navbar.css";
import Logo from "../Assets/BUE-Logo.png";
import Logout from "../Login/Logout";
import { useHistory } from "react-router-dom";

const Menu = () => {
  const history = useHistory();

  return (
    <div className="HeaderStiky">
      <Router>
        <Navbar bg="light" expand="lg" sticky="top">
          <Navbar.Brand
            style={{ color: "black", cursor: "pointer" }}
            onClick={() => history.push("/dashboard/#/")}
          >
            <img
              src={Logo}
              alt="logo"
              width="110px"
              height="600px"
              className="img-fluid"
              style={{ marginTop: 5 }}
            />
            <div className="navbar-center">
              {/* <span className="navbar-system-name">
                <span
                  style={{ fontSize: "38px", paddingTop: "20px" }}
                  className="navbar-uni"
                >
                  Uni
                </span>
                <span
                  style={{ fontSize: "38px", paddingTop: "20px" }}
                  className="navbar-it"
                >
                  E
                </span>
                <span
                  style={{ fontSize: "38px", paddingTop: "20px" }}
                  className="navbar-raw"
                >
                  ve
                </span>
              </span> */}
            </div>
          </Navbar.Brand>
          <div className="toggle-container">
            <Navbar.Toggle aria-controls="basic-navbar-nav">
              <span className="fa fa-bars" style={{ color: "black" }}></span>
            </Navbar.Toggle>
          </div>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav className="ml-auto">
              <Logout />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Router>
    </div>
  );
};

export default Menu;
