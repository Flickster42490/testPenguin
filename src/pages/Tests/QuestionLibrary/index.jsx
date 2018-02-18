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
    categories: ["Accounting", "Finance", "Finance II", "CPA"]
  },
  {
    testName: "BookKeeper",
    estimatedTime: "60",
    mcNumber: 6,
    fbNumber: 12,
    moduleNumber: 2,
    categories: ["Accounting", "Finance", "Finance II", "CPA"]
  },
  {
    testName: "Assistant Controller",
    estimatedTime: "60",
    mcNumber: 6,
    fbNumber: 12,
    moduleNumber: 2,
    categories: ["Accounting", "Finance", "Finance II", "CPA"]
  },
  {
    testName: "Cost Accountant",
    estimatedTime: "60",
    mcNumber: 6,
    fbNumber: 12,
    moduleNumber: 2,
    categories: ["Accounting", "Finance", "Finance II", "CPA"]
  },
  {
    testName: "CPA",
    estimatedTime: "60",
    mcNumber: 6,
    fbNumber: 12,
    moduleNumber: 2,
    categories: ["Finance", "Finance II", "CPA"]
  }
];

export default class QuestionLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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
                  Header: "Test Name",
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
                  )
                },
                {
                  Header: "Details",
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
                          <strong>Will Test Candidates in : </strong>
                          {cell.original.categories.map((i, idx) => {
                            if (idx === 0) return <span>{i}</span>;
                            else return <span>, {i}</span>;
                          })}
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
                          View Questions
                        </Button>
                        <Button size="sm" color="success">
                          Invite Candidates
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
