import React, { Component } from "react";
import { Button, Nav, NavbarBrand, NavItem } from "reactstrap";
import _ from "lodash";
import localForage from "localforage";
import axios from "axios";

import HeaderDropdown from "./HeaderDropdown";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "candidates",
      user: undefined,
      tokens: undefined,
      trialExpired: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    localForage.getItem("userId").then(id => {
      axios.get(`/users/${id}`).then(u => {
        console.log(u.data[0]);
        if (this.state.page !== window.location.hash.split("/")[2]) {
          this.setState({
            trialExpired: u.data[0].trial && u.data[0].trial_expired,
            page:
              window.location.hash.split("/")[2] === "tests"
                ? window.location.hash.split("/")[3]
                : window.location.hash.split("/")[2],
            user: u.data[0],
            tokens: u.data[0].tokens
          });
        } else {
          this.setState({
            trialExpired: u.data[0].trial && u.data[0].trial_expired,
            user: u.data[0],
            tokens: u.data[0].tokens
          });
        }
      });
    });
  }

  componentWillReceiveProps(props) {
    if (
      typeof props.tokens !== "undefined" &&
      props.tokens !== this.state.user.tokens
    ) {
      this.setState({
        tokens: props.tokens
      });
    }
  }

  handleAddMoreTokens() {
    window.location.href = "/#/dashboard/profile";
  }

  openPaymentPage() {
    window.location.href = "/#/dashboard/profile?trialError=true";
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
        page: e === "candidates" ? e : e.split("/")[1]
      },
      () => {
        window.location.href = `/#/dashboard/${e}`;
      }
    );
  }

  render() {
    console.log(this.state.user, this.state.page, this.state.tokens);
    return (
      <header className="app-header navbar">
        {/* <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler> */}
        <NavbarBrand />
        {/* <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler> */}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Nav className="d-md-down-none" navbar>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("candidates")}
          >
            <span
              className={
                _.includes(this.state.page, "candidates") ? "bold" : ""
              }
            >
              Candidates
            </span>
          </NavItem>
          <NavItem
            className="px-3"
            onClick={
              this.state.trialExpired
                ? this.openPaymentPage()
                : () => this.handleClick("tests/questionLibrary")
            }
          >
            <span
              className={this.state.page === "questionLibrary" ? "bold" : ""}
            >
              Question Library
            </span>
          </NavItem>
          <NavItem
            className="px-3"
            onClick={
              this.state.trialExpired
                ? this.openPaymentPage()
                : () => this.handleClick("tests/customTests")
            }
          >
            <span className={this.state.page === "customTests" ? "bold" : ""}>
              My Custom Tests
            </span>
          </NavItem>
          <NavItem
            className="px-3"
            onClick={
              this.state.trialExpired
                ? this.openPaymentPage()
                : () => this.handleClick("tests/preBuiltTests")
            }
          >
            <span className={this.state.page === "preBuiltTests" ? "bold" : ""}>
              Pre-Built Tests
            </span>
          </NavItem>
          <NavItem
            className="px-3"
            onClick={() => this.handleClick("tests/issuedTests")}
          >
            <span className={this.state.page === "issuedTests" ? "bold" : ""}>
              Tests Issued
            </span>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          {/* on the right side */}
          {/* <NavItem className="d-md-down-none">
            <a href="#">Upgrade Today</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </NavItem> */}
          <NavItem className="d-md-down-none">
            {!isNaN(this.state.tokens) && (
              <div style={{ paddingRight: "20px" }}>
                <div
                  className="token-header "
                  style={{ fontSize: ".75rem", cursor: "initial" }}
                >
                  <span
                    className="token-header token-header-number"
                    style={{ fontSize: "1rem" }}
                  >
                    <strong>{this.state.tokens || 0}</strong>
                  </span>{" "}
                  Tests<br />
                  <Button
                    color="link"
                    style={{ padding: 0, borderTop: "0", marginTop: "-5px" }}
                    onClick={this.handleAddMoreTokens}
                  >
                    <span
                      className="token-header"
                      style={{ fontSize: ".75rem" }}
                    >
                      Add More
                    </span>
                  </Button>
                </div>
              </div>
            )}
          </NavItem>
          <NavItem className="d-md-down-none">
            {this.state.user && <strong>{this.state.user.first_name}</strong>}
          </NavItem>
          <NavItem className="d-md-down-none">
            {this.state.user && (
              <HeaderDropdown handleClick={this.handleClick} />
            )}
          </NavItem>
        </Nav>
      </header>
    );
  }
}

export default Header;
