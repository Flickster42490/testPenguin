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

import QuestionLibrary from "../QuestionLibrary/index.jsx";

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
    this.handleAddQuestion = this.handleAddQuestion.bind(this);
  }

  componentWillMount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  handleAddQuestion(v) {
    console.log(v);
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
                    <Progress bar color="success" value="2" max="3" />
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
                <Row style={{ maxHeight: "500px" }}>
                  <Col xs="12">
                    <h4>Question Library</h4>
                    <QuestionLibrary
                      addQuestions={true}
                      handleAddQuestion={this.handleAddQuestion}
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
