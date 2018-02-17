import React, { Component } from "react";
import { Container } from "reactstrap";
import Header from "../../components/Header/";
// import SecondaryHeader from "../../components/Header/SecondaryHeader";
import Sidebar from "../../components/Sidebar/";
import Aside from "../../components/Aside/";

import Dashboard from "./candidatesDashboard.jsx";

export default class Candidates extends Component {
  render() {
    return (
      <div className="app-body">
        <Sidebar {...this.props} />
        <main className="main">
          <Container fluid>
            <Dashboard />
          </Container>
        </main>
        <Aside />
      </div>
    );
  }
}
