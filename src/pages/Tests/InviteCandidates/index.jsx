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
import Select from "react-select";
import "react-select/dist/react-select.css";
import { Alert } from "reactstrap";
import StripeCheckout from "react-stripe-checkout";
import { Preloader } from "../../../components/Preloader.jsx";

export default class InviteCandidates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testName: "Demo",
      testId: null,
      submitted: false,
      showSuccessToaster: false,
      user: undefined,
      paymentPopup: false,
      paymentAlertVisible: false,
      paymentInfo: { success: undefined, message: undefined }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.onToken = this.onToken.bind(this);
    this.onPaymentAlertDismiss = this.onPaymentAlertDismiss.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    document.body.classList.toggle("sidebar-hidden");
    const queries = window.location.hash.split("?")[1];
    const testId = queryString.parse(queries).id;
    const testName = queryString.parse(queries).name;
    localForage.getItem("userId").then(id => {
      axios.get(`/users/${id}`).then(d => {
        this.setState({
          user: d.data ? d.data[0] : undefined,
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
                this.setState({
                  paymentPopup: false,
                  user: d.data ? d.data[0] : undefined,
                  paymentLoading: false,
                  paymentAlertVisible: true,
                  paymentInfo: {
                    success: true,
                    message: `You have successfully made a payment of $${amount /
                      100}. Your confirmation number is #${payment.data.id}`
                  }
                });
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
  }

  render() {
    const { testName, showSuccessToaster, candidate } = this.state;
    return (
      <div>
        {this.state.user && (
          <Card>
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
        )}
      </div>
    );
  }
}
