import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
  Badge,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Nav,
  NavItem,
  NavLink as RsNavLink,
  Container,
  Row,
  Col
} from "reactstrap";
import axios from "axios";
import _ from "lodash";
import localForage from "localforage";
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
      difficultyValue: undefined,
      testCategoryValue: "all",
      questionCategoryValue: "all",
      sliderValue: 50,
      statusValue: "all",
      filters: props.filters || {},
      options: undefined
    };

    this.updateDifficultyValue = this.updateDifficultyValue.bind(this);
    this.updateTestCategoryValue = this.updateTestCategoryValue.bind(this);
    this.updateQuestionCategoryValue = this.updateQuestionCategoryValue.bind(
      this
    );
    this.updateStatusValue = this.updateStatusValue.bind(this);
    this.handleAddFilters = this.handleAddFilters.bind(this);
  }

  componentWillMount() {
    localForage.getItem("userId").then(id => {
      axios
        .post("/sidebar/tests", { page: this.props.page, userId: id })
        .then(d => {
          this.setState({
            options: d.data
          });
        });
    });
  }

  handleAddFilters(type, value) {
    let newFilter = {};
    newFilter[type] = value;
    this.setState(
      {
        filters: Object.assign(this.state.filters, newFilter)
      },
      () => {
        this.props.handleAddFilters(this.state.filters);
      }
    );
  }

  updateDifficultyValue(newValue) {
    this.setState(
      {
        difficultyValue: newValue.map(i => i.value)
      },
      () => {
        this.handleAddFilters("difficulty", this.state.difficultyValue);
      }
    );
  }

  updateQuestionCategoryValue(newValue) {
    this.setState(
      {
        questionCategoryValue: newValue
      },
      () => {
        this.handleAddFilters(
          "questionCategory",
          this.state.questionCategoryValue
        );
      }
    );
  }
  updateTestCategoryValue(newValue) {
    this.setState(
      {
        testCategoryValue: newValue
      },
      () => {
        this.handleAddFilters("testCategory", this.state.testCategoryValue);
      }
    );
  }

  updateStatusValue(newValue) {
    this.setState(
      {
        statusValue: newValue
      },
      () => {
        this.handleAddFilters("status", this.state.statusValue);
      }
    );
  }

  renderQuestionCategoryButtons(categories) {
    return categories.map(i => {
      return (
        <Button
          outline
          color="secondary"
          active={this.state.questionCategoryValue === i.value}
          onClick={() => this.updateQuestionCategoryValue(i.value)}
          key={i.value}
        >
          {i.value}
        </Button>
      );
    });
  }

  renderTestCategoryButtons(categories) {
    return categories.map(i => {
      return (
        <Button
          outline
          color="secondary"
          active={this.state.testCategoryValue === i.value}
          onClick={() => this.updateTestCategoryValue(i.value)}
          key={i.value}
        >
          {i.value}
        </Button>
      );
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
          {/* {["issuedTests"].includes(this.props.page) && (
            <div>
              <Row className="sidebar-row">
                By Test Status: <br />
                <ButtonGroup size="sm" vertical block>
                  <Button
                    outline
                    color="secondary"
                    active={this.state.statusValue == "all"}
                    onClick={() => this.updateStatusValue("all")}
                  >
                    All Tests
                  </Button>
                  <Button
                    outline
                    color="secondary"
                    active={this.state.statusValue == "waiting"}
                    onClick={() => this.updateStatusValue("waiting")}
                  >
                    Waiting For Test Results
                  </Button>
                  <Button
                    outline
                    color="secondary"
                    active={this.state.statusValue == "completed"}
                    onClick={() => this.updateStatusValue("completed")}
                  >
                    Tests Completed
                  </Button>
                </ButtonGroup>
              </Row>
              <br />
            </div>
          )} */}
          {["questionLibrary"].includes(this.props.page) &&
            this.state.options && (
              <Row className="sidebar-row">
                Categories: <br />
                <ButtonGroup size="sm" vertical block>
                  <Button
                    outline
                    color="secondary"
                    active={this.state.questionCategoryValue === "all"}
                    onClick={() => this.updateQuestionCategoryValue("all")}
                  >
                    All
                  </Button>
                  {this.renderQuestionCategoryButtons(
                    this.state.options.questionCategories
                  )}
                </ButtonGroup>
                <br />
              </Row>
            )}
          {["questionLibrary"].includes(this.props.page) &&
            this.state.options && (
              <div>
                <Row className="sidebar-row">
                  By Difficulty <br />
                  <Select
                    options={this.state.options.difficulty}
                    clearable
                    searchable
                    value={this.state.difficultyValue}
                    onChange={this.updateDifficultyValue}
                    multi
                    removeSelected
                  />
                </Row>
                <br />
              </div>
            )}
          {["preBuiltTests", "customTests"].includes(this.props.page) &&
            this.state.options && (
              <Row className="sidebar-row">
                Categories: <br />
                <ButtonGroup size="sm" vertical block>
                  <Button
                    outline
                    color="secondary"
                    active={this.state.testCategoryValue === "all"}
                    onClick={() => this.updateTestCategoryValue("all")}
                  >
                    All
                  </Button>
                  {this.renderTestCategoryButtons(
                    this.state.options.testCategories
                  )}
                </ButtonGroup>
                <br />
              </Row>
            )}
          {["issuedTests", "preBuiltTests", "customTests"].includes(
            this.props.page
          ) && (
            <div>
              <Row className="sidebar-row">
                By Test Name: <br />
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
              <br />
            </div>
          )}
          {/* {["issuedTests"].includes(this.props.page) && (
            <div>
              <Row className="sidebar-row">
                <br />
                <label>
                  Search Archived: <br />
                  <Toggle defaultChecked />
                </label>
              </Row>
              <br />
            </div>
          )} */}
        </Container>
      </div>
    );
  }
}

export default Sidebar;
