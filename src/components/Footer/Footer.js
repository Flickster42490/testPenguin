import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="app-footer">
        <span>
          &copy; 2018&nbsp;
          <a href="http://testpenguin.com"> TestPenguin</a>
        </span>
        {/* <span className="ml-auto">Powered by <a href="http://coreui.io">CoreUI</a></span> */}
      </footer>
    );
  }
}

export default Footer;
