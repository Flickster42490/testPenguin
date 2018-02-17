import React, { Component } from "react";
import { Nav, NavbarBrand, NavbarToggler, NavItem, Badge } from "reactstrap";
import FontAwesome from "react-fontawesome";

import Users from "../../images/users.svg";
import Assignment from "../../images/assignment.svg";
import Alert from "../../images/alert.svg";
import HeaderDropdown from "./HeaderDropdown";

class Header extends Component {
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

  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        <NavbarBrand href="#" />
        <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <a href="#/candidates">
              <img src={Users} />
              <br />
              Candidates
            </a>
          </NavItem>
          <NavItem className="px-3">
            <a href="#/tests">
              <img src={Assignment} />
              <br />Tests
            </a>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          {/* on the right side */}
          <NavItem className="d-md-down-none">
            <a href="#">Upgrade Today</a>
          </NavItem>
          <NavItem className="d-md-down-none">
            <a href="#">
              <img src={Alert} />
              <Badge pill color="danger">
                5 days left
              </Badge>
            </a>
          </NavItem>
          <NavItem className="d-md-down-none" />
          <HeaderDropdown />
          &nbsp;&nbsp;&nbsp;
        </Nav>
      </header>
    );
  }
}

export default Header;
