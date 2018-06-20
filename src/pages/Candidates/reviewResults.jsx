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
import encodeUrl from "encodeurl";
import axios from "axios";
import moment from "moment";
import queryString from "querystring";
import momentDurationFormatSetup from "moment-duration-format";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "status-indicator/styles.css";
import html2pdf from "html2pdf.js";

import { Preloader } from "../../components/Preloader.jsx";
import BarGraph from "../../images/bar-graph.svg";
import History from "../../images/history.svg";

const typeMap = {
  journalEntry: "Journal Entry",
  multipleChoice: "Multiple Choice",
  journal_entry: "Journal Entry",
  multiple_choice: "Multiple Choice",
  reconciliation: "Reconciliation",
  financialStatement: "Financial Statement",
  financial_Statement: "Financial Statement"
};
export default class ReviewResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testResults: null
    };

    this.onExportPDF = this.onExportPDF.bind(this);
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

  convertIntoMinutes({ hours, minutes, seconds }) {
    let totalMin = 0;
    if (hours) totalMin = totalMin + hours * 60;
    if (minutes) totalMin = totalMin + minutes;
    if (seconds) totalMin = totalMin + seconds / 60;
    return totalMin;
  }

  getCompletionTime() {
    let { estimated_time, time_left } = this.state.testResults;
    time_left = this.convertIntoMinutes(time_left);
    let mins = Math.round(estimated_time - time_left);
    return mins;
  }

  getStatusColor(value) {
    value = value * 100;
    if (!value && value !== 0) return <status-indicator active />;
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
            {k === "reconciliation" && (
              <span>
                {v.correctRows}/{v.correctRows + v.wrongRows}{" "}
                {this.getStatusColor(
                  v.correctRows / (v.correctRows + v.wrongRows)
                )}
              </span>
            )}
            {k === "financialStatement" && (
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

  onExportPDF() {
    var element = document.getElementById("toPDF");
    var opt = {
      margin: [0.2, 0.5, 0.2, 0],
      filename: `${this.state.testResults.last_name}_${
        this.state.testResults.first_name
      }_${this.state.testResults.name}.pdf`,
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" }
    };
    html2pdf()
      .from(element)
      .set(opt)
      .save();
  }

  render() {
    const { testResults } = this.state;
    console.log(testResults);
    return (
      <Preloader loading={!testResults}>
        <div className="app-body">
          <main className="main" id="toPDF">
            {testResults && (
              <Container fluid>
                <br />
                <Row>
                  <Col s={5} xs={12} md={5}>
                    <h5>
                      <span className="text-muted">Candidate Name: </span>
                      <strong>
                        {testResults.first_name} {testResults.last_name}
                      </strong>
                    </h5>
                    <h5>
                      {" "}
                      <span className="text-muted">Candidate Email: </span>
                      <strong>{testResults.email_address}</strong>
                    </h5>
                    <h5>
                      <span className="text-muted">Test Name: </span>
                      <strong>{testResults.name}</strong>
                    </h5>
                    <h5>
                      {" "}
                      <span className="text-muted">Issue Date: </span>
                      <strong>
                        {moment(testResults.invited_at).format("MM/DD/YYYY")}
                      </strong>
                    </h5>
                  </Col>
                  <Col s={5} xs={12} md={5}>
                    <div style={{ float: "right", textAlign: "right" }}>
                      <Button color="info" onClick={this.onExportPDF}>
                        Save as PDF
                      </Button>
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs={12} md={5}>
                    <Card>
                      <CardBody style={{ height: "226px" }}>
                        <div className="h4 m-0">
                          <img src={BarGraph} />&nbsp; Results
                        </div>
                        <ul className="horizontal-bars">
                          <li>
                            <strong> Time to Complete:</strong>{" "}
                            {this.getCompletionTime()} minutes (out of allotted{" "}
                            {testResults.estimated_time} minutes)
                          </li>
                          {this.getScoreResults()}
                        </ul>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col xs={12} md={5}>
                    <Card>
                      <CardBody style={{ height: "226px" }}>
                        <div className="h4 m-0">
                          <img src={History} />&nbsp; History
                        </div>
                        <ul className="horizontal-bars">
                          <li>
                            <div>
                              <strong>Test Started:</strong>{" "}
                              {moment(testResults.started_at).format(
                                "MM/DD/YYYY hh:mm a"
                              )}
                            </div>
                          </li>
                          <li>
                            <div>
                              <strong>Test Completed:</strong>{" "}
                              {moment(testResults.completed_at).format(
                                "MM/DD/YYYY hh:mm a"
                              )}
                            </div>
                          </li>
                          <li>
                            <div>
                              <strong>Test Re-Entrances: </strong>
                              {testResults.reentered_count - 1}
                            </div>
                          </li>
                        </ul>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <hr />
                <div class="html2pdf__page-break" />
                <Row>
                  <Col>
                    <h4>Score Breakdown</h4>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col xs={12} md={10}>
                    <ReactTable
                      style={{
                        backgroundColor: "white",
                        textAlign: "center"
                      }}
                      data={testResults.candidate_answers}
                      sortable={false}
                      columns={[
                        {
                          Header: "#",
                          maxWidth: 75,
                          Cell: cell => {
                            return (
                              <span>
                                {_.findIndex(testResults.candidate_answers, {
                                  id: cell.original.id
                                }) + 1}
                              </span>
                            );
                          }
                        },
                        {
                          Header: "Type",
                          Cell: cell => {
                            return (
                              <div>
                                {cell.original.type === "module" &&
                                  `${
                                    typeMap[cell.original.module_type]
                                  } (Module)`}
                                {cell.original.type !== "module" &&
                                  typeMap[cell.original.type]}
                              </div>
                            );
                          }
                        },
                        {
                          Header: "Name",
                          accessor: "name"
                        },
                        {
                          Header: "Score",
                          Cell: cell => {
                            let { correct, module_stem_2 } = cell.original;
                            return (
                              <div>
                                {typeof correct === "boolean" &&
                                  correct && <span>Correct</span>}
                                {typeof correct === "object" &&
                                  correct.module_type !== "multiple_choice" && (
                                    <div>
                                      <span>
                                        Part 1: {correct.correctRows}/{
                                          correct.totalRows
                                        }{" "}
                                        Rows
                                      </span>
                                      {module_stem_2 && (
                                        <div>
                                          Part 2:{" "}
                                          <span style={{ color: "red" }}>
                                            Needs Manual Review
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                {typeof correct === "object" &&
                                  correct.module_type === "multiple_choice" && (
                                    <div>
                                      <span>
                                        Part 1: {correct.correctQuestions}/{
                                          correct.totalQuestions
                                        }{" "}
                                        Questions
                                      </span>
                                      {module_stem_2 && (
                                        <div>
                                          Part 2:{" "}
                                          <span style={{ color: "red" }}>
                                            Needs Manual Review
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                {!correct && (
                                  <span style={{ color: "red" }}>
                                    Incorrect
                                  </span>
                                )}
                              </div>
                            );
                          }
                        },
                        {
                          Header: "Action",
                          Cell: cell => {
                            let reviewIdx, questionId;
                            testResults.candidate_answers.forEach((i, idx) => {
                              if (i.id === cell.original.id) {
                                reviewIdx = idx;
                                questionId = i.id;
                              }
                            });
                            return (
                              <ButtonGroup vertical>
                                <a
                                  href={`/#/testApp/app?testId=${
                                    testResults.test_id
                                  }&candidateId=${testResults.user_id}&id=${
                                    testResults.id
                                  }&review=true&reviewIdx=${reviewIdx}&returnTo=${`/#/dashboard/candidates/reviewResults%3Fid=${
                                    testResults.id
                                  }`}`}
                                >
                                  <Button color="link">
                                    Review Candidate Answer
                                  </Button>
                                </a>
                                {cell.original.type === "module" && (
                                  <a
                                    href={`/#/dashboard/tests/questionLibrary/preview?id=${questionId}&returnTo=${`/#/dashboard/candidates/reviewResults%3Fid=${
                                      testResults.id
                                    }`}`}
                                  >
                                    <Button color="link">
                                      Correct Answer Notes
                                    </Button>
                                  </a>
                                )}
                              </ButtonGroup>
                            );
                          }
                        }
                      ]}
                      defaultPageSize={testResults.candidate_answers.length}
                      showPagination={false}
                      className="-striped -highlight"
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
