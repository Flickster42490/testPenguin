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
        <NavbarBrand />
      </header>
    );
  }
}

export default Header;
