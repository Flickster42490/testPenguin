import React, { Component } from "react";
import {
  Nav,
  NavbarBrand,
  NavLink,
  NavbarToggler,
  NavItem,
  Badge
} from "reactstrap";
import { hashHistory } from "react-router";
import FontAwesome from "react-fontawesome";

import Users from "../../images/users.svg";
import Assignment from "../../images/assignment.svg";
import Alert from "../../images/alert.svg";
import HeaderDropdown from "./HeaderDropdown";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "candidates"
    };
  }

  componentWillMount() {
    if (this.state.page !== window.location.hash.split("/")[1])
      this.setState({
        page: window.location.hash.split("/")[1]
      });
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-hidden");
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-minimized");
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-mobile-show");
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("aside-menu-hidden");
  }

  handleClick(e) {
    this.setState(
      {
        page: e
      },
      () => {
        hashHistory.push(`dashboard/${e}`);
      }
    );
  }

  render() {
    return (
      <header className="app-header navbar">
        {/* <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler> */}
        <NavbarBrand href="#" />
        {/* <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler> */}
        {/* <Nav className="d-md-down-none" navbar>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("candidates")}
          >
            <img src={Users} />
            <br />
            <span className={this.state.page === "candidates" ? "bold" : ""}>
              Candidates
            </span>
          </NavItem>
          <NavItem className="px-3" onClick={() => this.handleClick("tests")}>
            <img src={Assignment} />
            <br />
            <span className={this.state.page === "tests" ? "bold" : ""}>
              Tests
            </span>
          </NavItem>
        </Nav> */}
        <Nav className="ml-auto" navbar>
          {/* on the right side */}
          {/* <NavItem className="d-md-down-none">
            <a href="#">Upgrade Today</a>
          </NavItem>
          <NavItem className="d-md-down-none">
            <a href="#">
              <img src={Alert} />
              <Badge pill color="danger">
                5 days left
              </Badge>
            </a>
          </NavItem> */}
          <NavItem className="d-md-down-none" />
          <HeaderDropdown />
          &nbsp;&nbsp;&nbsp;
        </Nav>
      </header>
    );
  }
}

export default Header;