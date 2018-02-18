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
    this.props.updatePage(e);
    hashHistory.push(`tests/${e}`);
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
            Pre-Built Tests
          </NavItem>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("previousTests")}
          >
            <img src={Screen} />
            <br />
            Review Previous Tests
          </NavItem>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("questionLibrary")}
          >
            <img src={Library} />
            <br />
            Question Library
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#/tests/createNewTest">
              <img src={NewFolder} />
              <br />
              Create New Test
            </NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#">
              <img src={Add} />
              <br />
              Create New Questions
            </NavLink>
          </NavItem>
        </Nav>
      </header>
    );
  }
}

export default SecondaryHeader;
