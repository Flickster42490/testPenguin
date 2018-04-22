import React, { Component } from "react";
import axios from "axios";
import queryString from "querystring";
import { Row, Col, Card, CardHeader, Button } from "reactstrap";
import { hashHistory } from "react-router";
import FontAwesome from "react-fontawesome";
import _ from "lodash";

import ModuleBody from "./moduleBody.jsx";
import MultipleChoice from "./multipleChoiceBody.jsx";
import { Preloader } from "../../../components/Preloader.jsx";
import Countdown from "../../../components/Countdown/Countdown";

const deepCopy = oldObj => {
  var newObj = oldObj;
  if (oldObj && typeof oldObj === "object") {
    newObj =
      Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
    for (var i in oldObj) {
      newObj[i] = deepCopy(oldObj[i]);
    }
  }
  return newObj;
};

export default class TestApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      questionsAnswered: [],
      currentIdx: 0,
      lastIdx: null,
      currentQuestion: null,
      startTime: Date.now(),
      preview: false
    };

    this.handleNextQuestion = this.handleNextQuestion.bind(this);
    this.handleAnswerUpdate = this.handleAnswerUpdate.bind(this);
    this.handleSaveProgress = this.handleSaveProgress.bind(this);
    this.handleSubmitTest = this.handleSubmitTest.bind(this);
  }

  componentWillMount() {
    const queries = window.location.hash.split("?")[1];
    const preview = Boolean(queryString.parse(queries).preview) || false;
    const { testId, candidateId, id } = queryString.parse(queries);
    const returnTo = queryString.parse(queries).returnTo;
    axios.get(`/tests/id/${testId}/questions`).then(d => {
      d.data.forEach(
        i => (i.module_candidate_answer = deepCopy(i.module_format))
      );
      if (!preview) {
        axios
          .post(`/testAttempts/retrieveSavedProgress`, { id: id })
          .then(saved => {
            let candidateAnswers = saved
              ? saved.data[0].candidate_answers
              : null;
            this.setState(
              {
                questions: d.data,
                questionsAnswered: candidateAnswers || deepCopy(d.data),
                lastIdx: d.data.length - 1,
                currentQuestion: d.data[this.state.currentIdx],
                preview: preview,
                testId: testId,
                id: id,
                candidateId: candidateId,
                returnTo: returnTo,
                estimatedTime: d.data.reduce(
                  (sum, i) => (sum = sum + Number(i.estimated_time)),
                  0
                )
              },
              () => {
                console.log(this.state.questionsAnswered);
                this.forceUpdate();
              }
            );
          });
      } else {
        this.setState(
          {
            questions: d.data,
            questionsAnswered: deepCopy(d.data),
            lastIdx: d.data.length - 1,
            currentQuestion: d.data[this.state.currentIdx],
            preview: preview,
            testId: testId,
            id: id,
            candidateId: candidateId,
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
      }
    });
  }

  handleAnswerUpdate(answer) {
    let { questionsAnswered, currentIdx } = this.state;
    const updatedQuestionsAnswered = deepCopy(questionsAnswered);
    updatedQuestionsAnswered[currentIdx] = answer;
    this.setState(
      {
        questionsAnswered: updatedQuestionsAnswered
      },
      () => {
        this.forceUpdate();
      }
    );
  }

  handleSubmitTest() {
    let { testId, returnTo, candidateId, questionsAnswered, id } = this.state;
    axios
      .post(`/testAttempts/submitTest`, {
        id: id,
        candidateAnswers: questionsAnswered
      })
      .then(d => {
        if (d.status == 200) {
          if (this.state.preview)
            window.location.href = `${returnTo}?id=${testId}`;
          else
            window.location.href = `/#/testApp/completed?id=${testId}&candidateId=${candidateId}`;
        }
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

  handleSaveProgress() {
    const { id, candidateId, questionsAnswered } = this.state;
    const body = {
      userId: candidateId,
      id: id,
      candidateAnswers: questionsAnswered
    };
    this.setState(
      {
        saveSpinner: true
      },
      () => {
        axios.post("/testAttempts/saveProgress", body).then(d => {
          this.setState({
            saveSpinner: false
          });
        });
      }
    );
  }

  timerRender({ hours, minutes, seconds, completed }) {
    if (completed) {
      window.location.href = `/#/testApp/completed?id=${testId}&candidateId=${candidateId}`;
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
      questionsAnswered,
      currentIdx,
      candidateId,
      lastIdx,
      startTime,
      preview,
      returnTo,
      testId,
      estimatedTime
    } = this.state;
    const question = questions[currentIdx];
    const testLength = questions.length;
    console.log(
      "app currentidx quetstions answers",
      questionsAnswered,
      currentIdx,
      questionsAnswered[currentIdx]
    );
    return (
      <div>
        <Preloader loading={questions.length < 1}>
          {questions[currentIdx] && (
            <Card className="module-container-card">
              <CardHeader className="preview-title">
                <Row>
                  <Col md="5">
                    {preview && (
                      <h3>
                        {question.name} &nbsp;&nbsp;
                        <span className="question-subtitle">
                          (Question {currentIdx + 1} of {testLength})
                        </span>
                      </h3>
                    )}
                    {!preview && (
                      <h3>
                        Question {currentIdx + 1} of {testLength}
                      </h3>
                    )}
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
                      <Button
                        size="lg"
                        color="success"
                        className="float-right"
                        onClick={this.handleSubmitTest}
                      >
                        {preview && <a>Finish Test</a>}
                        {!preview && <a>Finish Test</a>}
                      </Button>
                    )}
                    <Button
                      size="lg"
                      outline
                      color="secondary"
                      className="float-right"
                      disabled={preview}
                      onClick={this.handleSaveProgress}
                    >
                      {this.state.saveSpinner && (
                        <span>
                          <FontAwesome name="spinner" spin />&nbsp;&nbsp;
                        </span>
                      )}
                      Save Progress
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              {questions[currentIdx].type === "module" && (
                <ModuleBody
                  question={questions[currentIdx]}
                  questionAnswered={questionsAnswered[currentIdx]}
                  currentIdx={currentIdx}
                  questionList={questions}
                  preview={preview}
                  handleAnswerUpdate={this.handleAnswerUpdate}
                />
              )}
              {questions[currentIdx].type === "multiple_choice" && (
                <MultipleChoice
                  question={questions[currentIdx]}
                  questionAnswered={questionsAnswered[currentIdx]}
                  currentIdx={currentIdx}
                  questionList={questions}
                  preview={preview}
                  handleAnswerUpdate={this.handleAnswerUpdate}
                />
              )}
            </Card>
          )}
        </Preloader>
      </div>
    );
  }
}
