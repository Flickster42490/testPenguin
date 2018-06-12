import React, { Component } from "react";
import {
  Container,
  Row,
  Alert,
  Col,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Progress
} from "reactstrap";
import moment from "moment";
import ReactTable from "react-table";
import axios from "axios";
import "status-indicator/styles.css";
import "react-table/react-table.css";

const typeMap = {
  journalEntry: "Journal Entry",
  multipleChoice: "Multiple Choice",
  reconciliation: "Reconciliation"
};
const getStatusColor = value => {
  value = value * 100;
  if (!value) return <status-indicator active />;
  else if (value > 90) return <status-indicator positive />;
  else if (value > 50) return <status-indicator intermediary />;
  else return <status-indicator negative />;
};
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidateList: props.candidateList,
      userId: props.userId,
      showReminderAlert: false,
      visible: false
    };

    this.handleSendReminder = this.handleSendReminder.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentWillReceiveProps(np) {
    this.setState(
      {
        candidateList: np.candidateList
      },
      () => {
        this.forceUpdate();
      }
    );
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  handleSendReminder(candidateId, candidateEmail, testAttemptId, testId) {
    axios
      .post("/testAttempts/sendReminder", {
        userId: this.state.userId,
        candidateId: candidateId,
        testAttemptId: testAttemptId,
        testId: testId,
        candidateEmail: candidateEmail,
        lastReminderSent: moment(new Date()).format("MM/DD/YYYYTHH:mm:ss")
      })
      .then(d => {
        console.log(d);
        this.setState({
          candidateList: this.state.candidateList.map(c => {
            if (c.id === d.data[0].id)
              return Object.assign(c, {
                last_reminder_sent: d.data[0].last_reminder_sent
              });
            else return c;
          }),
          showReminderAlert: true,
          visible: true
        });
        this.props.handleRefetch();
      });
  }

  render() {
    return (
      <div>
        <Alert
          color="success"
          isOpen={this.state.visible}
          toggle={this.onDismiss}
        >
          The requested reminder has been successfully sent.{" "}
        </Alert>
        <ReactTable
          style={{ backgroundColor: "white" }}
          data={this.state.candidateList}
          sortable={false}
          noDataText={`No Candidates Matched Your Criteria. Please Try Again.`}
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
                    <br />
                    {cell.original.email_address}
                  </div>
                </div>
              )
            },
            {
              Header: "Invitation Details",
              Cell: cell => {
                return (
                  <div style={{ textAlign: "left", paddingLeft: "10px" }}>
                    <div>
                      <strong>Test Name: </strong>
                      {cell.original.name}
                    </div>
                    <div>
                      <strong>Test Issued: </strong>
                      {moment(cell.original.invited_at).format(
                        "MM/DD/YYYY hh:mm a"
                      )}
                    </div>
                    <div>
                      <strong>Test Status: </strong>
                      {cell.original.completed_at && (
                        <span>
                          Completed on{" "}
                          {moment(cell.original.completed_at).format(
                            "MM/DD/YYYY hh:mm a"
                          )}
                        </span>
                      )}
                      {cell.original.started_at &&
                        !cell.original.completed_at && (
                          <span>
                            Started on{" "}
                            {moment(cell.original.started_at).format(
                              "MM/DD/YYYY hh:mm a"
                            )}
                          </span>
                        )}
                      {!cell.original.started_at &&
                        !cell.original.completed_at && <span>Not Started</span>}
                    </div>
                    {!cell.original.started_at &&
                      !cell.original.completed_at &&
                      cell.original.last_reminder_sent && (
                        <div>
                          <strong>Last Reminded on: </strong>
                          <span>
                            {" "}
                            {moment(cell.original.last_reminder_sent).format(
                              "MM/DD/YYYY hh:mm a"
                            )}
                          </span>
                        </div>
                      )}
                  </div>
                );
              }
            },
            {
              Header: "Score Results",
              accessor: "results",
              maxWidth: 250,
              Cell: cell => {
                let resultList = [];
                _.forOwn(cell.value, (v, k) => {
                  resultList.push(
                    <div key={k}>
                      <strong>{typeMap[k]}: </strong>
                      {k === "multipleChoice" && (
                        <span>
                          {v.correct}/{v.correct + v.wrong}{" "}
                          {getStatusColor(v.correct / (v.correct + v.wrong))}
                        </span>
                      )}
                      {k === "journalEntry" && (
                        <span>
                          {v.correctRows}/{v.correctRows + v.wrongRows}{" "}
                          {getStatusColor(
                            v.correctRows / (v.correctRows + v.wrongRows)
                          )}
                        </span>
                      )}
                      {k === "reconciliation" && (
                        <span>
                          {v.correctRows}/{v.correctRows + v.wrongRows}{" "}
                          {getStatusColor(
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
              maxWidth: 150,
              Cell: cell => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ButtonGroup size="sm" vertical>
                    {cell.original.completed_at && (
                      <a
                        href={`#/dashboard/candidates/reviewResults?id=${
                          cell.original.test_attempt_id
                        }`}
                        style={{ color: "#fff" }}
                      >
                        <Button size="sm" color="primary">
                          Review Results
                        </Button>
                      </a>
                    )}
                    {!cell.original.completed_at && (
                      <a
                        onClick={() =>
                          this.handleSendReminder(
                            cell.original.user_id,
                            cell.original.email_address,
                            cell.original.id,
                            cell.original.test_id
                          )
                        }
                        style={{ color: "#fff" }}
                      >
                        <Button size="sm" color="danger">
                          Send Reminder
                        </Button>
                      </a>
                    )}
                  </ButtonGroup>
                </div>
              )
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
        />
      </div>
    );
  }
}
