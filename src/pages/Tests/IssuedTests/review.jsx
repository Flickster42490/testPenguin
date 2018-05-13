import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Progress,
  Input,
  Button,
  ButtonGroup,
  ButtonToolbar
} from "reactstrap";
import encodeUrl from "encodeurl";
import axios from "axios";
import moment from "moment";
import queryString from "querystring";
import momentDurationFormatSetup from "moment-duration-format";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "status-indicator/styles.css";

import CandidateResults from "../../Candidates/candidateResultsTable.jsx";
import { Preloader } from "../../../components/Preloader.jsx";
import FontAwesome from "react-fontawesome";

const typeMap = {
  journalEntry: "Journal Entry",
  multipleChoice: "Multiple Choice"
};

const mockData = {
  name: "MOCK TEST",
  candidates_invited: 3,
  results: {
    completed: 2,
    waiting: 1
  },
  history: {
    test_created_on: moment(new Date()).format("MM/DD/YYYY hh:mm a")
  }
};
export default class IssuedTestsReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      completedCandidates: undefined,
      waitingCandidates: undefined
    };
  }

  componentWillMount() {
    document.body.classList.toggle("sidebar-hidden");
    axios.get("/testAttempts").then(d => {
      this.setState({
        completedCandidates: d.data.filter(i => i.completed_at) || [],
        waitingCandidates: d.data.filter(i => !i.completed_at) || []
      });
    });
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  render() {
    const { completedCandidates, waitingCandidates } = this.state;
    return (
      <div className="app-body">
        <main
          className="main"
          style={{ marginLeft: "200px", marginRight: "200px" }}
        >
          <Container fluid>
            <Row>
              <Col xs={6}>
                <h3>{mockData.name}</h3>
              </Col>
              <Col xs={6}>
                <a
                  href={`/#/dashboard/tests/issuedTests`}
                  className="float-right"
                >
                  <FontAwesome name="chevron-circle-left" size="2x" /> &nbsp; Go
                  Back
                </a>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={4}>
                <div class="text-align-center">
                  <div className="h4 m-0">Invitations</div>
                  <ul className="horizontal-bars">
                    <li>{mockData.candidates_invited} candidates</li>
                    <li>
                      <Button>Invite Candidates</Button>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col xs={4}>
                <div class="text-align-center">
                  <div className="h4 m-0">Results</div>
                  <ul className="horizontal-bars">
                    <li>
                      {mockData.results.completed} Completed/{
                        mockData.results.waiting
                      }{" "}
                      Waiting
                    </li>
                    <li>
                      <Button>Save Summary as PDF</Button>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col xs={4}>
                <div class="text-align-center">
                  <div className="h4 m-0">
                    <img src={History} />&nbsp; History
                  </div>
                  <ul className="horizontal-bars">
                    <li>
                      <div>
                        Test Issuance: {mockData.history.test_created_on}
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
            <hr />
            {completedCandidates &&
              waitingCandidates && (
                <div>
                  <Row>
                    <Col xs={7}>
                      <h4>Candidates - COMPLETED</h4>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col xs={12}>
                      <CandidateResults candidateList={completedCandidates} />
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col xs={7}>
                      <h4>Candidates - WAITING</h4>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col xs={12}>
                      <CandidateResults candidateList={waitingCandidates} />
                    </Col>
                  </Row>
                  <br />
                </div>
              )}
          </Container>
        </main>
      </div>
    );
  }
}
