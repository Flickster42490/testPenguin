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
import Select from "react-select";
import "react-select/dist/react-select.css";
import { Alert } from "reactstrap";

export default class InviteCandidates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testName: "Demo",
      testId: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    const queries = window.location.hash.split("?")[1];
    const testId = queryString.parse(queries).id;
    const testName = queryString.parse(queries).name;
    this.setState({
      testId: testId,
      testName: testName,
      showSuccessToaster: false,
      candidate: {
        firstName: null,
        lastName: null,
        email: null
      },
      submitDisable: true
    });

    this.handleEmail = this.handleEmail.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
  }

  handleReload() {
    console.log(window.location.hash);
  }

  handleFirstName(e) {
    let { candidate } = this.state;
    this.setState({
      candidate: Object.assign(candidate, {
        firstName: e.target.value
      }),
      submitDisable: !(
        candidate.firstName &&
        candidate.lastName &&
        candidate.email
      )
    });
  }

  handleLastName(e) {
    let { candidate } = this.state;
    this.setState({
      candidate: Object.assign(candidate, {
        lastName: e.target.value
      }),
      submitDisable: !(
        candidate.firstName &&
        candidate.lastName &&
        candidate.email
      )
    });
  }

  handleEmail(e) {
    let { candidate } = this.state;
    this.setState({
      candidate: Object.assign(candidate, {
        email: e.target.value
      }),
      submitDisable: !(
        candidate.firstName &&
        candidate.lastName &&
        candidate.email
      )
    });
  }

  handleSubmit() {
    axios.post("/users/candidate/invite", this.state.candidate).then(d => {
      const candidate = d.data ? d.data[0] : null;
      if (d.status === 200 && candidate) {
        this.setState(
          {
            showSuccessToaster: true
          },
          () => {
            axios
              .post("/testAttempts/create", {
                userId: candidate.id,
                testId: this.state.testId
              })
              .then(() => {
                this.setState({
                  submitDisable: true
                });
              });
          }
        );
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
                    Invitation Sent to {candidate.firstName}{" "}
                    {candidate.lastName}!{" "}
                    <span
                      onClick={() => window.location.reload()}
                      className="link"
                    >
                      (Invite Another?)
                    </span>
                  </Alert>
                </Col>
              </Row>
            )}
            <Row>
              <Col xs="12">
                <div className="text-center">
                  <h3>Send Invitation to Candidate for: {testName} Test</h3>
                </div>
              </Col>
              <br />
            </Row>
            <hr />
            <Row>
              <Col xs="1" />
              <Col xs="10">
                <Form
                  action=""
                  method="post"
                  encType="multipart/form-data"
                  className="form-horizontal"
                >
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">First Name</Label>
                    </Col>
                    <Col xs="12" md="6">
                      <Input type="text" onBlur={this.handleFirstName} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Last Name</Label>
                    </Col>
                    <Col xs="12" md="6">
                      <Input type="text" onBlur={this.handleLastName} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Email</Label>
                    </Col>
                    <Col xs="12" md="6">
                      <Input type="text" onBlur={this.handleEmail} />
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
