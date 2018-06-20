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
import localForage from "localforage";
import "react-select/dist/react-select.css";

export default class testBasics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      userId: undefined,
      disableNext: true
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    document.body.classList.toggle("sidebar-hidden");
    localForage.getItem("userId").then(id => {
      this.setState({
        userId: id
      });
    });
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  handleName(e) {
    this.setState({
      name: e.target.value,
      disableNext: e.target.value && this.state.description ? false : true
    });
  }

  handleDescription(e) {
    this.setState({
      description: e.target.value,
      disableNext: e.target.value && this.state.name ? false : true
    });
  }

  handleNext() {
    axios
      .post("/tests/create/testBasics", {
        name: this.state.name,
        description: this.state.description,
        userId: this.state.userId
      })
      .then(d => {
        let testId = d.data[0].id;
        hashHistory.push(
          `dashboard/tests/createNewTest/addQuestions?id=${testId}`
        );
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
                  <h3>Test Basics</h3> (<strong>step 1 of 3</strong>)
                </div>
              </Col>
              <br />
            </Row>
            <Row>
              <Col xs="12">
                <div className="text-center">
                  <div className="progress">
                    <Progress bar color="success" value="1" max="3" />
                  </div>
                  <br />
                </div>
              </Col>
            </Row>
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
                      <Label htmlFor="text-input">Test Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        onBlur={this.handleName}
                        maxLength="30"
                      />
                      <FormText color="muted">
                        (Only you can see this description)
                      </FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Description</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="textarea"
                        name="textarea-input"
                        id="textarea-input"
                        rows="3"
                        onBlur={this.handleDescription}
                        maxLength="200"
                        minLength="10"
                      />
                      <FormText color="muted">
                        (Only you can see this description)
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
                  onClick={() => this.handleNext()}
                  disabled={this.state.disableNext}
                >
                  Next Step
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
