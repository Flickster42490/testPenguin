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
        <Card>
          <Container style={{ marginTop: "10px" }}>
            <Row>
              <Col md="5">
                <div>
                  <Card>
                    <CardHeader>
                      <strong>Part 1:</strong>
                    </CardHeader>
                    <CardBody>
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
                  <Card>
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
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    );
  }
}
