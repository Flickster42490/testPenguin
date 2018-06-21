import React, { Component } from "react";
import { Container } from "reactstrap";
import Header from "../../components/Header/";
import SecondaryHeader from "../../components/Header/SecondaryHeader";
import Sidebar from "../../components/TestsSidebar/";
import Aside from "../../components/Aside/";
import queryString from "querystring";
import localForage from "localforage";
import axios from "axios";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: undefined,
      filters: undefined,
      trialExpired: false
    };

    this.handleFilters = this.handleFilters.bind(this);
    this.handlePageUpdate = this.handlePageUpdate.bind(this);
  }

  componentWillMount() {
    const page = window.location.hash.split("tests/")[1];
    localForage.getItem("userId").then(id => {
      axios.get(`/users/${id}`).then(u => {
        this.setState(
          {
            trialExpired: u.data[0].trial && u.data[0].trial_expired,
            page: page
          },
          () => {
            if (this.state.trialExpired && page !== "issuedTests") {
              window.location.href = "/#/dashboard/profile?trialError=true";
            }
          }
        );
      });
    });
  }

  handlePageUpdate(e) {
    console.log("page ------>", e);
    this.setState({
      page: e
    });
  }

  handleFilters(filters) {
    this.setState({
      filters: filters
    });
  }

  render() {
    var children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        filters: this.state.filters,
        handlePageUpdate: this.handlePageUpdate,
        handleTokenUpdate: this.props.handleTokenUpdate
      })
    );
    return (
      <div>
        <div className="app-body">
          <Sidebar
            page={this.state.page}
            handleAddFilters={this.handleFilters}
          />
          <main className="main">
            <Container fluid>{children}</Container>
          </main>
          <Aside />
        </div>
        <div className="show-error">
          <h2>
            Please view this page on a desktop- or laptop-width screen <br />
            for the best user experience
          </h2>
        </div>
      </div>
    );
  }
}
