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
import moment from "moment";
import ReactTable from "react-table";
import "status-indicator/styles.css";
import "react-table/react-table.css";

const typeMap = {
  journalEntry: "Journal Entry",
  multipleChoice: "Multiple Choice"
};
const getStatusColor = value => {
  value = value * 100;
  if (!value) return <status-indicator active />;
  else if (value > 90) return <status-indicator positive />;
  else if (value > 50) return <status-indicator intermediary />;
  else return <status-indicator negative />;
};
export default props => (
  <ReactTable
    style={{ backgroundColor: "white" }}
    data={props.candidateList}
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
        )
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
                {moment(cell.original.invited_at).format("MM/DD/YYYY hh:mm a")}
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
              {cell.original.completed_at && (
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
              )}
              <Button size="sm" color="danger">
                Flag as Important
              </Button>
              {/* <Button size="sm" color="default">
                            Archive Test
                          </Button> */}
            </ButtonGroup>
          </div>
        )
      }
    ]}
    defaultPageSize={5}
    className="-striped -highlight"
  />
);
