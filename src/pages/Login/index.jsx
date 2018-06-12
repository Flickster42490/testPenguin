import React, { Component } from "react";
import {
  Alert,
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: undefined,
      password: undefined,
      firstName: undefined,
      lastName: undefined,
      company: undefined,
      loginError: false,
      registerError: false,
      missingInfoError: false,
      displayRegistration: false
    };

    this.handleLocalSignIn = this.handleLocalSignIn.bind(this);
    this.handleLocalRegistration = this.handleLocalRegistration.bind(this);
    this.displayRegisterForm = this.displayRegisterForm.bind(this);
  }

  displayRegisterForm() {
    this.setState(
      {
        displayRegistration: true
      }
      // () => {
      //   this.forceUpdate();
      // }
    );
  }

  handleLocalRegistration() {
    axios
      .post("/auth/local/register", {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        username: this.state.username,
        password: this.state.password,
        company: this.state.company,
        currentDate: new Date()
      })
      .then(u => {
        if (u.data)
          window.location.href = `/#/dashboard/candidates?id=${u.data.id}`;
      })
      .catch(err => {
        this.setState(
          {
            userExistError: false,
            loginError: false,
            missingInfoError: false
          },
          () => {
            if (err.response.data === "found") {
              this.setState({
                userExistError: true
              });
            } else if (err.response.data && err.response.data.missing) {
              this.setState({
                missingInfoError: err.response.data.missing
              });
            } else {
              this.setState({
                registerError: true
              });
            }
          }
        );
      });
  }

  handleLocalSignIn() {
    console.log("posting", this.state.username, this.state.password);
    axios
      .post("/auth/local", {
        username: this.state.username,
        password: this.state.password
      })
      .then(u => {
        console.log(u);
        if (u.data)
          window.location.href = `/#/dashboard/candidates?id=${u.data.id}`;
      })
      .catch(err => {
        if (err)
          this.setState({
            loginError: true
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
      <div
        className="app flex-row align-items-center login"
        style={{ backgroundImage: "/img/login-background.png" }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card>
                  <CardBody className="text-center">
                    <Row className="justify-content-center">
                      <Col md="8">
                        <h2>Welcome to Accounting Penguin!</h2>
                        <br />
                        {this.state.loginError && (
                          <Alert color="danger">
                            The email and password you've entered does not
                            match. Please try again.
                          </Alert>
                        )}
                        <Input
                          placeholder="Email"
                          onChange={e => this.handleInputChange("username", e)}
                        />
                        <br />
                        <Input
                          placeholder="Password"
                          type="password"
                          onChange={e => this.handleInputChange("password", e)}
                        />
                        <Button
                          color="secondary"
                          className="mt-3"
                          onClick={this.handleLocalSignIn}
                        >
                          Sign In
                        </Button>
                        <br />
                        <a href="/auth/google">
                          <Button color="danger" className="mt-3">
                            Sign In with Google
                          </Button>
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a href="/auth/linkedin">
                          <Button color="primary" className="mt-3">
                            Sign In with LinkedIn
                          </Button>
                        </a>
                      </Col>
                    </Row>
                    <hr />
                    <Row className="justify-content-center">
                      First Time User?&nbsp;&nbsp;<span
                        className="link"
                        onClick={this.displayRegisterForm}
                      >
                        Register Here
                      </span>
                    </Row>
                    <br />
                    {this.state.registerError && (
                      <Alert color="danger">
                        The user cannot be created at this time. Please try
                        again.
                      </Alert>
                    )}
                    {this.state.userExistError && (
                      <Alert color="danger">
                        The user already exists in the system. Please sign in
                        above.
                      </Alert>
                    )}
                    {this.state.missingInfoError && (
                      <Alert color="danger">
                        Please fill in the following missing fields:{" "}
                        {this.state.missingInfoError.toString()}
                      </Alert>
                    )}
                    {this.state.displayRegistration && (
                      <Row className="justify-content-center">
                        <Col xs="12" md="3">
                          <Input
                            placeholder="First Name"
                            onChange={e =>
                              this.handleInputChange("firstName", e)
                            }
                          />
                        </Col>
                        <Col xs="12" md="3">
                          <Input
                            placeholder="Last Name"
                            onChange={e =>
                              this.handleInputChange("lastName", e)
                            }
                          />
                        </Col>
                        <Col xs="12" md="6">
                          <Input
                            placeholder="Company Name"
                            onChange={e => this.handleInputChange("company", e)}
                          />
                        </Col>
                        <br />
                        <br />
                        <br />
                        <Col xs="12" md="6">
                          <Input
                            placeholder="Email"
                            onChange={e =>
                              this.handleInputChange("username", e)
                            }
                          />
                        </Col>
                        <Col xs="12" md="6">
                          <Input
                            placeholder="Password"
                            type="password"
                            onChange={e =>
                              this.handleInputChange("password", e)
                            }
                          />
                        </Col>
                        <Button
                          color="secondary"
                          className="mt-3"
                          onClick={this.handleLocalRegistration}
                        >
                          Register
                        </Button>
                      </Row>
                    )}
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
