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
    questionName: "A/P Clerk",
    estimatedTime: 3,
    type: "Multiple Choice",
    difficulty: "Easy",
    categories: ["Finance"]
  },
  {
    questionName: "Batch Coding",
    estimatedTime: 2,
    type: "Multiple Choice",
    difficulty: "Medium",
    categories: ["Accounting"]
  },
  {
    questionName: "ChargeBacks",
    estimatedTime: 5,
    type: "Fill In Blank",
    difficulty: "Hard",
    categories: ["CPA"]
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
        <Row style={{ textAlign: "center" }}>
          <Col xs="12">
            <ButtonGroup size="lg" block>
              <Button outline color="default">
                All Question Types (3)
              </Button>
              <Button outline color="default">
                Multiple Choice (1)
              </Button>
              <Button outline color="default">
                Fill In Blank (2)
              </Button>
              <Button outline color="default">
                Short Answer (0)
              </Button>
              <Button outline color="default">
                Modules (0)
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
                  Header: "Question Name",
                  accessor: "questionName",
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
                          <strong>Type: </strong>
                          {cell.original.type} mins
                          {/* will want to use moment duration fomrat */}
                        </div>
                        <div>
                          <strong>Estimated Time: </strong>
                          {cell.original.estimatedTime} mins
                          {/* will want to use moment duration fomrat */}
                        </div>
                        <div>
                          <strong>Difficulty: </strong>
                          {cell.original.difficulty}
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
                          <a href="/#/dashboard/tests/questionLibrary/preview?mcq=1">
                            Preview Question
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
