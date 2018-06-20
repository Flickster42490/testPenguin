import React, { Component } from "react";
import { hashHistory } from "react-router";
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  InputGroupAddon,
  InputGroup,
  InputGroupText
} from "reactstrap";
import axios from "axios";
import queryString from "querystring";
import moment from "moment";
import { Preloader, PreloaderView } from "../../../components/Preloader.jsx";

class Instructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidateId: null,
      testId: null,
      firstName: undefined,
      lastName: undefined,
      disabled: true,
      expired: false,
      user: undefined
    };

    this.handleStartTest = this.handleStartTest.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentWillMount() {
    const queries = window.location.hash.split("?")[1];
    const testId = queryString.parse(queries).testId;
    const testAttemptId = queryString.parse(queries).id;
    const { candidateId } = queryString.parse(queries);
    axios.get(`users/${candidateId}`).then(d => {
      let candidate = d ? d.data[0] : undefined;
      axios.get(`tests/${testId}`).then(t => {
        let test = t ? t.data[0] : undefined;
        axios.get(`testAttempts/${testAttemptId}`).then(a => {
          let testAttempt = a ? a.data[0] : undefined;
          axios.get(`users/${testAttempt.invited_by}`).then(u => {
            let user = u ? u.data[0] : undefined;
            this.setState(
              {
                candidateId: candidateId,
                testId: testId,
                testAttemptId: testAttemptId,
                candidate: candidate,
                test: test,
                testAttempt: testAttempt,
                user: user,
                disabled: !(candidate && candidate.first_name),
                expired:
                  testAttempt.expiring_at &&
                  moment(testAttempt.expiring_at) < moment(new Date())
              },
              () => {
                this.forceUpdate();
              }
            );
          });
        });
      });
    });
  }

  handleInput(type, e) {
    this.setState(
      {
        [type]: e.target.value
      },
      () => {
        this.setState({
          disabled: !(this.state.firstName && this.state.lastName)
        });
      }
    );
  }

  handleStartTest() {
    let {
      candidateId,
      testAttemptId,
      testId,
      firstName,
      lastName
    } = this.state;
    axios
      .post("/users/candidate/update", {
        firstName: firstName,
        lastName: lastName,
        userId: candidateId
      })
      .then(c => {
        axios
          .post("/testAttempts/start", {
            userId: candidateId,
            testAttemptId: testAttemptId
          })
          .then(d => {
            hashHistory.push(
              `testApp/app?testId=${testId}&candidateId=${candidateId}&id=${
                d.data[0].id
              }`
            );
          });
      });
  }

  render() {
    let { candidate, test, testAttempt, expired, user } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col>
              <Preloader loading={!this.state.candidate}>
                {!expired && (
                  <div className="clearfix">
                    {test && (
                      <div>
                        <h4>
                          <span className="muted-text">Test Name: </span>
                          {test.name}
                        </h4>
                        <h4>
                          <span className="muted-text">Issued By: </span>
                          {user.company}
                        </h4>
                        <h4>
                          <span className="muted-text">Issued To: </span>
                          {candidate.email_address}
                        </h4>
                      </div>
                    )}
                    Please read the following notes prior to starting the test:{" "}
                    <br />
                    {testAttempt &&
                      test && (
                        <ul>
                          <li>
                            <span className="muted-text">Deadline: </span>
                            The test must be completed before 11:59pm on{" "}
                            {moment(testAttempt.expiring_at).format(
                              "MM/DD/YYYY"
                            )}.
                          </li>
                          <li>
                            <span className="muted-text">Resources: </span>
                            You may use outside resources during the test. We
                            recommend having a supplemental calculator ready.
                          </li>
                          <li>
                            <span className="muted-text">Duration: </span>
                            You have {test.estimated_time} minutes to answer
                            {test.question_ids.length} questions. There will be
                            Multiple Choice and Module type questions.
                          </li>
                          <li>
                            <span className="muted-text">Order: </span>
                            Answers are final after the ‘Submit’ button is
                            pressed for each page. You will NOT be allowed to go
                            back and review previously answered questions.
                          </li>
                          <li>
                            <span className="muted-text">Re-Entrance: </span>
                            If connection is lost or you accidentally exit, you
                            may re-enter the test by clicking the link in the
                            originally sent email.
                          </li>
                          <li>
                            <span className="muted-text">
                              Date(s) Notation:{" "}
                            </span>
                            Unless noted otherwise, all dates presented within
                            the test follow the MM-DD-YYYY notation.
                          </li>
                          <li>
                            <span className="muted-text">
                              Accounting Standards:{" "}
                            </span>
                            Unless noted otherwise, all questions follow accrual
                            accounting principles.
                          </li>
                          <li>
                            <span className="muted-text">
                              Modules - Mutual Exclusivity:{" "}
                            </span>
                            Questions and answers from all modules are
                            independent of one another. You do NOT need info
                            from previous modules to correctly answer preceding
                            modules.
                          </li>
                          <li>
                            <span className="muted-text">
                              Modules - Question Stem(s):{" "}
                            </span>
                            Unless noted otherwise, all module question stems
                            are asked from the perspective of your hypothetical
                            employer ‘Company ABC.’
                          </li>
                          <li>
                            <span className="muted-text">Test Results: </span>
                            Testpenguin LLC is not responsible for reporting
                            test scores to candidates. Such reporting are the
                            discretion of the test’s issuer.
                          </li>
                        </ul>
                      )}
                    {candidate &&
                      !candidate.first_name && (
                        <div>
                          <h4>
                            To take the test, fill out your name and click on
                            the start button below.
                          </h4>
                          <br />
                          <Row>
                            <Col md="3" xs="12">
                              <Input
                                placeholder="First Name"
                                onBlur={e => this.handleInput("firstName", e)}
                              />
                            </Col>
                            <Col md="3" xs="12">
                              <Input
                                placeholder="Last Name"
                                onBlur={e => this.handleInput("lastName", e)}
                              />
                            </Col>
                          </Row>
                        </div>
                      )}
                    <br />
                    <Button
                      disabled={this.state.disabled}
                      onClick={this.handleStartTest}
                    >
                      Start Test
                    </Button>
                  </div>
                )}
                {expired && (
                  <div>
                    <h3 className="pt-3">Welcome to TestPenguin!</h3>
                    <h4>
                      Your Test Invitation Expired on{" "}
                      {moment(testAttempt.expiring_at).format("MM/DD/YYYY")}.{" "}
                      <br />
                      <br />
                      Please Contact the Test Issuer to Request Another
                      Invitation.
                    </h4>
                  </div>
                )}
              </Preloader>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Instructions;
