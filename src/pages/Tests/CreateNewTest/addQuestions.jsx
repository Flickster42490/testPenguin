import React, { Component } from "react";
import { hashHistory } from "react-router";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Progress,
  Collapse,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
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

export default class addQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionLibraryDisplayed: false
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleOpenLibrary = this.handleOpenLibrary.bind(this);
  }

  handleNext() {
    hashHistory.push("tests/createNewTest/settings");
  }

  handleOpenLibrary() {
    this.setState({
      questionLibraryDisplayed: true
    });
  }

  render() {
    return (
      <div>
        <Card>
          <Container style={{ marginTop: "10px" }}>
            <Row>
              <Col xs="12">
                <div className="text-center">
                  <h3>Add Questions</h3> (<strong>step 2 of 4</strong>)
                </div>
              </Col>
              <br />
            </Row>
            <Row>
              <Col xs="12">
                <div className="text-center">
                  <div className="progress">
                    <Progress bar color="success" value="2" max="4" />
                  </div>
                  <br />
                </div>
              </Col>
            </Row>
            {!this.state.questionLibraryDisplayed && (
              <Row>
                <Col xs="12">
                  <div className="text-center">
                    <ButtonGroup
                      size="sm"
                      vertical
                      style={{
                        maxWidth: "50%"
                      }}
                    >
                      <Button
                        size="sm"
                        color="primary"
                        onClick={() => this.handleOpenLibrary()}
                      >
                        Open Question Library
                      </Button>
                    </ButtonGroup>
                  </div>
                </Col>
              </Row>
            )}

            {this.state.questionLibraryDisplayed && (
              <div>
                <hr />
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
                              <div
                                style={{ maxWidth: "50%", fontSize: "1rem" }}
                              >
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
                                  Add Question
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
            )}
            <br />
            <Row style={{ float: "right" }}>
              <Col xs="4">
                <Button color="success" onClick={() => this.handleNext()}>
                  Next
                </Button>
              </Col>
            </Row>
            <br />
            <br />
            <br />
          </Container>
        </Card>
      </div>
    );
  }
}
