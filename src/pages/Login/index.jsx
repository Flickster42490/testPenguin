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
      username: "admin@testpenguin.com",
      password: "T3stp3nguin!",
      loginError: false
    };

    this.handleLocalSignIn = this.handleLocalSignIn.bind(this);
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
    console.log(type, e);
    this.setState({
      [type]: e.target.value
    });
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
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
                        <Button color="primary" className="mt-3">
                          Sign In with LinkedIn
                        </Button>
                      </Col>
                    </Row>
                    <hr />
                    <Row className="justify-content-center">
                      First Time User?{"  "} <a href="">Register Here</a>
                    </Row>
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
