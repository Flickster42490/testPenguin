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
import ReactTable from "react-table";
import "status-indicator/styles.css";
import "react-table/react-table.css";

const mockData = [
  {
    candidate: "John Smith",
    testName: "Accounting",
    dateIssued: "01/01/2018",
    status: "completed",
    dateUpdated: "01/02/2018",
    multipleChoice: "6/8",
    fillInBlank: "1/6",
    moduleId: "00001"
  },
  {
    candidate: "Max Li",
    testName: "Finance",
    dateIssued: "01/01/2018",
    status: "started",
    dateUpdated: "01/02/2018",
    multipleChoice: "",
    fillInBlank: "",
    moduleId: "00002"
  },
  {
    candidate: "Jane Smith",
    testName: "CPA (Custom)",
    dateIssued: "01/01/2018",
    status: "completed",
    dateUpdated: "01/02/2018",
    multipleChoice: "22/24",
    fillInBlank: "40/40",
    moduleId: "00003"
  },
  {
    candidate: "Lesley Little",
    testName: "Accounting",
    dateIssued: "01/01/2018",
    status: "completed",
    dateUpdated: "01/02/2018",
    multipleChoice: "8/8",
    fillInBlank: "6/6",
    moduleId: "00004"
  },
  {
    candidate: "Drew Tevrizian",
    testName: "Finance II",
    dateIssued: "01/01/2018",
    status: "started",
    dateUpdated: "01/02/2018",
    multipleChoice: "",
    fillInBlank: "",
    moduleId: "00005"
  }
];

class Dashboard extends Component {
  getStatusColor(value) {
    if (!value) return <status-indicator active />;
    else if (value > 90) return <status-indicator positive />;
    else if (value > 50) return <status-indicator intermediary />;
    else return <status-indicator negative />;
  }
  render() {
    return (
      <div>
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
              data={mockData}
              sortable={false}
              columns={[
                {
                  Header: "Candidate",
                  accessor: "candidate",
                  Cell: cell => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <div style={{ maxWidth: "50%", fontSize: "1.2rem" }}>
                        <strong>{cell.value}</strong>
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
                          {cell.original.testName}
                        </div>
                        <div>
                          <strong>Test Issued: </strong>
                          {cell.original.dateIssued}
                        </div>
                        <div>
                          <strong>Test Status: </strong>
                          {cell.original.status} on {cell.original.dateUpdated}
                        </div>
                      </div>
                    );
                  }
                },
                {
                  Header: "Score Results",
                  Cell: cell => {
                    const multipleChoice = cell.original.multipleChoice;
                    const fillInBlank = cell.original.fillInBlank;
                    const mcValue = multipleChoice
                      ? Number(multipleChoice.split("/")[0]) /
                        Number(multipleChoice.split("/")[1]) *
                        100
                      : null;
                    const fbValue = fillInBlank
                      ? Number(fillInBlank.split("/")[0]) /
                        Number(fillInBlank.split("/")[1]) *
                        100
                      : null;

                    return (
                      <div>
                        <div>
                          <strong>Multiple Choice: </strong>
                          {cell.original.multipleChoice || "Pending"}
                          {"  "}
                          {this.getStatusColor(mcValue)}
                        </div>
                        <div>
                          <strong>Fill In Blanks: </strong>
                          {cell.original.fillInBlank || "Pending"}
                          {"  "}
                          {this.getStatusColor(fbValue)}
                        </div>
                        <div>
                          <strong>Modules: </strong>
                          <a href={`/#/modules/${cell.original.modules}`}>
                            Review
                          </a>
                        </div>
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
                            href="#/candidates/reviewResults"
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
      </div>
    );
  }
}

export default Dashboard;
