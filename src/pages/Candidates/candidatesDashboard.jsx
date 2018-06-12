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
import localForage from "localforage";
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
      candidateList: [],
      loading: true,
      userId: undefined,
      filters: {}
    };
    this.handleRefetch = this.handleRefetch.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    console.log("lksjdflakjdf;lkajs;fljka;flkjas;ldfjka;slkjf;laj;flkaj;sf");
    localForage.getItem("userId").then(id => {
      axios.post("/testAttempts", { userId: id }).then(d => {
        console.log(d);
        this.setState(
          {
            candidateList: d.data,
            userId: id,
            loading: false
          },
          () => {
            this.forceUpdate();
          }
        );
      });
    });
  }

  componentWillReceiveProps(np) {
    axios
      .post("/testAttempts", {
        userId: this.state.userId,
        filters: np.filters || {}
      })
      .then(d => {
        this.setState(
          {
            candidateList: d.data,
            loading: false,
            filters: np.filters
          },
          () => this.forceUpdate()
        );
      });
  }

  handleRefetch() {
    axios
      .post("/testAttempts", {
        userId: this.state.userId,
        filters: this.state.filters || {}
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

  render() {
    const { candidateList, loading } = this.state;
    return (
      <div>
        <div className="page-header">
          {" "}
          <h2 style={{ display: "inline" }}>
            &nbsp;CANDIDATES
          </h2>&nbsp;&nbsp;&nbsp;&nbsp;
          <h6 style={{ display: "inline" }}>
            You will find your active candidates here
          </h6>
        </div>
        <Preloader loading={loading}>
          <Row>
            <Col xs="12">
              <CandidateResults
                candidateList={candidateList}
                userId={this.state.userId}
                handleRefetch={this.handleRefetch}
              />
            </Col>
          </Row>
        </Preloader>
      </div>
    );
  }
}

export default Dashboard;
