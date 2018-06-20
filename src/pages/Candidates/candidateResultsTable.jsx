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
  reconciliation: "Reconciliation",
  financialStatement: "Financial Statement"
};
const getStatusColor = value => {
  value = value * 100;
  if (!value && value !== 0) return <status-indicator active />;
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

  handleSendReminder(
    candidateId,
    candidateEmail,
    testAttemptId,
    testId,
    expiringAt
  ) {
    axios
      .post("/testAttempts/sendReminder", {
        userId: this.state.userId,
        candidateId: candidateId,
        testAttemptId: testAttemptId,
        expiringAt: expiringAt,
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
          noDataText={
            this.props.emptyMessage
              ? this.props.emptyMessage
              : `No Candidates Matched Your Criteria. Please Try Again.`
          }
          columns={[
            {
              Header: "Candidate",
              maxWidth: 250,
              minWidth: 220,
              sortable: false,
              Cell: cell => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <div>
                    {cell.original.first_name &&
                      cell.original.completed_at && (
                        <div>
                          <a
                            href={`#/dashboard/candidates/reviewResults?id=${
                              cell.original.test_attempt_id
                            }`}
                          >
                            <strong>
                              {cell.original.first_name}{" "}
                              {cell.original.last_name}
                            </strong>
                          </a>
                          <br />
                        </div>
                      )}
                    {cell.original.completed_at && (
                      <a
                        href={`#/dashboard/candidates/reviewResults?id=${
                          cell.original.test_attempt_id
                        }`}
                      >
                        <span>{cell.original.email_address}</span>
                      </a>
                    )}
                    {!cell.original.completed_at && (
                      <span>{cell.original.email_address}</span>
                    )}
                  </div>
                </div>
              )
            },
            {
              Header: "Test Name",
              accessor: "name",
              sortable: true
            },
            {
              Header: "Test Issue Date",
              accessor: "invited_at",
              sortable: true,
              sortMethod: (a, b) => {
                return moment(a).isBefore(moment(b)) ? -1 : 1;
              },
              Cell: cell => {
                return this.props.issuedTestPage ? (
                  <span>
                    {moment(cell.original.invited_at).format("MM/DD/YYYY")}
                  </span>
                ) : (
                  <span>
                    {moment(cell.original.invited_at).format(
                      "MM/DD/YYYY hh:mm a"
                    )}
                  </span>
                );
              }
            },
            {
              Header: "Test Status",
              sortable: false,
              Cell: cell => {
                return (
                  <div>
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
                );
              }
            },
            {
              Header: "Score Results",
              accessor: "results",
              maxWidth: 250,
              minWidth: 220,
              sortable: false,
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
                      {k === "financialStatement" && (
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
                    {!cell.original.completed_at && (
                      <span>N/A - Not Yet Completed</span>
                    )}

                    {cell.original.completed_at && resultList}
                  </div>
                );
              }
            },
            {
              Header: "Actions",
              maxWidth: 200,
              sortable: false,
              Cell: cell => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ButtonGroup
                    size={this.props.issuedTestPage ? "sm" : "md"}
                    vertical
                  >
                    {cell.original.completed_at && (
                      <a
                        href={`#/dashboard/candidates/reviewResults?id=${
                          cell.original.test_attempt_id
                        }`}
                        style={{ color: "#fff" }}
                      >
                        <Button size="md" color="primary">
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
                            cell.original.test_id,
                            cell.original.expiring_at
                          )
                        }
                        style={{ color: "#fff" }}
                      >
                        <Button size="md" color="danger">
                          Send Reminder
                        </Button>
                      </a>
                    )}
                  </ButtonGroup>
                </div>
              )
            }
          ]}
          defaultSorted={[
            {
              id: "invited_at",
              desc: true
            }
          ]}
          defaultPageSize={
            this.state.candidateList.length <= 5
              ? 5
              : this.state.candidateList.length < 10
                ? this.state.candidateList.length
                : 10
          }
          pageSizeOptions={[10, 20, 50]}
          showPageSizeOptions={!this.props.issuedTestPage}
          className="-striped -highlight"
        />
      </div>
    );
  }
}
