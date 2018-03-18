import React, { Component } from "react";
import { Container } from "reactstrap";
import queryString from "querystring";
import localForage from "localforage";
import Header from "../components/Header/";
import Footer from "../components/Footer/";

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
        {this.props.children}
        <Footer />
      </div>
    );
  }
}
