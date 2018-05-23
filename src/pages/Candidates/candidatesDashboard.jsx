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
    axios.post("/testAttempts").then(d => {
      this.setState({
        candidateList: d.data
      });
    });
  }

  componentWillReceiveProps(np) {
    axios.post("/testAttempts", { filters: np.filters || {} }).then(d => {
      this.setState(
        {
          candidateList: d.data
        },
        () => this.forceUpdate()
      );
    });
  }

  render() {
    const { candidateList } = this.state;
    return (
      <div>
        <Preloader loading={candidateList.length < 1}>
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
