import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Progress,
  Input,
  Button,
  ButtonGroup,
  ButtonToolbar
} from "reactstrap";
import { Tooltip } from "react-tippy";
import axios from "axios";
import moment from "moment";
import queryString from "querystring";
import momentDurationFormatSetup from "moment-duration-format";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "status-indicator/styles.css";

import { Preloader } from "../../components/Preloader.jsx";
import BarGraph from "../../images/bar-graph.svg";
import History from "../../images/history.svg";

const typeMap = {
  journalEntry: "Journal Entry",
  multipleChoice: "Multiple Choice"
};

const mockData = [
  {
    id: 1,
    question:
      "If I had only 1 statement and wanted to review the overall health of a company, which statement would I use and why?",
    correct: true,
    actualTime: 92,
    expectedTime: 180
  },
  {
    id: 2,
    question: "What is working capital?",
    correct: false,
    actualTime: 92,
    expectedTime: 180
  },
  {
    id: 3,
    question: "What does having negative working capital mean?",
    correct: true,
    actualTime: 92,
    expectedTime: 180
  },
  {
    id: 4,
    question:
      "If cash collected from customers is not yet recorded as revenue, what happens to it?",
    correct: true,
    actualTime: 92,
    expectedTime: 180
  },
  {
    id: 5,
    question: "When do you capitalize rather than expense a purchase?",
    correct: true,
    actualTime: 92,
    expectedTime: 180
  }
];
export default class ReviewResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testResults: null
    };
  }

  componentWillMount() {
    const queries = window.location.hash.split("?")[1];
    const { id } = queryString.parse(queries);
    axios.get(`/testAttempts/findOne/${id}`).then(d => {
      this.setState({
        testResults: d.data[0]
      });
    });
  }

  getCompletionTime() {
    let { completed_at, started_at } = this.state.testResults;
    let duration = moment.duration(
      moment(completed_at).diff(moment(started_at))
    );
    let mins = duration.asMinutes();
    return mins;
  }

  getStatusColor(value) {
    value = value * 100;
    if (!value) return <status-indicator active />;
    else if (value > 90) return <status-indicator positive />;
    else if (value > 50) return <status-indicator intermediary />;
    else return <status-indicator negative />;
  }

  getScoreResults() {
    let resultList = [];
    _.forOwn(this.state.testResults.results, (v, k) => {
      resultList.push(
        <li key={k}>
          <div>
            <strong>{typeMap[k]}: </strong>
            {k === "multipleChoice" && (
              <span>
                {v.correct}/{v.correct + v.wrong}{" "}
                {this.getStatusColor(v.correct / (v.correct + v.wrong))}
              </span>
            )}
            {k === "journalEntry" && (
              <span>
                {v.correctRows}/{v.correctRows + v.wrongRows}{" "}
                {this.getStatusColor(
                  v.correctRows / (v.correctRows + v.wrongRows)
                )}
              </span>
            )}
          </div>
        </li>
      );
    });

    return <div>{resultList}</div>;
  }

  render() {
    const { testResults } = this.state;
    return (
      <Preloader loading={!testResults}>
        <div className="app-body">
          <main className="main">
            {testResults && (
              <Container fluid>
                <Row>
                  <Col xs={7}>
                    <h3>
                      {testResults.first_name} {testResults.last_name}
                    </h3>
                    <h5>{testResults.email}</h5>
                  </Col>
                  <Col xs={3}>
                    <div style={{ float: "right" }}>
                      <h3>{testResults.name}</h3>
                      <Button color="info">Export as PDF</Button>
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs={5}>
                    <Card>
                      <CardBody>
                        <div className="h4 m-0">
                          <img src={BarGraph} />&nbsp; Results
                        </div>
                        <ul className="horizontal-bars">
                          <li>
                            <strong> Time to Complete Test:</strong>{" "}
                            {this.getCompletionTime()} mins
                          </li>
                          {this.getScoreResults()}
                          <li />
                        </ul>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col xs={5}>
                    <Card>
                      <CardBody>
                        <div className="h4 m-0">
                          <img src={History} />&nbsp; History
                        </div>
                        <ul className="horizontal-bars">
                          <li>
                            <div>
                              <strong>Test Issued:</strong>{" "}
                              {moment(testResults.invited_at).format(
                                "MM/DD/YYYY hh:mm a"
                              )}
                            </div>
                          </li>
                          <li>
                            <div>
                              <strong>Test Started:</strong>
                              {moment(testResults.started_at).format(
                                "MM/DD/YYYY hh:mm a"
                              )}
                            </div>
                          </li>
                          <li>
                            <div>
                              <strong>Test Completed:</strong>
                              {moment(testResults.completed_at).format(
                                "MM/DD/YYYY hh:mm a"
                              )}
                            </div>
                          </li>
                          <li>
                            <div>
                              <strong>
                                # of Times Candidate Re-Entered Test:
                              </strong>
                              {testResults.reentered_count}
                            </div>
                          </li>
                          <li>
                            <div />
                          </li>
                        </ul>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs={7}>
                    <h4>Review Candidate's Answers</h4>
                  </Col>
                  <Col xs={3}>
                    <div style={{ float: "right" }}>
                      <Button color="info">Export as CSV</Button>
                    </div>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col xs={10}>
                    <ReactTable
                      style={{ backgroundColor: "white", textAlign: "center" }}
                      data={mockData}
                      sortable={false}
                      columns={[
                        {
                          Header: "ID",
                          accessor: "id"
                        },
                        {
                          Header: "Question",
                          Cell: cell => {
                            return (
                              <Tooltip
                                title={cell.original.question}
                                position="top"
                                trigger="mouseenter"
                              >
                                {cell.original.question}
                              </Tooltip>
                            );
                          }
                        },
                        {
                          Header: "Score",
                          Cell: cell => {
                            return (
                              <div>
                                {cell.original.correct && <span>Correct</span>}
                                {!cell.original.correct && (
                                  <span style={{ color: "red" }}>
                                    Incorrect
                                  </span>
                                )}
                              </div>
                            );
                          }
                        },
                        {
                          Header: "Time",
                          Cell: cell => {
                            return (
                              <div
                                style={{
                                  justifyContent: "left"
                                }}
                              >
                                <div>
                                  Spent:{" "}
                                  {moment
                                    .duration(cell.original.actualTime, "S")
                                    .format("m [min] s [sec]")}
                                </div>
                                <div>
                                  Expected:{" "}
                                  {moment
                                    .duration(cell.original.expectedTime, "S")
                                    .format("m [min] s [sec]")}
                                </div>
                              </div>
                            );
                          }
                        }
                      ]}
                      defaultPageSize={5}
                      className="-striped -highlight"
                    />
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs={10}>
                    <h4>Notes</h4>
                    <Input
                      type="textarea"
                      name="textarea-input"
                      id="textarea-input"
                      rows="10"
                      placeholder="Write notes about the candidate here..."
                    />
                  </Col>
                </Row>
                <br />
              </Container>
            )}
          </main>
        </div>
      </Preloader>
    );
  }
}
