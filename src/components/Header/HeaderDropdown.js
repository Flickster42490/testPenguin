import React, { Component } from "react";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from "reactstrap";
import localForage from "localforage";
import axios from "axios";
import Settings from "../../images/settings.svg";

class HeaderDropdown extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };

    this.handleProfile = this.handleProfile.bind(this);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleProfile() {
    this.props.handleClick("profile");
  }

  handleLogout() {
    localForage.getItem("userId").then(value => {
      console.log("value", value);
      if (value) {
        localForage.removeItem("userId").then(() => {
          console.log("removed item");
          axios.post("/auth/logout", { userId: value }).then(res => {
            console.log("res status", res);
            if (res.status === 200) window.location.href = "/#/login";
            else {
              console.log("could not remove userId from server cache");
              window.location.href = "/#/login";
            }
          });
        });
      } else {
        window.location.href = "/#/login";
      }
    });
  }

  dropAccnt() {
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <i
            className="fa fa-ellipsis-v fa-5 header-menu-icon"
            style={{ fontSize: "1.5rem", color: "#fff" }}
          />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={this.handleProfile}>
            <i className="fa fa-wrench" />Account Profile
          </DropdownItem>
          <DropdownItem onClick={this.handleLogout}>
            <i className="fa fa-lock" /> Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    const { ...attributes } = this.props;
    return this.dropAccnt();
  }
}

export default HeaderDropdown;
