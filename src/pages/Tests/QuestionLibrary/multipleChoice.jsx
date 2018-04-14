import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Progress
} from "reactstrap";
import _ from "lodash";
import FontAwesome from "react-fontawesome";

const MCMockData = {
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

export default class PreviewMultipleChoice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question: this.props.question[0]
    };
  }
  render() {
    const { question } = this.state;
    return (
      <div>
        <Card className="module-container-card">
          <CardHeader className="preview-title">
            <Row>
              <Col md="10">
                <h3>{question.name}</h3>
              </Col>
              <Col md="2">
                <a href="#/dashboard/tests/questionLibrary">
                  <FontAwesome name="chevron-circle-left" size="2x" /> &nbsp; Go
                  Back
                </a>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Card className="transparent-card">
              <CardHeader className="transparent-card-header">
                <h4
                  dangerouslySetInnerHTML={{
                    __html: question.mc_stem
                  }}
                />
              </CardHeader>
              <CardBody className="transparent-card-body">
                {question.mc_choices.map((i, idx) => (
                  <Button
                    color="secondary"
                    outline
                    block
                    key={idx}
                    data-id={i.id}
                  >
                    {i.value}
                  </Button>
                ))}
                <br />
                <strong>Correct Answer:&nbsp;</strong>
                {_.find(question.mc_choices, { id: question.mc_answer }).value}
              </CardBody>
            </Card>
            <br />
          </CardBody>
          <CardFooter>
            <Card className="transparent-card">
              <CardHeader className="transparent-card-header">
                <strong>Question Notes:</strong>
              </CardHeader>
              <CardBody className="transparent-card-body">
                <span
                  dangerouslySetInnerHTML={{
                    __html: question.notes
                  }}
                />
              </CardBody>
            </Card>
          </CardFooter>
        </Card>
      </div>
    );
  }
}
