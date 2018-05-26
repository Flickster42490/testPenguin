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
import axios from "axios";
import localForage from "localforage";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { Alert } from "reactstrap";

export default class InviteCandidates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testName: "Demo",
      testId: null,
      submitted: false,
      showSuccessToaster: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    const queries = window.location.hash.split("?")[1];
    const testId = queryString.parse(queries).id;
    const testName = queryString.parse(queries).name;
    localForage.getItem("userId").then(id => {
      this.setState({
        testId: testId,
        testName: testName,
        showSuccessToaster: false,
        candidates: {
          emails: null,
          invitedBy: id
        },
        submitDisable: true,
        submitted: false
      });
    });

    this.handleEmail = this.handleEmail.bind(this);
  }

  handleReload() {
    console.log(window.location.hash);
  }

  handleEmail(e) {
    let { candidates } = this.state;
    console.log(e.target.value, candidates);
    this.setState(
      {
        candidates: Object.assign(candidates, {
          emails: e.target.value
        }),
        submitDisable: !e.target.value
      },
      () => {
        console.log("candidates", this.state.candidates);
      }
    );
  }

  handleSubmit() {
    axios.post("/users/candidate/invite", this.state.candidates).then(d => {
      const candidates = d.data ? d.data : null;
      if (d.status === 200 && candidates) {
        axios
          .post("/testAttempts/create", {
            userIds: candidates.map(i => i.id),
            testId: this.state.testId,
            invitedBy: this.state.candidates.invitedBy
          })
          .then(() => {
            this.setState({
              submitDisable: true,
              submitted: true,
              showSuccessToaster: true
            });
          });
      }
    });
  }
  //submit to our SES system, where tests will be given an ID. Then, the ID will be stored in the DB with the invite sent out timestamp.
  //That ID will be sent as querystring embedded in the candidate email CTA.
  render() {
    const { testName, showSuccessToaster, candidate } = this.state;
    return (
      <div>
        <Card>
          <Container style={{ marginTop: "10px" }}>
            {showSuccessToaster && (
              <Row>
                <Col>
                  <Alert type="success">
                    Invitations Sent
                    <span
                      onClick={() => window.location.reload()}
                      className="link"
                    >
                      (Invite Others?)
                    </span>
                  </Alert>
                </Col>
              </Row>
            )}
            <Row>
              <Col xs="12">
                <div className="text-center">
                  <h3>Send Invitations for: {testName} Test</h3>
                </div>
              </Col>
              <br />
            </Row>
            <hr />
            <Row>
              <Col xs="1" />
              <Col xs="10">
                <Form action="" className="form-horizontal">
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Candidate Emails</Label>
                    </Col>
                    <Col xs="12" md="6">
                      <Input
                        type="text"
                        onBlur={this.handleEmail}
                        disabled={this.state.submitted}
                      />
                      <FormText color="muted">
                        Please separate emails with a comma. <br />
                        (eg. john@test.com,mary@test.com,tracy@test.com)
                      </FormText>
                    </Col>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
            <br />
            <Row style={{ float: "right" }}>
              <Col xs="4">
                <Button
                  color="success"
                  onClick={() => this.handleSubmit()}
                  disabled={this.state.submitDisable}
                >
                  Submit
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
