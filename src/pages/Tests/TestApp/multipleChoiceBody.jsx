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
import queryString from "querystring";
import _ from "lodash";
import FontAwesome from "react-fontawesome";

export default class MultipleChoiceBody extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question: this.props.question
    };
  }

  componentWillReceiveProps(props) {
    this.setState(
      {
        question: this.props.question
      },
      () => {
        this.forceUpdate();
      }
    );
  }

  render() {
    const { question } = this.state;
    return (
      <div>
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
      </div>
    );
  }
}
