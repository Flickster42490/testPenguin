import React, { Component } from "react";
import {
  Nav,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Badge
} from "reactstrap";
import { hashHistory } from "react-router";
import FontAwesome from "react-fontawesome";

import Screen from "../../images/screen.svg";
import Lock from "../../images/lock.svg";
import Add from "../../images/add.svg";
import Library from "../../images/library.svg";
import NewFolder from "../../images/new-folder.svg";
import HeaderDropdown from "./HeaderDropdown";

class SecondaryHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "preBuiltTests"
    };
  }

  componentWillMount() {
    if (this.state.page !== window.location.hash.split("/")[2])
      this.setState({
        page: window.location.hash.split("/")[2]
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
        this.props.updatePage(e);
        hashHistory.push(`dashboard/tests/${e}`);
      }
    );
  }

  render() {
    return (
      <header className="app-header navbar secondary">
        <Nav className="d-md-down-none" navbar>
          <NavbarToggler
            className="d-lg-none"
            onClick={this.mobileSidebarToggle}
          >
            <span className="navbar-toggler-icon" />
          </NavbarToggler>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("preBuiltTests")}
          >
            <img src={Lock} />
            <br />
            <span className={this.state.page === "preBuiltTests" ? "bold" : ""}>
              Pre-Built Tests
            </span>
          </NavItem>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("previousTests")}
          >
            <img src={Screen} />
            <br />
            <span className={this.state.page === "previousTests" ? "bold" : ""}>
              Review Previous Tests
            </span>
          </NavItem>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("questionLibrary")}
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
            onClick={() => this.handleClick("createNewTest")}
          >
            <img src={NewFolder} />
            <br />
            <span className={this.state.page === "createNewTest" ? "bold" : ""}>
              Create New Test
            </span>
          </NavItem>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("createNewQuestion")}
          >
            <img src={Add} />
            <br />
            <span
              className={this.state.page === "createNewQuestion" ? "bold" : ""}
            >
              Create New Question
            </span>
          </NavItem>
        </Nav>
      </header>
    );
  }
}

export default SecondaryHeader;
