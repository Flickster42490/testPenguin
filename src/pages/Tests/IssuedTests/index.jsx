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
import "react-table/react-table.css";

const mockData = [
  {
    testName: "A/P Clerk",
    estimatedTime: "60",
    mcNumber: 6,
    fbNumber: 12,
    moduleNumber: 2,
    candidatesTested: 44,
    testType: "Pre-Built"
  },
  {
    testName: "BookKeeper",
    estimatedTime: "60",
    mcNumber: 6,
    fbNumber: 12,
    moduleNumber: 2,
    candidatesTested: 5,
    testType: "Custom"
  },
  {
    testName: "Assistant Controller",
    estimatedTime: "60",
    mcNumber: 6,
    fbNumber: 12,
    moduleNumber: 2,
    candidatesTested: 88,
    testType: "Custom"
  }
];

export default class QuestionLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs="12">
            <ReactTable
              style={{ backgroundColor: "white" }}
              data={mockData}
              sortable={false}
              columns={[
                {
                  Header: "Name",
                  accessor: "testName",
                  Cell: cell => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <div style={{ maxWidth: "50%", fontSize: "1rem" }}>
                        <strong>{cell.value}</strong>
                      </div>
                    </div>
                  ),
                  maxWidth: 240
                },
                {
                  Header: "Overview",
                  Cell: cell => {
                    return (
                      <div>
                        <div>
                          <strong>Estimated Time: </strong>
                          {cell.original.estimatedTime} mins
                          {/* will want to use moment duration fomrat */}
                        </div>
                        <div>
                          <strong>Questions: </strong>
                          {cell.original.mcNumber} Multiple Choice,
                          {cell.original.fbNumber} Fill In Blank,
                          {cell.original.moduleNumber} Modules
                        </div>
                        <div>
                          <strong>Type : </strong>
                          {cell.original.testType}
                        </div>
                      </div>
                    );
                  }
                },
                {
                  Header: "Details",
                  Cell: cell => {
                    return (
                      <div>
                        <div>
                          <strong>Candidates Tested: </strong>
                          {cell.original.candidatesTested}
                        </div>
                        <div>
                          <strong>Type : </strong>
                          {cell.original.testType}
                        </div>
                      </div>
                    );
                  },
                  maxWidth: 200
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
                            href={`/#/dashboard/tests/issuedTests/review?id=${
                              cell.original.test_id
                            }`}
                          >
                            Review
                          </a>
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
