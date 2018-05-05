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
import axios from "axios";
import ReactTable from "react-table";
import "status-indicator/styles.css";
import "react-table/react-table.css";

import { Preloader } from "../../components/Preloader.jsx";

const typeMap = {
  journalEntry: "Journal Entry",
  multipleChoice: "Multiple Choice"
};

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      candidateList: []
    };
  }

  componentWillMount() {
    axios.get("/testAttempts").then(d => {
      this.setState({
        candidateList: d.data
      });
    });
  }
  getStatusColor(value) {
    value = value * 100;
    if (!value) return <status-indicator active />;
    else if (value > 90) return <status-indicator positive />;
    else if (value > 50) return <status-indicator intermediary />;
    else return <status-indicator negative />;
  }
  render() {
    const { candidateList } = this.state;
    return (
      <div>
        <Preloader loading={candidateList.length < 1}>
          <Row style={{ textAlign: "center" }}>
            <Col xs="12">
              <ButtonGroup size="lg" block>
                <Button outline color="default">
                  All Tests
                </Button>
                <Button outline color="default">
                  Waiting For Test Results
                </Button>
                <Button outline color="default">
                  Tests Completed
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs="12">
              <ReactTable
                style={{ backgroundColor: "white" }}
                data={candidateList}
                sortable={false}
                columns={[
                  {
                    Header: "Candidate",
                    Cell: cell => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <div style={{ maxWidth: "50%", fontSize: "1.2rem" }}>
                          <strong>
                            {cell.original.first_name} {cell.original.last_name}
                          </strong>
                        </div>
                      </div>
                    ),
                    maxWidth: 200
                  },
                  {
                    Header: "Invitation Details",
                    Cell: cell => {
                      return (
                        <div>
                          <div>
                            <strong>Test Name: </strong>
                            {cell.original.name}
                          </div>
                          <div>
                            <strong>Test Issued: </strong>
                            {cell.original.invited_at}
                          </div>
                          <div>
                            <strong>Test Status: </strong>
                            {cell.original.completed_at && (
                              <span>
                                Completed on {cell.original.completed_at}
                              </span>
                            )}
                            {cell.original.started_at &&
                              !cell.original.completed_at && (
                                <span>
                                  Started on {cell.original.started_at}
                                </span>
                              )}
                            {!cell.original.started_at &&
                              !cell.original.completed_at && (
                                <span>Not Started</span>
                              )}
                          </div>
                        </div>
                      );
                    }
                  },
                  {
                    Header: "Score Results",
                    accessor: "results",
                    Cell: cell => {
                      let resultList = [];
                      _.forOwn(cell.value, (v, k) => {
                        resultList.push(
                          <div>
                            <strong>{typeMap[k]}: </strong>
                            {k === "multipleChoice" && (
                              <span>
                                {v.correct}/{v.correct + v.wrong}{" "}
                                {this.getStatusColor(
                                  v.correct / (v.correct + v.wrong)
                                )}
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
                        );
                      });
                      return (
                        <div>
                          {!cell.original.completed_at && <span>Pending</span>}

                          {cell.original.completed_at && resultList}
                        </div>
                      );
                    }
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
                        <ButtonGroup
                          size="sm"
                          vertical
                          style={{
                            maxWidth: "50%"
                          }}
                        >
                          <Button size="sm" color="primary">
                            <a
                              href={`#/dashboard/candidates/reviewResults?id=${
                                cell.original.test_attempt_id
                              }`}
                              style={{ color: "#fff" }}
                            >
                              Review Results
                            </a>
                          </Button>
                          <Button size="sm" color="danger">
                            Flag as Important
                          </Button>
                          <Button size="sm" color="default">
                            Archive Test
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

export default Dashboard;
