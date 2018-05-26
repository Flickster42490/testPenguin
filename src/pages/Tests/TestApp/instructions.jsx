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
import { Preloader, PreloaderView } from "../../../components/Preloader.jsx";

class Instructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidateId: null,
      testId: null,
      firstName: undefined,
      lastName: undefined,
      disabled: true
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
        this.setState(
          {
            candidateId: candidateId,
            testId: testId,
            testAttemptId: testAttemptId,
            candidate: candidate,
            test: test
          },
          () => {
            this.forceUpdate();
          }
        );
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
    let { candidate, test } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col>
              <Preloader loading={!this.state.candidate}>
                <div className="clearfix">
                  {candidate && (
                    <h3 className="pt-3">Welcome to TestPenguin!</h3>
                  )}
                  {test && (
                    <h4>Today, you'll be taking the {test.name} test</h4>
                  )}
                  <h4>
                    To take the test, fill out your name and click on the start
                    button below.
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
                  <br />
                  <Button
                    disabled={this.state.disabled}
                    onClick={this.handleStartTest}
                  >
                    Start Test
                  </Button>
                </div>
              </Preloader>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Instructions;
