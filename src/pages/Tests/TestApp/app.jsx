import React, { Component } from "react";
import axios from "axios";
import queryString from "querystring";
import { Row, Col, Card, CardHeader, Button } from "reactstrap";

import ModuleBody from "./moduleBody.jsx";
import MultipleChoice from "./multipleChoiceBody.jsx";
import { Preloader } from "../../../components/Preloader.jsx";
import Countdown from "../../../components/Countdown/Countdown";

export default class TestApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      currentIdx: 0,
      lastIdx: null,
      currentQuestion: null,
      startTime: Date.now(),
      preview: false
    };

    this.handleNextQuestion = this.handleNextQuestion.bind(this);
  }

  componentWillMount() {
    const queries = window.location.hash.split("?")[1];
    const testId = queryString.parse(queries).id;
    const preview = Boolean(queryString.parse(queries).preview) || false;
    const returnTo = queryString.parse(queries).returnTo;
    axios.get(`/tests/id/${testId}/questions`).then(d => {
      this.setState(
        {
          questions: d.data,
          lastIdx: d.data.length - 1,
          currentQuestion: d.data[this.state.currentIdx],
          preview: preview,
          testId: testId,
          returnTo: returnTo,
          estimatedTime: d.data.reduce(
            (sum, i) => (sum = sum + Number(i.estimated_time)),
            0
          )
        },
        () => {
          this.forceUpdate();
        }
      );
    });
  }

  handleNextQuestion() {
    this.setState(
      {
        currentIdx: this.state.currentIdx + 1
      },
      () => {
        this.forceUpdate();
      }
    );
  }

  timerRender({ hours, minutes, seconds, completed }) {
    if (completed) {
      return <span>That's It</span>;
    } else {
      return (
        <h4>
          Remaining Time: {hours} Hr {minutes} Min {seconds} Sec
        </h4>
      );
    }
  }

  render() {
    const {
      questions,
      currentIdx,
      lastIdx,
      startTime,
      preview,
      returnTo,
      testId,
      estimatedTime
    } = this.state;
    const question = questions[currentIdx];
    const testLength = questions.length;
    console.log(preview);
    return (
      <div>
        <Preloader loading={questions.length < 1}>
          {questions[currentIdx] && (
            <Card className="module-container-card">
              <CardHeader className="preview-title">
                <Row>
                  <Col md="5">
                    <h3>
                      {question.name} &nbsp;&nbsp;
                      <span className="question-subtitle">
                        (Question {currentIdx + 1} of {testLength})
                      </span>
                    </h3>
                  </Col>
                  <Col md="4">
                    <Countdown
                      date={startTime + estimatedTime * 60000}
                      renderer={this.timerRender}
                    />
                  </Col>
                  <Col md="3">
                    {currentIdx !== lastIdx && (
                      <Button
                        size="lg"
                        color="primary"
                        className="float-right"
                        onClick={this.handleNextQuestion}
                      >
                        Next Question
                      </Button>
                    )}
                    {currentIdx === lastIdx && (
                      <Button size="lg" color="success" className="float-right">
                        {preview && (
                          <a href={`${returnTo}?id=${testId}`}>Finish Test</a>
                        )}
                      </Button>
                    )}
                    <Button
                      size="lg"
                      outline
                      color="secondary"
                      className="float-right"
                      disabled={preview}
                    >
                      Save Progress
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              {questions[currentIdx].type === "module" && (
                <ModuleBody
                  question={questions[currentIdx]}
                  currentIdx={currentIdx}
                  questionList={questions}
                  preview={preview}
                />
              )}
              {questions[currentIdx].type === "multiple_choice" && (
                <MultipleChoice
                  question={questions[currentIdx]}
                  currentIdx={currentIdx}
                  questionList={questions}
                  preview={preview}
                />
              )}
            </Card>
          )}
        </Preloader>
      </div>
    );
  }
}
