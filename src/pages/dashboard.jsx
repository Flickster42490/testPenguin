import React, { Component } from "react";
import { Container } from "reactstrap";
import queryString from "querystring";
import localForage from "localforage";
import axios from "axios";
import Header from "../components/Header/";
import Footer from "../components/Footer/";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      secondaryHeader: false,
      loggedIn: false,
      tokens: undefined
    };

    this.handleTokenUpdate = this.handleTokenUpdate.bind(this);
  }
  componentWillMount() {
    const userId =
      window.location.href.split("?").length > 1
        ? queryString.parse(window.location.href.split("?")[1]).id
        : null;
    localForage
      .getItem("userId")
      .then(value => {
        if (value === "undefined") value = false;
        //if localForage doesn't find value, then check to see if userId is in the url, if not, redirect to login
        //if there is userId in url, then set the id in localForage.
        if (!value) {
          if (!userId) {
            console.log("no userId");
            window.location.href = "/#/login";
          } else {
            console.log("setting userId", userId);
            localForage.setItem("userId", userId).then(val => {
              console.log("after set", val);
              this.setState({ loggedIn: true });
            });
          }
        } else {
          //if localForage has a value (usually within an hour), check with the server to see if it's been an hour since last logged in.
          console.log("value", value);
          this.checkLoggedIn(value);
        }
      })
      .catch(err => {});
  }

  handleTokenUpdate(tokens) {
    this.setState({
      tokens: tokens
    });
  }

  checkLoggedIn(value) {
    console.log("checking userId", value);
    axios
      .post("/auth/check", {
        userId: value
      })
      .then(res => {
        console.log(res.status);
        if (res.status === 200) {
          this.setState({ loggedIn: true }, () => {
            console.log("state updated for loggedIn");
          });
        } else {
          new Error();
        }
      })
      .catch(err => {
        localForage.removeItem("userId").then(() => {
          window.location.href = "/#/login";
        });
      });
  }

  render() {
    console.log("state.loggedIn", this.state.loggedIn);
    var children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        handleTokenUpdate: this.handleTokenUpdate
      })
    );
    return (
      <div className="app">
        {this.state.loggedIn && (
          <div>
            <Header tokens={this.state.tokens} />
            {children}
            <Footer class="footer" />
          </div>
        )}
      </div>
    );
  }
}
