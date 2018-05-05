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
      question: props.question,
      preview: props.preview || props.review,
      currentSelectedIdx: null
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

  toggleSelected(idx, choice) {
    let { question } = this.state;
    this.setState(
      {
        question: Object.assign(question, { mc_candidate_answer: choice.id }),
        currentSelectedIdx: idx
      },
      () => {
        this.props.handleAnswerUpdate(this.state.question);
      }
    );
  }

  render() {
    const { question, preview, currentSelectedIdx } = this.state;
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
                  active={currentSelectedIdx === idx}
                  outline
                  block
                  key={idx}
                  data-id={i.id}
                  onClick={() => this.toggleSelected(idx, i)}
                >
                  {i.value}
                </Button>
              ))}
              {preview && (
                <div>
                  <br />
                  <strong>Correct Answer:&nbsp;</strong>
                  {
                    _.find(question.mc_choices, { id: question.mc_answer })
                      .value
                  }
                </div>
              )}
            </CardBody>
          </Card>
          <br />
        </CardBody>
      </div>
    );
  }
}
