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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import queryString from "querystring";
import axios from "axios";
import localForage from "localforage";
import moment from "moment";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { Alert } from "reactstrap";
import StripeCheckout from "react-stripe-checkout";
import { Preloader } from "../../../components/Preloader.jsx";
import DatePicker from "../../../components/DatePicker/dist/react-datepicker";
import "../../../components/DatePicker/dist/react-datepicker.css";
import TestQuestionList from "../CreateNewTest/testQuestionList.jsx";

const typeMap = {
  module: "Module",
  multiple_choice: "Multiple Choice"
};

export default class InviteCandidates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testName: "Demo",
      testId: null,
      expirationDate: undefined,
      confirmationModal: false,
      submitted: false,
      showSuccessToaster: false,
      user: undefined,
      paymentPopup: false,
      paymentAlertVisible: false,
      paymentInfo: { success: undefined, message: undefined }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitPopover = this.handleSubmitPopover.bind(this);
    this.toggleConfirmationModal = this.toggleConfirmationModal.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.onToken = this.onToken.bind(this);
    this.onPaymentAlertDismiss = this.onPaymentAlertDismiss.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.updateCalendar = this.updateCalendar.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    document.body.classList.toggle("sidebar-hidden");
    const queries = window.location.hash.split("?")[1];
    const testId = queryString.parse(queries).id;
    const testName = queryString.parse(queries).name;
    localForage.getItem("userId").then(id => {
      axios.get(`/users/${id}`).then(d => {
        axios.get(`tests/${testId}`).then(t => {
          console.log(t);
          this.setState({
            user: d.data ? d.data[0] : undefined,
            testId: testId,
            testName: testName,
            test: t.data[0],
            showSuccessToaster: false,
            candidates: {
              emails: null,
              invitedBy: id
            },
            expirationDate: moment(new Date()).add(7, "days"),
            submitDisable: true,
            submitted: false
          });
        });
      });
    });

    this.handleEmail = this.handleEmail.bind(this);
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  onToken(token, amount, tokenAmount) {
    this.setState(
      {
        paymentLoading: true
      },
      () => {
        axios
          .post("/payments/purchase", {
            token: token,
            userId: this.state.candidates.invitedBy,
            purchaseAmount: amount,
            tokenAmount: tokenAmount
          })
          .then(payment => {
            if (payment.data) {
              axios.get(`/users/${this.state.candidates.invitedBy}`).then(d => {
                this.setState(
                  {
                    paymentPopup: false,
                    user: d.data ? d.data[0] : undefined,
                    paymentLoading: false,
                    paymentAlertVisible: true,
                    paymentInfo: {
                      success: true,
                      message: `You have successfully made a payment of $${amount /
                        100}. Your confirmation number is #${payment.data.id}`
                    }
                  },
                  () => {
                    this.props.handleTokenUpdate(this.state.user.tokens);
                  }
                );
              });
            }
          })
          .catch(() => {
            this.setState({
              paymentLoading: false,
              paymentAlertVisible: true,
              paymentInfo: {
                success: false,
                message: `There was an error with the payment. Please try again or contact support at support@accountingpenguin.com for further support`
              }
            });
          });
      }
    );
  }

  onPaymentAlertDismiss() {
    this.setState({ paymentAlertVisible: false });
  }

  togglePopup() {
    this.setState({
      paymentPopup: !this.state.paymentPopup
    });
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

  handleSubmitPopover() {
    this.setState({
      confirmationModal: true
    });
  }

  handleSubmit() {
    let numberOfCandidates = this.state.candidates.emails.split(",").length;
    if (numberOfCandidates > this.state.user.tokens) {
      this.setState({
        paymentPopup: true
      });
    } else {
      axios.post("/users/candidate/invite", this.state.candidates).then(d => {
        const candidates = d.data ? d.data : null;
        if (d.status === 200 && candidates) {
          axios
            .post("/testAttempts/create", {
              userIds: candidates.map(i => i.id),
              testId: this.state.testId,
              testName: this.state.testName,
              invitedBy: this.state.candidates.invitedBy,
              expiringAt: this.state.expirationDate
            })
            .then(() => {
              this.setState({
                submitDisable: true,
                submitted: true,
                showSuccessToaster: true,
                confirmationModal: false
              });
            });
        }
      });
    }
  }

  stringifyTags(tags) {
    let template = ``;
    tags.forEach((i, idx, arr) => {
      if (idx === arr.length - 1) template += i;
      else template += `${i}, `;
    });
    console.log(template);
    return template;
  }

  stringifyQuestionTypes(types) {
    let typeMapped = [];
    _.forOwn(types, (v, k) => {
      typeMapped.push(
        <div>
          <strong>{typeMap[k]}: </strong>
          {k === "multiple_choice" && <span>{v} Questions</span>}
          {k === "module" && <span>{v} Questions</span>}
        </div>
      );
    });
    return typeMapped;
  }

  toggleConfirmationModal() {
    this.setState({
      confirmationModal: false
    });
  }

  updateCalendar(date) {
    this.setState({
      expirationDate: date.format("MM/DD/YYYY")
    });
  }

  render() {
    const { testName, showSuccessToaster, candidate, test } = this.state;
    return (
      <div>
        {test &&
          this.state.candidates &&
          this.state.candidates.emails && (
            <Modal
              isOpen={this.state.confirmationModal}
              toggle={this.toggleConfirmationModal}
            >
              <ModalHeader toggle={this.toggleConfirmationModal}>
                <h4>
                  You are about to issue the {test.name} Test to{" "}
                  {this.state.candidates.emails.split(",").length} candidates.
                </h4>
              </ModalHeader>
              <ModalBody>
                <h6> Questions: {test.question_ids.length}</h6>
                <h6> Time Allotted: {test.estimated_time} mins</h6>
                <h6>
                  {" "}
                  Expiration Date:{" "}
                  {moment(this.state.expirationDate).format("MM/DD/YYYY")}
                </h6>
                <h6>
                  {" "}
                  <strong>Click ‘Confirm’ to email the test link now.</strong>
                </h6>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.handleSubmit}>
                  Confirm
                </Button>{" "}
                <Button
                  color="secondary"
                  onClick={this.toggleConfirmationModal}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          )}
        {this.state.user && (
          <Card style={{ minHeight: "380px" }}>
            <Container style={{ marginTop: "10px" }}>
              {this.state.paymentPopup && (
                <Preloader loading={this.state.paymentLoading}>
                  <Modal isOpen={this.state.paymentPopup}>
                    <ModalHeader toggle={this.togglePopup}>
                      Please Purchase More Tokens To Continue
                    </ModalHeader>
                    <ModalBody>
                      You currently only have{" "}
                      <strong>{this.state.user.tokens}</strong> tokens. It is
                      not enough to send out{" "}
                      <strong>
                        {this.state.candidates.emails.split(",").length}
                      </strong>{" "}
                      invitations.
                      <Row>
                        <Col xs="12" md="4" className="text-align-center">
                          <Card style={{ borderRadius: "5px" }}>
                            <h5>
                              5 Test <br />Tokens
                            </h5>
                            <h6>
                              $50 <span className="muted-text">($10/Test)</span>
                            </h6>
                            <StripeCheckout
                              name={"Accounting Penguin"}
                              image={
                                "https://www.brandcrowd.com/gallery/brands/pictures/picture13252923944069.png"
                              }
                              description={"5 Test Tokens"}
                              amount={5000}
                              token={e => this.onToken(e, 5000, 5)}
                              currency={"USD"}
                              zipCode={true}
                              email={this.state.user.email_address}
                              allowRememberMe={false}
                              stripeKey={"pk_test_kvEqONB7cmON22LLj8NiwzFf"}
                            />
                          </Card>
                        </Col>
                        <Col xs="12" md="4" className="text-align-center">
                          <Card style={{ borderRadius: "5px" }}>
                            <h5>
                              25 Test <br />Tokens
                            </h5>
                            <h6>
                              $200 <span className="muted-text">($8/Test)</span>
                            </h6>
                            <StripeCheckout
                              name={"Accounting Penguin"}
                              image={
                                "https://www.brandcrowd.com/gallery/brands/pictures/picture13252923944069.png"
                              }
                              description={"25 Test Tokens"}
                              amount={20000}
                              token={e => this.onToken(e, 20000, 25)}
                              currency={"USD"}
                              zipCode={true}
                              email={this.state.user.email_address}
                              allowRememberMe={false}
                              stripeKey={"pk_test_kvEqONB7cmON22LLj8NiwzFf"}
                            />
                          </Card>
                        </Col>
                        <Col xs="12" md="4" className="text-align-center">
                          <Card style={{ borderRadius: "5px" }}>
                            <h5>
                              100 Test <br />Tokens
                            </h5>
                            <h6>
                              $500 <span className="muted-text">($5/Test)</span>
                            </h6>
                            <StripeCheckout
                              name={"Accounting Penguin"}
                              image={
                                "https://www.brandcrowd.com/gallery/brands/pictures/picture13252923944069.png"
                              }
                              description={"100 Test Tokens"}
                              amount={50000}
                              token={e => this.onToken(e, 50000, 100)}
                              currency={"USD"}
                              zipCode={true}
                              email={this.state.user.email_address}
                              allowRememberMe={false}
                              stripeKey={"pk_test_kvEqONB7cmON22LLj8NiwzFf"}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </ModalBody>
                  </Modal>
                </Preloader>
              )}
              {this.state.paymentInfo.message && (
                <Alert
                  isOpen={this.state.paymentAlertVisible}
                  toggle={this.onPaymentAlertDismiss}
                  color={this.state.paymentInfo.success ? "success" : "danger"}
                >
                  {this.state.paymentInfo.message}
                </Alert>
              )}
              {showSuccessToaster && (
                <Row>
                  <Col>
                    <Alert type="success">
                      Invitations Sent{" "}
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
                  <div className="text-center page-header">
                    <h3>INVITE CANDIDATES</h3>
                  </div>
                </Col>
                <br />
              </Row>

              <Row>
                <Col xs="12">
                  <Form>
                    <FormGroup row>
                      <Col md="3">
                        <h5>Test Name:</h5>
                      </Col>
                      <Col xs="12" md="9">
                        <h4>{test.name}</h4>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <h5>Description:</h5>
                      </Col>
                      <Col xs="12" md="9">
                        <h5>{test.description}</h5>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <h5>Test Expiration:</h5>
                      </Col>
                      <Col xs="12" md="9">
                        <DatePicker
                          minDate={moment()}
                          selected={
                            moment(this.state.expirationDate) ||
                            moment(Date.now()).add(7, "days")
                          }
                          onChange={this.updateCalendar}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <h5>Tags:</h5>
                      </Col>
                      <Col xs="12" md="9">
                        <h5>{this.stringifyTags(test.tags)}</h5>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <h5>Question Types:</h5>
                      </Col>
                      <Col xs="12" md="9">
                        <h5>
                          {this.stringifyQuestionTypes(test.question_types)}
                        </h5>
                      </Col>
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <Form action="" className="form-horizontal">
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="textarea-input">Candidate Emails</Label>
                      </Col>
                      <Col xs="12" md="6">
                        <Input
                          type="textarea"
                          rows="3"
                          onBlur={this.handleEmail}
                          disabled={this.state.submitted}
                        />
                        <FormText color="muted">
                          Please separate emails with a comma. (eg.
                          john@test.com,mary@test.com,tracy@test.com)
                        </FormText>
                      </Col>
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
              <hr />
              <Row style={{ maxHeight: "500px" }}>
                <Col xs="12">
                  <h5>Test Questions</h5>
                  <TestQuestionList
                    questions={test.question_details}
                    hideOrdering
                    disabledArrange
                  />
                </Col>
              </Row>
              <br />
              <Row style={{ float: "right" }}>
                <Col xs="4">
                  <Button
                    color="success"
                    onClick={() => this.handleSubmitPopover()}
                    disabled={this.state.submitDisable}
                  >
                    <strong>Invite Candidates</strong>
                  </Button>
                </Col>
              </Row>
              <br />
              <br />
              <br />
            </Container>
          </Card>
        )}
      </div>
    );
  }
}
