import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="app-footer">
        <span style={{ marginLeft: "220px" }}>
          Need help?{" "}
          <a href="mailto:support@testpenguin.com">support@testpenguin.com</a>
        </span>
        <span className="ml-auto">
          &copy; 2018&nbsp;
          <a href="http://testpenguin.com"> TestPenguin</a>
        </span>
        {/* <span className="ml-auto">Powered by <a href="http://coreui.io">CoreUI</a></span> */}
      </footer>
    );
  }
}

export default Footer;
