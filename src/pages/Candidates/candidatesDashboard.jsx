import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Progress
} from "reactstrap";
import axios from "axios";
import moment from "moment";
import ReactTable from "react-table";
import "status-indicator/styles.css";
import "react-table/react-table.css";

import CandidateResults from "./candidateResultsTable.jsx";
import { Preloader } from "../../components/Preloader.jsx";

const typeMap = {
  journalEntry: "Journal Entry",
  multipleChoice: "Multiple Choice"
};

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      candidateList: []
    };
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    axios.get("/testAttempts").then(d => {
      this.setState({
        candidateList: d.data
      });
    });
  }

  render() {
    const { candidateList } = this.state;
    return (
      <div>
        <Preloader loading={candidateList.length < 1}>
          <Row style={{ textAlign: "center" }}>
            <Col xs="12">
              <ButtonGroup size="lg" block>
                <Button outline color="default">
                  All Tests
                </Button>
                <Button outline color="default">
                  Waiting For Test Results
                </Button>
                <Button outline color="default">
                  Tests Completed
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs="12">
              <CandidateResults candidateList={candidateList} />
            </Col>
          </Row>
        </Preloader>
      </div>
    );
  }
}

export default Dashboard;
