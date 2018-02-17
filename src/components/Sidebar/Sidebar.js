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
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import "react-select/dist/react-select.css";

import { DatePickerBasic } from "../DateRangePicker.jsx";

const options = [
  { value: 2, label: "John Smith" },
  { value: 3, label: "Max Li" },
  { value: 5, label: "Jane Smith" },
  { value: 4, label: "Lesley Little" },
  { value: 6, label: "Drew Tevrizian" }
];

const catOptions = [
  { value: 2, label: "Accounting" },
  { value: 3, label: "Finance" },
  { value: 5, label: "CPA (Custom)" },
  { value: 4, label: "Finance II" }
];

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      catValue: "",
      sliderValue: 50
    };

    this.updateValue = this.updateValue.bind(this);
    this.updateCatValue = this.updateCatValue.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  handleSliderChange(value) {
    this.setState({
      sliderValue: value
    });
  }

  updateValue(newValue) {
    this.setState({
      value: newValue
    });
  }

  updateCatValue(newValue) {
    this.setState({
      catValue: newValue
    });
  }

  render() {
    return (
      <div className="sidebar">
        <Container>
          <Row
            className="sidebar-row"
            style={{ display: "flex", marginTop: "30px" }}
          >
            <h4>Search Filters</h4>
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
          <br />
          <Row className="sidebar-row">
            By Test Score:&nbsp;
            <strong>Greater than {this.state.sliderValue}</strong>
            <Slider
              style={{ width: "100%" }}
              min={0}
              max={100}
              value={this.state.sliderValue}
              // onChangeStart={this.handleChangeStart}
              onChange={this.handleSliderChange}
              // onChangeComplete={this.handleChangeComplete}
            />
          </Row>
          <Row className="sidebar-row">
            By Test Categories: <br />
            <Select
              options={catOptions}
              clearable
              searchable
              value={this.state.catValue}
              onChange={this.updateCatValue}
              multi
              removeSelected
            />
          </Row>
        </Container>
      </div>
    );
  }
}

export default Sidebar;
