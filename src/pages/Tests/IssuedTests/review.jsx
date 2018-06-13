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
import localForage from "localforage";
import html2pdf from "html2pdf.js";
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
      waitingCandidates: undefined,
      userId: undefined
    };
    this.handleRefetch = this.handleRefetch.bind(this);
    this.onExportPDF = this.onExportPDF.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    document.body.classList.toggle("sidebar-hidden");
    const queries = window.location.hash.split("?")[1];
    const { id } = queryString.parse(queries);
    localForage.getItem("userId").then(userId => {
      axios.post(`/tests/issued/${id}`, { userId: userId }).then(d => {
        axios.post("/testAttempts", { userId: userId, testId: id }).then(a => {
          console.log(a);
          this.setState({
            userId: userId,
            test: d.data[0],
            completedCandidates: a.data.filter(i => i.completed_at) || [],
            waitingCandidates: a.data.filter(i => !i.completed_at) || []
          });
        });
      });
    });
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  handleRefetch() {
    axios
      .post("/testAttempts", {
        userId: this.state.userId
      })
      .then(d => {
        this.setState(
          {
            candidateList: d.data,
            loading: false
          },
          () => this.forceUpdate()
        );
      });
  }

  onExportPDF() {
    var element = document.getElementById("toPDF");
    var opt = {
      margin: [0.2, 0.5, 0.2, 0],
      filename: `${this.state.testResults.last_name}_${
        this.state.testResults.first_name
      }_${this.state.testResults.name}.pdf`,
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" }
    };
    html2pdf()
      .from(element)
      .set(opt)
      .save();
  }

  render() {
    const { completedCandidates, waitingCandidates, test, userId } = this.state;
    return (
      <div className="app-body" id="toPDF">
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
                        <a
                          href={`/#/dashboard/tests/inviteCandidates?id=${
                            test.id
                          }&name=${test.name}`}
                        >
                          <Button color="success">Invite Candidates</Button>
                        </a>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col xs={4}>
                  <div class="text-align-center">
                    <div className="h4 m-0">Results</div>
                    <ul className="horizontal-bars">
                      <li>
                        {completedCandidates.length} Completed /{" "}
                        {waitingCandidates.length} Waiting
                      </li>
                      <li>
                        <Button onClick={this.onExportPDF}>
                          Save Summary as PDF
                        </Button>
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
                        <CandidateResults
                          candidateList={completedCandidates}
                          userId={userId}
                          handleRefetch={this.handleRefetch}
                          emptyMessage="No invited Candidates have completed their test. Press the ‘Send Reminder’ button below to ensure that candidate’s submit their tests before the expiration deadline."
                        />
                      </Col>
                    </Row>
                    <br />
                    <div class="html2pdf__page-break" />
                    <Row>
                      <Col xs={7}>
                        <h4>Candidates - WAITING</h4>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col xs={12}>
                        <CandidateResults
                          candidateList={waitingCandidates}
                          userId={userId}
                          handleRefetch={this.handleRefetch}
                          emptyMessage="All invited candidates have completed their test 😊. Invite additional candidates, if you’d like."
                        />
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
