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
import localForage from "localforage";
import axios from "axios";

import Users from "../../images/users.svg";
import Assignment from "../../images/assignment.svg";
import Folder from "../../images/folder.svg";
import Alert from "../../images/alert.svg";
import Screen from "../../images/screen.svg";
import Lock from "../../images/lock.svg";
import Add from "../../images/add.svg";
import Library from "../../images/library.svg";
import NewFolder from "../../images/new-folder.svg";
import HeaderDropdown from "./HeaderDropdown";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "candidates",
      user: undefined
    };
  }

  componentWillMount() {
    localForage.getItem("userId").then(id => {
      axios.get(`/users/${id}`).then(u => {
        if (this.state.page !== window.location.hash.split("/")[1]) {
          this.setState({
            page: window.location.hash.split("/")[1],
            user: u.data[0]
          });
        } else {
          this.setState({
            user: u.data[0]
          });
        }
      });
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
    console.log(this.state.user);
    return (
      <header className="app-header navbar">
        {/* <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler> */}
        <NavbarBrand href="#" />
        {/* <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler> */}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Nav className="d-md-down-none" navbar>
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
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("tests/preBuiltTests")}
          >
            <img src={Assignment} />
            <br />
            <span className={this.state.page === "preBuiltTests" ? "bold" : ""}>
              Pre-Built Tests
            </span>
          </NavItem>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("tests/customTests")}
          >
            <img src={Folder} />
            <br />
            <span className={this.state.page === "customTests" ? "bold" : ""}>
              Custom Tests
            </span>
          </NavItem>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("tests/issuedTests")}
          >
            <img src={Screen} />
            <br />
            <span className={this.state.page === "issuedTests" ? "bold" : ""}>
              Review Issued Tests
            </span>
          </NavItem>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("tests/questionLibrary")}
          >
            <img src={Library} />
            <br />
            <span
              className={this.state.page === "questionLibrary" ? "bold" : ""}
            >
              Question Library
            </span>
          </NavItem>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("tests/createNewTest")}
          >
            <img src={NewFolder} />
            <br />
            <span className={this.state.page === "createNewTest" ? "bold" : ""}>
              Create New Test
            </span>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          {/* on the right side */}
          {/* <NavItem className="d-md-down-none">
            <a href="#">Upgrade Today</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </NavItem> */}
          <NavItem className="d-md-down-none">
            {this.state.user && (
              <strong>Hi {this.state.user.first_name}!</strong>
            )}
          </NavItem>
          <NavItem className="d-md-down-none">
            {this.state.user && <HeaderDropdown />}
          </NavItem>
          <NavItem className="d-md-down-none" />
        </Nav>
      </header>
    );
  }
}

export default Header;
