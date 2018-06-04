import React, { Component } from "react";
import { hashHistory } from "react-router";
import {
  Container,
  Row,
  Alert,
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
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import "react-select/dist/react-select.css";

import { Preloader } from "../../components/Preloader.jsx";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: undefined,
      user: undefined,
      passwordChange: false,
      oldPassword: undefined,
      newPassword: undefined,
      setPassword: { success: undefined, message: undefined },
      visible: false,
      paymentAlertVisible: false,
      loading: true,
      paymentLoading: true,
      paymentInfo: { success: undefined, message: undefined }
    };

    this.togglePasswordChange = this.togglePasswordChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitNewPassword = this.submitNewPassword.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onPaymentAlertDismiss = this.onPaymentAlertDismiss.bind(this);
    this.onToken = this.onToken.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    document.body.classList.toggle("sidebar-hidden");
    localForage.getItem("userId").then(id => {
      axios.get(`/users/${id}`).then(d => {
        this.setState({
          userId: id,
          user: d.data ? d.data[0] : undefined,
          loading: false,
          paymentLoading: false
        });
      });
    });
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  togglePasswordChange() {
    this.setState(
      {
        passwordChange: true,
        setPassword: { success: undefined, message: undefined }
      },
      () => {
        this.forceUpdate();
      }
    );
  }

  onDismiss() {
    this.setState({ visible: false });
  }
  onPaymentAlertDismiss() {
    this.setState({ paymentAlertVisible: false });
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
            userId: this.state.userId,
            purchaseAmount: amount,
            tokenAmount: tokenAmount
          })
          .then(payment => {
            if (payment.data) {
              axios.get(`/users/${this.state.userId}`).then(d => {
                this.setState({
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

  submitNewPassword() {
    axios
      .post("/users/updatePassword", {
        userId: this.state.userId,
        newPassword: this.state.newPassword,
        oldPassword: this.state.oldPassword
      })
      .then(d => {
        this.setState({
          setPassword: {
            success: true,
            message: "Your password has been successfully updated!"
          },
          visible: true,
          passwordChange: false
        });
      })
      .catch(err => {
        console.log(err.message);
        this.setState({
          setPassword: {
            success: false,
            message:
              "Your input for Current Password appears to be incorrect. Please try again."
          },
          visible: true
        });
      });
  }

  handleInputChange(type, e) {
    this.setState({
      [type]: e.target.value
    });
  }

  render() {
    return (
      <div className="app-body">
        <main className="main">
          <Container fluid>
            <Preloader loading={this.state.loading}>
              <Row>
                <Col xs="12" md={{ size: 8, offset: 2 }}>
                  <h2>My Profile</h2>
                  {this.state.setPassword.message && (
                    <Alert
                      isOpen={this.state.visible}
                      toggle={this.onDismiss}
                      color={
                        this.state.setPassword.success ? "success" : "danger"
                      }
                    >
                      {this.state.setPassword.message}
                    </Alert>
                  )}
                  <Card>
                    {this.state.user && (
                      <div>
                        <br />
                        <Row>
                          <Col md={{ size: 2 }} style={{ paddingLeft: "40px" }}>
                            <Label htmlFor="text-input">Name</Label>
                          </Col>
                          <Col xs="12" md="3">
                            <strong>
                              {this.state.user.first_name}&nbsp;&nbsp;{
                                this.state.user.last_name
                              }
                            </strong>
                          </Col>
                        </Row>
                        {this.state.user.password && (
                          <Row>
                            <Col
                              md={{ size: 2 }}
                              style={{ paddingLeft: "40px" }}
                            >
                              <Label htmlFor="text-input">Password</Label>
                            </Col>
                            <Col xs="12" md="9">
                              {!this.state.user.passwordChange && (
                                <span
                                  className="link"
                                  onClick={this.togglePasswordChange}
                                >
                                  Change Password
                                </span>
                              )}
                              {this.state.passwordChange && (
                                <Row>
                                  <Col md="3">
                                    <Input
                                      style={{ display: "inline" }}
                                      placeholder="Current Password"
                                      type="password"
                                      disabled={this.state.setPassword.success}
                                      onChange={e =>
                                        this.handleInputChange("oldPassword", e)
                                      }
                                    />
                                  </Col>
                                  <Col md="3">
                                    <Input
                                      style={{ display: "inline" }}
                                      placeholder="New Password"
                                      type="password"
                                      disabled={this.state.setPassword.success}
                                      onChange={e =>
                                        this.handleInputChange("newPassword", e)
                                      }
                                    />
                                  </Col>
                                  <Col md="3">
                                    <Button
                                      style={{ display: "inline" }}
                                      onClick={this.submitNewPassword}
                                      color="primary"
                                    >
                                      Set Password
                                    </Button>
                                  </Col>
                                </Row>
                              )}
                            </Col>
                          </Row>
                        )}
                        <Row>
                          <Col md={{ size: 2 }} style={{ paddingLeft: "40px" }}>
                            <Label htmlFor="text-input">Email</Label>
                          </Col>
                          <Col xs="12" md="3">
                            {<strong>{this.state.user.email_address}</strong>}
                          </Col>
                        </Row>
                        <Row>
                          <Col md={{ size: 2 }} style={{ paddingLeft: "40px" }}>
                            <Label htmlFor="text-input">Company</Label>
                          </Col>
                          <Col xs="12" md="3">
                            {<strong>{this.state.user.company}</strong>}
                          </Col>
                        </Row>
                        <br />
                      </div>
                    )}
                  </Card>{" "}
                </Col>
              </Row>
              <Row>
                <Col xs="12" md={{ size: 8, offset: 2 }}>
                  <h2>My Subscription and Payment </h2>
                  {this.state.paymentInfo.message && (
                    <Alert
                      isOpen={this.state.paymentAlertVisible}
                      toggle={this.onPaymentAlertDismiss}
                      color={
                        this.state.paymentInfo.success ? "success" : "danger"
                      }
                    >
                      {this.state.paymentInfo.message}
                    </Alert>
                  )}
                  <Preloader loading={this.state.paymentLoading}>
                    {this.state.user && (
                      <Card>
                        <br />
                        {!this.state.user.trial_end && (
                          <Row>
                            <Col
                              md={{ size: 2 }}
                              style={{ paddingLeft: "40px" }}
                            >
                              <Label htmlFor="text-input"># of Tokens</Label>
                            </Col>
                            <Col xs="12" md="3">
                              <strong>{this.state.user.tokens} Tokens</strong>
                            </Col>
                          </Row>
                        )}
                        {this.state.user.trial_end && (
                          <Row>
                            <Col
                              md={{ size: 2 }}
                              style={{ paddingLeft: "40px" }}
                            >
                              <Label htmlFor="text-input">
                                Free Trial Until{" "}
                              </Label>
                            </Col>
                            <Col xs="12" md="3">
                              <strong>
                                {moment(this.state.user.trial_end).format(
                                  "MM/DD/YYYY"
                                )}
                              </strong>
                            </Col>
                          </Row>
                        )}
                        {this.state.user.trial_end &&
                          this.state.user.tokens && (
                            <Row>
                              <Col
                                md={{ size: 2 }}
                                style={{ paddingLeft: "40px" }}
                              >
                                <Label htmlFor="text-input">
                                  # of Trial Tokens{" "}
                                </Label>
                              </Col>
                              <Col xs="12" md="3">
                                <strong>{this.state.user.tokens}</strong>
                              </Col>
                            </Row>
                          )}
                        <h4 style={{ padding: "20px", paddingTop: "0" }}>
                          Want to Add More Tokens? Select a Plan Below:{" "}
                        </h4>
                        <Row>
                          <Col
                            xs="12"
                            md="4"
                            className="text-align-center"
                            style={{ paddingLeft: "40px" }}
                          >
                            <Card style={{ borderRadius: "5px" }}>
                              <h4>5 Test Tokens</h4>
                              <h5>$50 ($10/Test)</h5>
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
                              <h4>25 Test Tokens</h4>
                              <h5>$200 ($8/Test)</h5>
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
                          <Col
                            xs="12"
                            md="4"
                            className="text-align-center"
                            style={{ paddingRight: "40px" }}
                          >
                            <Card style={{ borderRadius: "5px" }}>
                              <h4>100 Test Tokens</h4>
                              <h5>$500 ($5/Test)</h5>
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
                      </Card>
                    )}
                  </Preloader>
                </Col>
              </Row>
              <br />
              <br />
            </Preloader>
          </Container>
        </main>
      </div>
    );
  }
}
