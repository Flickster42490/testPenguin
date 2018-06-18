import React, { Component } from "react";
import axios from "axios";
import queryString from "querystring";
import { Row, Col, Card, CardHeader, Container, Button } from "reactstrap";
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
      preview: false,
      review: false,
      testAttemp: undefined
    };

    this.handleNextQuestion = this.handleNextQuestion.bind(this);
    this.handleAnswerUpdate = this.handleAnswerUpdate.bind(this);
    this.handleSaveProgress = this.handleSaveProgress.bind(this);
    this.handleSubmitTest = this.handleSubmitTest.bind(this);
    this.handleEndPreview = this.handleEndPreview.bind(this);
    this.timerRender = this.timerRender.bind(this);
    this.onTimerTick = this.onTimerTick.bind(this);
    this.onTimerComplete = this.onTimerComplete.bind(this);
  }

  componentWillMount() {
    window.addEventListener("beforeunload", ev => {
      ev.preventDefault();
      const {
        id,
        candidateId,
        questionsAnswered,
        hoursLeft,
        minutesLeft,
        secondsLeft,
        currentIdx
      } = this.state;
      const body = {
        userId: candidateId,
        id: id,
        candidateAnswers: questionsAnswered,
        timeLeft: {
          hours: hoursLeft,
          minutes: minutesLeft,
          seconds: secondsLeft
        },
        savedProgressIndex: currentIdx
      };
      axios.post("testAttempts/saveProgress", body);
    });
    window.scrollTo(0, 0);
    const queries = window.location.hash.split("?")[1];
    const preview = Boolean(queryString.parse(queries).preview) || false;
    const review = Boolean(queryString.parse(queries).review) || false;
    const { testId, candidateId, id, reviewIdx } = queryString.parse(queries);
    const returnTo = queryString.parse(queries).returnTo;
    let currentIdx = this.state.currentIdx;
    if (reviewIdx) currentIdx = reviewIdx;
    axios.get(`/tests/id/${testId}/questions`).then(d => {
      d.data.forEach(
        i => (i.module_candidate_answer = deepCopy(i.module_format))
      );
      axios.get(`/tests/${testId}`).then(t => {
        if (!preview && !review) {
          axios
            .post(`/testAttempts/retrieveSavedProgress`, { id: id })
            .then(saved => {
              let candidateAnswers = saved
                ? saved.data[0].candidate_answers
                : null;
              currentIdx = saved.data[0].saved_progress_index || 0;

              axios.get(`/testAttempts/${id}`).then(attempt => {
                this.setState(
                  {
                    questions: d.data,
                    questionsAnswered: candidateAnswers || deepCopy(d.data),
                    lastIdx: d.data.length - 1,
                    currentQuestion: d.data[currentIdx],
                    currentIdx: currentIdx,
                    preview: preview,
                    testAttempt: attempt.data[0] || undefined,
                    testId: testId,
                    id: id,
                    candidateId: candidateId,
                    returnTo: returnTo,
                    estimatedTime: t.data[0].estimated_time,
                    timeLeft: saved.data[0].time_left
                      ? this.convertIntoMinutes(saved.data[0].time_left)
                      : undefined
                  },
                  () => {
                    console.log(this.state.questionsAnswered);
                    if (this.state.testAttempt.completed_at)
                      window.location.href = "/#/testApp/completed";
                    this.forceUpdate();
                  }
                );
              });
            });
        } else if (review) {
          axios
            .post(`/testAttempts/retrieveSavedProgress`, {
              id: id,
              review: review
            })
            .then(saved => {
              console.log(saved.data[0]);
              let candidateAnswers = saved
                ? saved.data[0].candidate_answers
                : null;
              console.log("REVIEW AND PREVIEW", review, preview);
              this.setState(
                {
                  questions: d.data,
                  questionsAnswered: candidateAnswers || deepCopy(d.data),
                  currentIdx: currentIdx,
                  lastIdx: d.data.length - 1,
                  currentQuestion: d.data[currentIdx],
                  preview: preview,
                  review: review,
                  testId: testId,
                  id: id,
                  candidateId: candidateId,
                  returnTo: returnTo,
                  estimatedTime: t.data[0].estimated_time
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
              currentQuestion: d.data[currentIdx],
              preview: preview,
              testId: testId,
              id: id,
              candidateId: candidateId,
              returnTo: returnTo,
              estimatedTime: t.data[0].estimated_time
            },
            () => {
              this.forceUpdate();
            }
          );
        }
      });
    });
  }

  componentWillUnmount() {
    const {
      id,
      candidateId,
      questionsAnswered,
      hoursLeft,
      minutesLeft,
      secondsLeft,
      currentIdx
    } = this.state;
    const body = {
      userId: candidateId,
      id: id,
      candidateAnswers: questionsAnswered,
      timeLeft: {
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: secondsLeft
      },
      savedProgressIndex: currentIdx
    };
    axios.post("testAttempts/saveProgress", body);
  }

  convertIntoMinutes({ hours, minutes, seconds }) {
    let totalMin = 0;
    if (hours) totalMin = totalMin + hours * 60;
    if (minutes) totalMin = totalMin + minutes;
    if (seconds) totalMin = totalMin + seconds / 60;
    return totalMin;
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
    let {
      testId,
      preview,
      returnTo,
      candidateId,
      questionsAnswered,
      id
    } = this.state;
    if (preview) {
      window.location.href = `${returnTo}?id=${testId}`;
    } else {
      axios
        .post(`/testAttempts/submitTest`, {
          id: id,
          candidateAnswers: questionsAnswered
        })
        .then(d => {
          if (d.status == 200) {
            window.location.href = `/#/testApp/completed?id=${testId}&candidateId=${candidateId}`;
          }
        });
    }
  }

  handleEndPreview() {
    window.location.href = this.state.returnTo;
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
    const {
      id,
      candidateId,
      questionsAnswered,
      hoursLeft,
      minutesLeft,
      secondsLeft,
      currentIdx
    } = this.state;
    const body = {
      userId: candidateId,
      id: id,
      candidateAnswers: questionsAnswered,
      timeLeft: {
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: secondsLeft
      },
      savedProgressIndex: currentIdx
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

  onTimerComplete() {
    let { testId, candidateId, questionsAnswered, id } = this.state;
    return axios
      .post(`/testAttempts/submitTest`, {
        id: id,
        candidateAnswers: questionsAnswered
      })
      .then(d => {
        if (d.status == 200) {
          window.location.href = `/#/testApp/completed?id=${testId}&candidateId=${candidateId}`;
        }
      });
  }

  onTimerTick({ hours, minutes, seconds }) {
    this.setState({
      hoursLeft: hours,
      minutesLeft: minutes,
      secondsLeft: seconds
    });
  }

  timerRender({ hours, minutes, seconds, completed }) {
    return (
      <h4>
        Remaining Time: {hours} Hr {minutes} Min {seconds} Sec
      </h4>
    );
  }

  render() {
    const {
      questions,
      questionsAnswered,
      currentIdx,
      candidateId,
      timeLeft,
      estimatedTime,
      lastIdx,
      startTime,
      preview,
      review,
      returnTo,
      testAttempt
    } = this.state;
    const question = questions[currentIdx];
    const testLength = questions.length;
    // console.log(
    //   "app currentidx quetstions answers",
    //   questionsAnswered,
    //   currentIdx,
    //   questionsAnswered[currentIdx]
    // );
    // console.log(estimatedTime);
    return (
      <div>
        <Preloader loading={questions.length < 1}>
          {questions.length > 0 && (
            <Card className="module-container-card">
              <CardHeader className="preview-title">
                <Row>
                  <Col>
                    {preview &&
                      !review && (
                        <p className="muted-text">
                          <strong>
                            You are currently previewing the test’s questions in
                            the order in which they will appear to candidates.
                            While taking the test, candidates will not have the
                            option to go back and view previously answered
                            questions. Correct answers have been filled in for
                            all questions for purposes of this preview.
                          </strong>
                        </p>
                      )}
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    {preview &&
                      !review && (
                        <h3>
                          {question.name} &nbsp;&nbsp;
                          <span className="question-subtitle">
                            (Question {currentIdx + 1} of {testLength})
                          </span>
                        </h3>
                      )}
                    {!preview &&
                      review && (
                        <h3>
                          {question.name} &nbsp;&nbsp;
                          <span className="question-subtitle">
                            (Question {Number(currentIdx) + 1} of {testLength})
                          </span>
                        </h3>
                      )}
                    {!preview &&
                      !review && (
                        <h3>
                          Question {currentIdx + 1} of {testLength}
                        </h3>
                      )}
                  </Col>
                  <Col md="4">
                    {!preview &&
                      !review && (
                        <Countdown
                          date={
                            timeLeft
                              ? startTime + timeLeft * 60000
                              : startTime + estimatedTime * 60000
                          }
                          renderer={this.timerRender}
                          onComplete={this.onTimerComplete}
                          onTick={this.onTimerTick}
                        />
                      )}
                  </Col>
                  <Col md="4">
                    {preview &&
                      !review && (
                        <Button
                          size="lg"
                          color="link"
                          className="float-right"
                          onClick={this.handleEndPreview}
                        >
                          End Preview
                        </Button>
                      )}
                    {currentIdx !== lastIdx &&
                      !review && (
                        <Button
                          size="lg"
                          color="primary"
                          className="float-right"
                          onClick={this.handleNextQuestion}
                        >
                          Next Question
                        </Button>
                      )}
                    {currentIdx === lastIdx &&
                      !preview &&
                      !review && (
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
                    {!preview &&
                      !review && (
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
                      )}
                    {review &&
                      returnTo && (
                        <a href={returnTo} className="float-right">
                          <FontAwesome name="chevron-circle-left" size="2x" />{" "}
                          &nbsp; Go Back
                        </a>
                      )}
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
                  review={review}
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
                  review={review}
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
