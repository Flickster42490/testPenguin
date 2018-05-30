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
import "react-select/dist/react-select.css";

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
      visible: false
    };

    this.togglePasswordChange = this.togglePasswordChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitNewPassword = this.submitNewPassword.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    document.body.classList.toggle("sidebar-hidden");
    localForage.getItem("userId").then(id => {
      axios.get(`/users/${id}`).then(d => {
        this.setState({
          userId: id,
          user: d.data ? d.data[0] : undefined
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
                        <Col md={{ size: 2, offset: 1 }}>
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
                          <Col md={{ size: 2, offset: 1 }}>
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
                        <Col md={{ size: 2, offset: 1 }}>
                          <Label htmlFor="text-input">Email</Label>
                        </Col>
                        <Col xs="12" md="3">
                          {<strong>{this.state.user.email_address}</strong>}
                        </Col>
                      </Row>
                      <Row>
                        <Col md={{ size: 2, offset: 1 }}>
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
              </Col>
            </Row>
            <br />
            <br />
          </Container>
        </main>
      </div>
    );
  }
}
