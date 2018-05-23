import React, { Component } from "react";
import { Container } from "reactstrap";
import axios from "axios";
import Header from "../../components/Header/";
// import SecondaryHeader from "../../components/Header/SecondaryHeader";
import Sidebar from "../../components/CandidatesSidebar/";
import Aside from "../../components/Aside/";

import Dashboard from "./candidatesDashboard.jsx";

export default class Candidates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: undefined
    };

    this.handleFilters = this.handleFilters.bind(this);
  }
  handleFilters(filters) {
    this.setState({
      filters: filters
    });
  }

  render() {
    return (
      <div className="app-body">
        <Sidebar {...this.props} handleAddFilters={this.handleFilters} />
        <main className="main">
          <Container fluid>
            <Dashboard filters={this.state.filters} />
          </Container>
        </main>
        <Aside />
      </div>
    );
  }
}
