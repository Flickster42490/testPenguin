import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
  Badge,
  Nav,
  NavItem,
  NavLink as RsNavLink,
  Container,
  Row,
  Col,
  Button
} from "reactstrap";
import Select from "react-select";
import "react-select/dist/react-select.css";

import { DatePickerBasic } from "../DateRangePicker.jsx";

const options = [
  { value: 2, label: "John Smith" },
  { value: 3, label: "Max Li" },
  { value: 5, label: "Jane Smith" },
  { value: 4, label: "Lesley Little" },
  { value: 6, label: "Drew Tevrizian" }
];

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };

    this.updateValue = this.updateValue.bind(this);
  }

  updateValue(newValue) {
    this.setState({
      value: newValue
    });
  }
  render() {
    return (
      <div className="sidebar">
        <Container>
          <Row className="sidebar-row" style={{ display: "flex" }}>
            <h4>Search</h4>
          </Row>
          <Row className="sidebar-row">
            By name or email: <br />
            <Select
              options={options}
              clearable
              searchable
              value={this.state.value}
              onChange={this.updateValue}
            />
          </Row>
          <br />
          <Row className="sidebar-row">
            By Tested Period: <br />
            <DatePickerBasic />
          </Row>
          <Row className="sidebar-row" />
          <Row className="sidebar-row" />
        </Container>
      </div>
    );
  }
}

export default Sidebar;
