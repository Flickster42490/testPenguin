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
    categories: ["Accounting", "Finance", "Finance II", "CPA"]
  }
];

export default class PreBuiltTests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tests: []
    };
  }

  componentWillMount() {
    axios.get("/tests/type/pre_built").then(d => {
      this.setState({
        tests: d.data
      });
    });
  }

  render() {
    console.log(this.state.tests);
    const { tests } = this.state;
    return (
      <div>
        <Row>
          <Col xs="12">
            <ReactTable
              style={{ backgroundColor: "white" }}
              data={tests}
              sortable={false}
              columns={[
                {
                  Header: "Test Name",
                  accessor: "name",
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
                  Header: "Estimated Time",
                  accessor: "estimated_time",
                  Cell: cell => <span>{cell.original.estimated_time} mins</span>
                },
                {
                  Header: "Question Types",
                  accessor: "question_types",
                  Cell: cell => (
                    <div>
                      <span>{cell.value.multiple_choice} Multiple Choices</span>
                      <br />
                      <span>{cell.value.module} Modules</span>
                    </div>
                  )
                },
                {
                  Header: "Categories",
                  accessor: "tags",
                  Cell: cell => (
                    <div>
                      {cell.value.map((i, idx, arr) => {
                        if (idx === arr.length - 1) {
                          return <span>{i}</span>;
                        }
                        return (
                          <span>
                            {i}
                            <br />
                          </span>
                        );
                      })}
                    </div>
                  )
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
                            href={`/#/dashboard/tests/preBuiltTests/viewQuestions?id=${
                              cell.original.id
                            }`}
                          >
                            View Questions
                          </a>
                        </Button>
                        <Button size="sm" color="success">
                          Invite Candidates
                        </Button>
                        <Button size="sm" color="secondary">
                          <a
                            href={`/#/testApp/app?id=${
                              cell.original.id
                            }&preview=true&returnTo=${window.location.hash}`}
                          >
                            Preview Test
                          </a>
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
