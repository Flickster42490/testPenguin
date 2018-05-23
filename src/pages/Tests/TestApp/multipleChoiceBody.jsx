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
    console.log(props);
    this.state = {
      question: props.question,
      questionAnswered: props.questionAnswered || undefined,
      preview: props.preview,
      review: props.review,
      module: props.module || false,
      currentSelectedIdx: null
    };
  }

  componentWillReceiveProps(props) {
    this.setState(
      {
        question: this.props.question,
        questionAnswered: this.props.questionAnswered
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
    const {
      question,
      questionAnswered,
      preview,
      review,
      module,
      currentSelectedIdx
    } = this.state;
    return (
      <div>
        {!module && (
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
                {!preview &&
                  !review &&
                  question.mc_choices.map((i, idx) => {
                    return (
                      <div className="radio">
                        <label>
                          <input
                            type="radio"
                            value={i.id}
                            checked={
                              questionAnswered &&
                              questionAnswered.mc_candidate_answer === i.id
                            }
                            onChange={() => this.toggleSelected(idx, i)}
                          />
                          &nbsp;&nbsp;{i.value}
                        </label>
                      </div>
                    );
                  })}
                {preview && (
                  <div>
                    {question.mc_choices.map((i, idx) => {
                      return (
                        <div className="radio">
                          <label>
                            <input
                              type="radio"
                              value={i.id}
                              checked={question.mc_answer === i.id}
                              disabled
                            />
                            &nbsp;&nbsp;{i.value}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
                {review && (
                  <div>
                    {question.mc_choices.map((i, idx) => {
                      return (
                        <div className="radio">
                          <label>
                            <input
                              type="radio"
                              value={i.id}
                              checked={
                                questionAnswered.mc_candidate_answer === i.id
                              }
                              disabled
                            />
                            &nbsp;&nbsp;{i.value}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
                {(preview || review) && (
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
        )}
        {module && (
          <div>
            <h5
              dangerouslySetInnerHTML={{
                __html: question.mc_stem
              }}
            />
            {question.mc_choices.map((i, idx) => (
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    value={i.id}
                    checked={question.mc_answer === i.id}
                    disabled
                  />
                  &nbsp;&nbsp;{i.value}
                </label>
              </div>
            ))}
          </div>
        )}
        <br />
      </div>
    );
  }
}
