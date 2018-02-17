import React, { Component } from "react";
import { Container } from "reactstrap";
import Header from "../components/Header/";
import SecondaryHeader from "../components/Header/SecondaryHeader";
import Sidebar from "../components/Sidebar/";
import Footer from "../components/Footer/";

import Dashboard from "./Dashboard/index.jsx";

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
