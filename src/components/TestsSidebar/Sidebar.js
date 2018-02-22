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
import Toggle from "react-toggle";
import "react-rangeslider/lib/index.css";
import "react-select/dist/react-select.css";

import { DatePickerBasic } from "../DateRangePicker.jsx";

const difficultyOptions = [
  { value: 2, label: "Easy" },
  { value: 3, label: "Medium" },
  { value: 5, label: "Difficult" }
];

const catOptions = [
  { value: 2, label: "Treasury" },
  { value: 3, label: "Payroll" },
  { value: 5, label: "Fixed Assets" },
  { value: 4, label: "Controls" },
  { value: 6, label: "ERM" },
  { value: 7, label: "Closing" }
];

const userOptions = [
  { value: 2, label: "John Smith" },
  { value: 3, label: "Max Li" },
  { value: 5, label: "Jane Doe" },
  { value: 4, label: "Lesley Little" },
  { value: 6, label: "Drew Tevrizian" }
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

  componentWillMount() {
    this.setState({
      page: window.location.hash.split("/")[2]
    });
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
            style={{ display: "flex", marginTop: "10px" }}
          >
            <h4>Search Filters</h4>
          </Row>
          {["preBuiltTests", "questionLibrary"].includes(this.props.page) && (
            <Row className="sidebar-row">
              By Difficulty <br />
              <Select
                options={difficultyOptions}
                clearable
                searchable
                value={this.state.value}
                onChange={this.updateValue}
                multi
                removeSelected
              />
            </Row>
          )}
          {["questionLibrary"].includes(this.props.page) && (
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
          )}
          {["previousTests"].includes(this.props.page) && (
            <Row className="sidebar-row">
              By name or email: <br />
              <Select
                options={userOptions}
                clearable
                searchable
                value={this.state.catValue}
                onChange={this.updateCatValue}
                multi
                removeSelected
              />
            </Row>
          )}
          {["previousTests"].includes(this.props.page) && (
            <Row className="sidebar-row">
              <br />
              <label>
                Search Archived: <br />
                <Toggle defaultChecked />
              </label>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}

export default Sidebar;
