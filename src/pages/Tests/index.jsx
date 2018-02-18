import React, { Component } from "react";
import { Container } from "reactstrap";
import Header from "../../components/Header/";
import SecondaryHeader from "../../components/Header/SecondaryHeader";
import Sidebar from "../../components/TestsSidebar/";
import Aside from "../../components/Aside/";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "preBuiltTests"
    };

    this.handleUpdatePage = this.handleUpdatePage.bind(this);
  }
  componentWillMount() {
    if (window.location.hash.includes("tests"))
      this.setState({ secondaryHeader: true });
  }

  handleUpdatePage(e) {
    this.setState({
      page: e
    });
  }
  render() {
    return (
      <div className="app-body">
        <Sidebar page={this.state.page} />
        <main className="main">
          <SecondaryHeader updatePage={this.handleUpdatePage} />
          <br /> <br />
          <Container fluid>{this.props.children}</Container>
        </main>
        <Aside />
      </div>
    );
  }
}
