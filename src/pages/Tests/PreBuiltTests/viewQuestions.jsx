import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Progress
} from "reactstrap";
import _ from "lodash";
import axios from "axios";
import ReactTable from "react-table";
import "react-table/react-table.css";
import queryString from "querystring";

import utils from "../../../utils";
import { Preloader } from "../../../components/Preloader.jsx";

export default class QuestionLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: []
    };
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    const queries = window.location.hash.split("?")[1];
    const testId = queryString.parse(queries).id;
    axios.get(`/tests/id/${testId}/questions`).then(d => {
      this.setState({ questions: d.data });
    });
  }

  render() {
    const { questions } = this.state;
    console.log(questions);
    return (
      <div>
        <Preloader loading={questions.length < 1}>
          <br />
          <Row>
            <Col xs="12">
              <ReactTable
                style={{ backgroundColor: "white" }}
                data={questions}
                sortable={false}
                columns={[
                  {
                    Header: "Question Name",
                    accessor: "name",
                    Cell: cell => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <div style={{ fontSize: "1rem" }}>
                          <strong>{cell.value}</strong>
                        </div>
                      </div>
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
                    accessor: "tags"
                  },
                  {
                    Header: "Actions",
                    maxWidth: 300,
                    Cell: cell => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <ButtonGroup size="sm" vertical>
                          <Button size="sm" color="primary">
                            <a
                              href={`/#/dashboard/tests/questionLibrary/preview?id=${
                                cell.original.id
                              }&returnTo=${
                                window.location.hash
                              }&returnToTestId=${
                                queryString.parse(
                                  window.location.hash.split("?")[1]
                                ).id
                              }`}
                            >
                              Preview Question
                            </a>
                          </Button>
                        </ButtonGroup>
                      </div>
                    )
                  }
                ]}
                defaultPageSize={5}
                className="-striped -highlight"
              />
            </Col>
          </Row>
        </Preloader>
      </div>
    );
  }
}
