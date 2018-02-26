import React, { Component } from "react";
import { hashHistory } from "react-router";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Progress,
  Collapse,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import queryString from "querystring";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { DatePickerBasic } from "../../../components/DateRangePicker.jsx";
import Toggle from "react-toggle";

export default class questionDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeValue: ""
    };

    this.updateTimeValue = this.updateTimeValue.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentWillMount() {
    console.log(queryString.parse());
  }

  handleNext() {
    hashHistory.push("tests/createNewTest/review");
  }

  updateTimeValue(value) {
    this.setState({
      timeValue: value
    });
  }

  render() {
    return (
      <div>
        <Card>
          <Container style={{ marginTop: "10px" }}>
            <Row>
              <Col xs="12">
                <div className="text-center">
                  <h3>Test Settings</h3> (<strong>step 3 of 4</strong>)
                </div>
              </Col>
              <br />
            </Row>
            <Row>
              <Col xs="12">
                <div className="text-center">
                  <div className="progress">
                    <Progress bar color="success" value="3" max="4" />
                  </div>
                  <br />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="1" />
              <Col xs="10">
                <h4>Accounting</h4>
                <br />
                <Form
                  action=""
                  method="post"
                  encType="multipart/form-data"
                  className="form-horizontal"
                >
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Test Expiration Date</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <DatePickerBasic />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Timing</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                        options={[
                          { label: 1, value: 1 },
                          { label: 2, value: 2 },
                          { label: 3, value: 3 },
                          { label: 4, value: 4 },
                          { label: 5, value: 5 },
                          { label: 6, value: 6 },
                          { label: 7, value: 7 },
                          { label: 8, value: 8 },
                          { label: 9, value: 9 },
                          { label: 10, value: 10 }
                        ]}
                        clearable
                        searchable
                        placeholder="select a value or enter your own"
                        value={this.state.timeValue}
                        onChange={this.updateTimeValue}
                      />
                      <FormText color="muted">
                        (The average candiate will require 25 minutes to
                        complete your test's 3 questions. We recommend you
                        provide the full 25 minutes.)
                      </FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">
                        Disallow re-answers
                      </Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Toggle defaultChecked />
                      <FormText color="muted">
                        (Candidates will not be allowed to see previously
                        answered questions)
                      </FormText>
                    </Col>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
            <br />
            <Row style={{ float: "right" }}>
              <Col xs="4">
                <Button color="success" onClick={() => this.handleNext()}>
                  Next
                </Button>
              </Col>
            </Row>
            <br />
            <br />
            <br />
          </Container>
        </Card>
      </div>
    );
  }
}
