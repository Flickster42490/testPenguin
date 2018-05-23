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
import Select from "react-select";
import { DatePickerBasic } from "../DateRangePicker.jsx";
import "react-select/dist/react-select.css";

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
      userValue: "",
      emailValue: "",
      startDate: undefined,
      endDate: undefined,
      statusValue: "all",
      filters: props.filters || {},
      options: undefined
    };

    this.updateUserValue = this.updateUserValue.bind(this);
    this.updateEmailValue = this.updateEmailValue.bind(this);
    this.updateStatusValue = this.updateStatusValue.bind(this);
    this.handleAddFilters = this.handleAddFilters.bind(this);
    this.handleDateRangeApply = this.handleDateRangeApply.bind(this);
  }

  componentWillMount() {
    axios.post("/sidebar/candidates").then(d => {
      this.setState({
        options: d.data
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

  handleDateRangeApply(e, t) {
    this.setState(
      {
        startDate: t.startDate.format("MM/DD/YY"),
        endDate: t.endDate.format("MM/DD/YY")
      },
      () => {
        this.handleAddFilters("daterange", {
          startDate: this.state.startDate,
          endDate: this.state.endDate
        });
      }
    );
  }

  updateUserValue(newValue) {
    this.setState(
      {
        userValue: newValue
      },
      () => {
        this.handleAddFilters("user", this.state.userValue);
      }
    );
  }

  updateEmailValue(newValue) {
    this.setState(
      {
        emailValue: newValue
      },
      () => {
        this.handleAddFilters("email", this.state.emailValue);
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

  render() {
    return this.state.options ? (
      <div className="sidebar">
        <Container>
          <Row
            className="sidebar-row"
            style={{ display: "flex", marginTop: "30px" }}
          >
            <h4>Search Filters</h4>
          </Row>
          <Row className="sidebar-row">
            By Test Status: <br />
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
          <Row className="sidebar-row">
            By name: <br />
            <Select
              options={this.state.options.users}
              clearable
              searchable
              value={this.state.userValue}
              onChange={this.updateUserValue}
            />
          </Row>
          <br />
          <Row className="sidebar-row">
            By email: <br />
            <Select
              options={this.state.options.emails}
              clearable
              searchable
              value={this.state.emailValue}
              onChange={this.updateEmailValue}
            />
          </Row>
          <br />
          <Row className="sidebar-row">
            By Test Issued Period: <br />
            <DatePickerBasic
              startDate={this.state.startDate || "01/01/2018"}
              endDate={this.state.endDate || new Date()}
              handleApply={this.handleDateRangeApply}
            />
          </Row>
          <br />
        </Container>
      </div>
    ) : null;
  }
}

export default Sidebar;
