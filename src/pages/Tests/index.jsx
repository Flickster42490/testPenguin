import React, { Component } from "react";
import { Container } from "reactstrap";
import Header from "../../components/Header/";
import SecondaryHeader from "../../components/Header/SecondaryHeader";
import Sidebar from "../../components/Sidebar/";
import Aside from "../../components/Aside/";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      secondaryHeader: false
    };
  }
  componentWillMount() {
    if (window.location.hash.includes("tests"))
      this.setState({ secondaryHeader: true });
  }
  render() {
    return (
      <div className="app-body">
        <Sidebar {...this.props} />
        <main className="main">
          <SecondaryHeader />
          <br />
          <Container fluid>{this.props.children}</Container>
        </main>
        <Aside />
      </div>
    );
  }
}
