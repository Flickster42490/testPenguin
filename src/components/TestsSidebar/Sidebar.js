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

const difficultyOptions = [
  { value: 2, label: "Easy" },
  { value: 3, label: "Medium" },
  { value: 5, label: "Difficult" }
];

const catOptions = [
  { value: 2, label: "Accounting" },
  { value: 3, label: "Finance" },
  { value: 5, label: "CPA" },
  { value: 4, label: "Finance II" },
  { value: 6, label: "A/P Clerk" },
  { value: 7, label: "BookKeeping" }
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
    console.log(this.props.page);
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
        </Container>
      </div>
    );
  }
}

export default Sidebar;
