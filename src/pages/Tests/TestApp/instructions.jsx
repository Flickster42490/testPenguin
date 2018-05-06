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
      testId: null
    };

    this.handleStartTest = this.handleStartTest.bind(this);
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

  handleStartTest() {
    let { candidateId, testAttemptId, testId } = this.state;
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
                    <h3 className="pt-3">
                      Hi {candidate.first_name}, Welcome to TestPenguin!
                    </h3>
                  )}
                  {test && (
                    <h4>Today, you'll be taking the {test.name} test</h4>
                  )}
                  <h4>To take the test, click on the start button below.</h4>
                  <br />
                  <Button onClick={this.handleStartTest}>Start Test</Button>
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
