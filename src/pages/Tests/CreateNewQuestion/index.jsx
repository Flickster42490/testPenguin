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

export default class CreateNewQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div>
        {/* <Card>
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
                {mockData.questionStem}
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs="12" />
            </Row>
          </Container>
        </Card> */}
      </div>
    );
  }
}
