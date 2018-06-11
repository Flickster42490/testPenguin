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
  reconciliation: "Reconciliation"
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

  getCompletionTime() {
    let { completed_at, started_at } = this.state.testResults;
    let duration = moment.duration(
      moment(completed_at).diff(moment(started_at))
    );
    let mins = Math.round(duration.asMinutes());
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
            {k === "reconciliation" && (
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
    return (
      <Preloader loading={!testResults}>
        <div className="app-body">
          <main className="main">
            {testResults && (
              <div id="toPDF">
                <Container fluid>
                  <br />
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
                        <Button color="info" onClick={this.onExportPDF}>
                          Export as PDF
                        </Button>
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
                  <div class="html2pdf__page-break" />
                  <Row>
                    <Col>
                      <h4>Review Candidate's Answers</h4>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col xs={10}>
                      <ReactTable
                        style={{
                          backgroundColor: "white",
                          textAlign: "center"
                        }}
                        data={testResults.candidate_answers}
                        sortable={false}
                        columns={[
                          {
                            Header: "ID",
                            accessor: "id",
                            maxWidth: 75
                          },
                          {
                            Header: "Type",
                            Cell: cell => {
                              return (
                                <div>
                                  {cell.original.type === "module"
                                    ? typeMap[cell.original.module_type]
                                    : typeMap[cell.original.type]}
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
                              console.log(cell.original);
                              let { correct, module_stem_2 } = cell.original;
                              return (
                                <div>
                                  {typeof correct === "boolean" &&
                                    correct && <span>Correct</span>}
                                  {typeof correct === "object" &&
                                    correct.module_type !==
                                      "multiple_choice" && (
                                      <div>
                                        <span>
                                          Part 1: {correct.correctRows}/{
                                            correct.totalRows
                                          }{" "}
                                          Rows
                                        </span>
                                        {module_stem_2 && (
                                          <div>
                                            <br />
                                            <span>Part 2: Manual Review</span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  {typeof correct === "object" &&
                                    correct.module_type ===
                                      "multiple_choice" && (
                                      <div>
                                        <span>
                                          Part 1: {correct.correctQuestions}/{
                                            correct.totalQuestions
                                          }{" "}
                                          Questions
                                        </span>
                                        {module_stem_2 && (
                                          <div>
                                            <br />
                                            <span>Part 2: Manual Review</span>
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
                              let reviewIdx;
                              testResults.candidate_answers.forEach(
                                (i, idx) => {
                                  if (i.id === cell.original.id)
                                    reviewIdx = idx;
                                }
                              );
                              return (
                                <a
                                  href={`/#/testApp/app?testId=${
                                    testResults.test_id
                                  }&candidateId=${testResults.user_id}&id=${
                                    testResults.id
                                  }&review=true&reviewIdx=${reviewIdx}&returnTo=${`/#/dashboard/candidates/reviewResults%3Fid=${
                                    testResults.id
                                  }`}`}
                                >
                                  <Button color="link">Go To Question</Button>
                                </a>
                              );
                            }
                          }
                        ]}
                        defaultPageSize={20}
                        className="-striped -highlight"
                      />
                    </Col>
                  </Row>
                  <br />
                </Container>
              </div>
            )}
          </main>
        </div>
      </Preloader>
    );
  }
}
