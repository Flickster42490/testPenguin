import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Progress
} from "reactstrap";

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

export default class Preview extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div>
        <Card>
          <Container style={{ marginTop: "10px" }}>
            <Row>
              <Col xs="3">
                <h3>A/P Clerk</h3>
              </Col>
              <Col xs="3">
                <h5>Skills Tested: {mockData.skillsTested}</h5>
              </Col>
              <Col xs="3">
                <h5>Difficulty: {mockData.difficulty}</h5>
              </Col>
              <Col xs="3">
                <h5>Question Type: {mockData.type}</h5>
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
                <strong>Correct Answer:</strong>
                {mockData.answerChoices[mockData.correctAnswer]}
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs="1" />
              <Col xs="10">
                <strong>Notes: </strong>
                <br />
                <p>{mockData.notes}</p>
              </Col>
            </Row>
            <br />
          </Container>
        </Card>
      </div>
    );
  }
}
