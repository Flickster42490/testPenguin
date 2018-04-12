import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardGroup,
  CardHeader,
  CardBody,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap";
import PreviewMultipleChoice from "./previewMultipleChoice.jsx";
import JournalEntry from "./journalEntry.jsx";
import PDF from "react-pdf-js";

export default class Preview extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div>
        {/* <PreviewMultipleChoice /> */}
        <Card className="module-container-card">
          <Row>
            <Col md="5">
              <div>
                <Card className="transparent-card">
                  <CardHeader className="transparent-card-header">
                    <strong>Part 1:</strong>
                  </CardHeader>
                  <CardBody className="transparent-card-body">
                    <p>
                      Prepare the month-end bank reconciliation on the right,
                      using only the information presented below.
                    </p>
                    <p>
                      Note: Place a '-' sign in front of the amount when
                      inputting deductions.
                    </p>
                  </CardBody>
                </Card>
              </div>
              <div>
                <Card className="pdf-card">
                  <CardHeader>
                    <Button outline color="default" block>
                      Reconciling Items
                    </Button>
                  </CardHeader>
                  <CardBody>
                    <PDF file="/img/q1.pdf" fillWidth />
                  </CardBody>
                </Card>
              </div>
            </Col>
            <Col md="7">
              <JournalEntry />
              <br />
              <Card className="transparent-card">
                <CardHeader className="transparent-card-header">
                  <strong>Part 2:</strong>
                </CardHeader>
                <CardBody className="transparent-card-body">
                  {" "}
                  <p>
                    The Goodwill line-item was added to Company ABC's Balance
                    Sheet after Company ABC acquired a business in 2015. What
                    assets from the 2015 acquisition are reflected in the
                    Goodwill balance?
                  </p>
                  <Input type="textarea" name="text" id="exampleText" />{" "}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
