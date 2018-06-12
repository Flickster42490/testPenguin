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

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      difficultyValue: undefined,
      testCategoryValue: "all",
      questionCategoryValue: "all",
      issuedTestsValue: undefined,
      customTestsValue: undefined,
      preBuiltTestsValue: undefined,
      sliderValue: 50,
      statusValue: "all",
      filters: props.filters || {},
      options: undefined,
      userId: undefined
    };

    this.updateDifficultyValue = this.updateDifficultyValue.bind(this);
    this.updateTestCategoryValue = this.updateTestCategoryValue.bind(this);
    this.updateQuestionCategoryValue = this.updateQuestionCategoryValue.bind(
      this
    );
    this.updateCustomTestsValue = this.updateCustomTestsValue.bind(this);
    this.updateIssuedTestsValue = this.updateIssuedTestsValue.bind(this);
    this.updatePreBuiltTestsValue = this.updatePreBuiltTestsValue.bind(this);
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

  componentWillReceiveProps(np) {
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

  updateCustomTestsValue(newValue) {
    this.setState(
      {
        customTestsValue: newValue.map(i => i.value)
      },
      () => {
        this.handleAddFilters("customTests", this.state.customTestsValue);
      }
    );
  }

  updateIssuedTestsValue(newValue) {
    this.setState(
      {
        issuedTestsValue: newValue.map(i => i.value)
      },
      () => {
        this.handleAddFilters("issuedTests", this.state.issuedTestsValue);
      }
    );
  }

  updatePreBuiltTestsValue(newValue) {
    this.setState(
      {
        preBuiltTestsValue: newValue.map(i => i.value)
      },
      () => {
        this.handleAddFilters("preBuiltTests", this.state.preBuiltTestsValue);
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
            style={{ display: "flex", marginTop: "25px" }}
          >
            <h4 className="muted-text">Search Filters</h4>
          </Row>
          {["questionLibrary"].includes(this.props.page) &&
            this.state.options && (
              <Row className="sidebar-row">
                Categories: <br />
                <ButtonGroup
                  size="sm"
                  vertical
                  block
                  style={{
                    marginTop: "5px",
                    marginBottom: "10px",
                    width: "160px"
                  }}
                >
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
                  By Difficulty: <br />
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
          {["issuedTests"].includes(this.props.page) &&
            this.state.options && (
              <div>
                <Row className="sidebar-row">
                  By Test Name: <br />
                  <Select
                    options={this.state.options.issuedTests}
                    clearable
                    searchable
                    value={this.state.issuedTestsValue}
                    onChange={this.updateIssuedTestsValue}
                    multi
                    removeSelected
                  />
                </Row>
                <br />
              </div>
            )}
          {["preBuiltTests"].includes(this.props.page) &&
            this.state.options && (
              <div>
                <Row className="sidebar-row">
                  By Test Name: <br />
                  <Select
                    options={this.state.options.preBuiltTests}
                    clearable
                    searchable
                    value={this.state.preBuiltTestsValue}
                    onChange={this.updatePreBuiltTestsValue}
                    multi
                    removeSelected
                  />
                </Row>
                <br />
              </div>
            )}
          {["customTests"].includes(this.props.page) &&
            this.state.options && (
              <div>
                <Row className="sidebar-row">
                  By Test Name: <br />
                  <Select
                    options={this.state.options.customTests}
                    clearable
                    searchable
                    value={this.state.customTestsValue}
                    onChange={this.updateCustomTestsValue}
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
                <ButtonGroup
                  size="sm"
                  vertical
                  block
                  style={{
                    marginTop: "5px",
                    marginBottom: "10px",
                    width: "160px"
                  }}
                >
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
        </Container>
      </div>
    );
  }
}

export default Sidebar;
