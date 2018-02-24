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
import queryString from "querystring";
import Select from "react-select";
import "react-select/dist/react-select.css";

const mockData = {
  skillsTested: ["Finance"],
  difficulty: "Easy",
  type: "Multiple Choice",
  questionStem:
    "ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ",
  answerChoices: [
    "Answer Choice 1",
    "Answer Choice 2",
    "Answer Choice 3",
    "Answer Choice 4"
  ],
  correctAnswer: 1,
  notes:
    "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum "
};

export default class questionDetails extends Component {
  constructor(props) {
    super(props);

    this.handleNext = this.handleNext.bind(this);
  }

  handleNext() {
    alert("You have successfully added your question to the Question Library");
    hashHistory.push("tests/questionLibrary");
  }

  render() {
    return (
      <div>
        <Card>
          <Container style={{ marginTop: "10px" }}>
            <Row>
              <Col xs="12">
                <div className="text-center">
                  <h3>Review and Add</h3> (<strong>step 3 of 3</strong>)
                </div>
              </Col>
              <br />
            </Row>
            <Row>
              <Col xs="12">
                <div className="text-center">
                  <div className="progress">
                    <Progress
                      bar
                      color="success"
                      value="3"
                      style={{ paddingTop: "10px" }}
                      max="3"
                    />
                  </div>
                  <br />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="3">
                <h3>A/P Clerk</h3>&nbsp;&nbsp;&nbsp;&nbsp;
              </Col>
              <Col xs="3" style={{ paddingTop: "10px" }}>
                <h6>
                  Skills Tested: <strong>{mockData.skillsTested}</strong>
                </h6>&nbsp;&nbsp;
              </Col>
              <Col xs="3" style={{ paddingTop: "10px" }}>
                <h6>
                  Difficulty: <strong>{mockData.difficulty}</strong>
                </h6>&nbsp;&nbsp;
              </Col>
              <Col xs="3" style={{ paddingTop: "10px" }}>
                <h6>
                  Question Type: <strong>{mockData.type}</strong>
                </h6>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs="1" />
              <Col xs="10">
                <h4>Question Stem: </h4>
                <br />
                <p>{mockData.questionStem}</p>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs="1" />
              <Col xs="10">
                {mockData.answerChoices.map(i => (
                  <Button color="secondary" outline block>
                    {i}
                  </Button>
                ))}
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs="1" />
              <Col xs="10">
                <strong>Correct Answer:&nbsp;</strong>
                {mockData.answerChoices[mockData.correctAnswer]}
              </Col>
            </Row>
            <br />
            <Row style={{ float: "right" }}>
              <Col xs="4">
                <Button color="success" onClick={() => this.handleNext()}>
                  Add to Library{" "}
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
