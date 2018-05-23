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

export default class IssuedTestsReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      test: undefined,
      completedCandidates: undefined,
      waitingCandidates: undefined
    };
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    document.body.classList.toggle("sidebar-hidden");
    const queries = window.location.hash.split("?")[1];
    const { id } = queryString.parse(queries);
    axios.post(`/tests/issued/${id}`).then(d => {
      axios.post("/testAttempts").then(a => {
        this.setState({
          test: d.data[0],
          completedCandidates: a.data.filter(i => i.completed_at) || [],
          waitingCandidates: a.data.filter(i => !i.completed_at) || []
        });
      });
    });
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  render() {
    const { completedCandidates, waitingCandidates, test } = this.state;
    console.log(test);
    return (
      <div className="app-body">
        {test ? (
          <main
            className="main"
            style={{ marginLeft: "200px", marginRight: "200px" }}
          >
            <Container fluid>
              <Row>
                <Col xs={6}>
                  <h3>{test.name}</h3>
                </Col>
                <Col xs={6}>
                  <a
                    href={`/#/dashboard/tests/issuedTests`}
                    className="float-right"
                  >
                    <FontAwesome name="chevron-circle-left" size="2x" /> &nbsp;
                    Go Back
                  </a>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xs={4}>
                  <div class="text-align-center">
                    <div className="h4 m-0">Invitations</div>
                    <ul className="horizontal-bars">
                      <li>{test.count} candidates</li>
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
                        {completedCandidates.length} Completed/{
                          waitingCandidates.length
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
                          Test Issuance:{" "}
                          {test.created_at
                            ? moment(test.created_at).format(
                                "MM/DD/YYYY hh:mm a"
                              )
                            : "System Created"}
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
        ) : null}
      </div>
    );
  }
}
