import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  InputGroupAddon,
  InputGroup,
  InputGroupText
} from "reactstrap";

class Completed extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <div className="clearfix">
                <h4 className="pt-3">Yay! You're done with the test</h4>
                <h4>
                  Please close the window. Your recruiter will contact you with
                  the results.
                </h4>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Completed;
