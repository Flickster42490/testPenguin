import React, { Component } from "react";
import { Container } from "reactstrap";
import Header from "../components/Header/";
import Footer from "../components/Footer/";

import Dashboard from "./Candidates/index.jsx";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      secondaryHeader: false
    };
  }
  render() {
    return (
      <div className="app">
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}
