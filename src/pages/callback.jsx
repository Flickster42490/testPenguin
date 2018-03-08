import React, { Component } from "react";

class Callback extends Component {
  componentWillMount() {
    window.location.href = "/auth/google/return";
  }

  render() {
    return <div />;
  }
}

export default Callback;
