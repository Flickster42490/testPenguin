import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Badge,
  Progress
} from "reactstrap";
import _ from "lodash";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import ReactTable from "react-table";
import "react-table/react-table.css";
import queryString from "querystring";

import utils from "../../../utils";
import { Preloader } from "../../../components/Preloader.jsx";

export default class QuestionLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      test: undefined
    };
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    document.body.classList.toggle("sidebar-hidden");
    const queries = window.location.hash.split("?")[1];
    const testId = queryString.parse(queries).id;
    axios.get(`/tests/id/${testId}/questions`).then(d => {
      axios.get(`/tests/${testId}`).then(t => {
        this.setState({ test: t.data[0], questions: d.data });
      });
    });
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  render() {
    const { questions, test } = this.state;
    return (
      <div style={{ marginLeft: "200px", marginRight: "200px" }}>
        <Preloader loading={questions.length < 1}>
          <br />
          {test && (
            <div>
              <Row>
                <Col xs={12} md={9}>
                  <h3>
                    <span className="muted-text">Test Name: </span>
                    {test.name}
                  </h3>
                </Col>
                <Col xs={12} md={3}>
                  <a
                    href={`/#/dashboard/tests/customTests`}
                    className="float-right"
                  >
                    <FontAwesome name="chevron-circle-left" size="2x" /> &nbsp;
                    Go Back
                  </a>
                </Col>
              </Row>
              <br />
              <hr />
              <Row>
                <Col xs={12} md={4}>
                  <div class="text-align-center">
                    <div className="h4 m-0">Test Description</div>
                    <span>{test.description}</span>
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div class="text-align-center">
                    <div className="h4 m-0">Overview</div>
                    <ul className="horizontal-bars">
                      <li>
                        <span className="muted-text">Type: </span>
                        <span>{test.type}</span>{" "}
                      </li>
                      <li>
                        <span className="muted-text">Allotted Time: </span>
                        <span>{test.estimated_time} minutes</span>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div class="text-align-center">
                    <div className="h4 m-0">Actions</div>
                    <ul className="horizontal-bars">
                      <li>
                        <a
                          href={`/#/dashboard/tests/inviteCandidates?id=${
                            test.id
                          }&name=${test.name}`}
                        >
                          <Button color="success" style={{ width: "136px" }}>
                            <strong>Invite Candidates</strong>
                          </Button>
                        </a>
                      </li>
                      <li>
                        <a
                          href={`/#/testApp/app?testId=${
                            test.id
                          }&preview=true&returnTo=${window.location.hash}`}
                        >
                          <Button color="default" style={{ width: "136px" }}>
                            <strong>Preview Test</strong>
                          </Button>
                        </a>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col />
              </Row>
            </div>
          )}
          <br />
          <hr />
          <Row>
            <Col xs="12">
              <h3>Test Breakdown</h3>
              <ReactTable
                style={{ backgroundColor: "white" }}
                data={questions}
                sortable={false}
                columns={[
                  {
                    Header: "#",
                    Cell: cell => <span>{cell.index + 1}</span>
                  },
                  {
                    Header: "Question Name",
                    accessor: "name",
                    style: {
                      justifyContent: "center"
                    },
                    maxWidth: 75,
                    Cell: cell => (
                      <a
                        href={`/#/dashboard/tests/questionLibrary/preview?id=${
                          cell.original.id
                        }&returnTo=${window.location.hash}&returnToTestId=${
                          queryString.parse(window.location.hash.split("?")[1])
                            .id
                        }`}
                      >
                        <strong>{cell.value}</strong>
                      </a>
                    )
                  },
                  {
                    Header: "Question Type",
                    Cell: cell => (
                      <span>
                        {utils.toUpper(utils.addSpace(cell.original.type))}{" "}
                        {utils.toUpper(utils.addSpace(cell.original.type)) ===
                        "Module"
                          ? `(${utils.toUpper(
                              utils.addSpace(cell.original.module_type)
                            )})`
                          : ""}
                      </span>
                    )
                  },
                  {
                    Header: "Estimated Time",
                    accessor: "estimated_time",
                    Cell: cell => (
                      <span>{cell.original.estimated_time} mins</span>
                    )
                  },
                  {
                    Header: "Difficulty",
                    accessor: "difficulty",
                    maxWidth: "100",
                    Cell: cell => (
                      <span>{utils.toUpper(cell.original.difficulty)}</span>
                    )
                  },
                  {
                    Header: "Category",
                    accessor: "tags",
                    Cell: cell => {
                      let tags = cell.value && cell.value.split(",");
                      return tags && tags.length > 0 ? (
                        <span
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "start"
                          }}
                        >
                          {tags.map(i => {
                            return (
                              <span>
                                <Badge color="light" pill>
                                  {i}
                                </Badge>&nbsp;
                              </span>
                            );
                          })}
                        </span>
                      ) : null;
                    }
                  },
                  {
                    Header: "Actions",
                    maxWidth: 300,
                    sortable: false,
                    Cell: cell => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <ButtonGroup size="sm" vertical>
                          <a
                            href={`/#/dashboard/tests/questionLibrary/preview?id=${
                              cell.original.id
                            }&returnTo=${window.location.hash}&returnToTestId=${
                              queryString.parse(
                                window.location.hash.split("?")[1]
                              ).id
                            }`}
                          >
                            <Button size="sm" color="primary">
                              Preview Question
                            </Button>
                          </a>
                        </ButtonGroup>
                      </div>
                    )
                  }
                ]}
                defaultPageSize={questions.length}
                showPagination={false}
                className="-striped -highlight"
              />
            </Col>
          </Row>
        </Preloader>
      </div>
    );
  }
}
