import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Progress,
  Input,
  Button,
  ButtonGroup,
  ButtonToolbar
} from "reactstrap";
import encodeUrl from "encodeurl";
import axios from "axios";
import moment from "moment";
import queryString from "querystring";
import momentDurationFormatSetup from "moment-duration-format";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "status-indicator/styles.css";

import { Preloader } from "../../../components/Preloader.jsx";
import TestQuestionList from "./testQuestionList.jsx";

const typeMap = {
  module: "Module",
  multiple_choice: "Multiple Choice"
};

export default class ReviewCreatedTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testId: undefined,
      test: undefined,
      estimatedTime: undefined,
      expirationDate: undefined
    };

    this.handleCreateTest = this.handleCreateTest.bind(this);
    this.destroyTest = this.destroyTest.bind(this);
    this.handleEstimatedTime = this.handleEstimatedTime.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    document.body.classList.toggle("sidebar-hidden");
    const queries = window.location.hash.split("?")[1];
    const { id } = queryString.parse(queries);
    axios.get(`tests/${id}`).then(d => {
      this.setState({
        testId: id,
        test: d.data[0],
        estimatedTime: d.data[0].estimated_time
      });
    });
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  destroyTest() {
    axios.post(`/tests/destroy`, { testId: this.state.testId }).then(d => {
      window.location.href = "/#/dashboard/tests/customTests";
    });
  }

  handleCreateTest() {
    axios
      .post(`/tests/create/review/${this.state.testId}`, {
        estimatedTime: this.state.estimatedTime
      })
      .then(d => {
        window.location.href = "/#/dashboard/tests/customTests";
      });
  }

  handleEstimatedTime(e) {
    this.setState({
      estimatedTime: e.target.value
    });
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
    console.log(typeMapped);
    return typeMapped;
  }

  render() {
    const { test } = this.state;
    console.log(test);
    return (
      <Preloader loading={!test}>
        <div>
          <Card>
            {test && (
              <Container style={{ marginTop: "10px" }}>
                <Row>
                  <Col xs="12">
                    <div className="text-center">
                      <h3>Review Created Test</h3> (<strong>step 3 of 3</strong>)
                    </div>
                  </Col>
                  <br />
                </Row>
                <Row>
                  <Col xs="12">
                    <div className="text-center">
                      <div className="progress">
                        <Progress bar color="success" value="3" max="3" />
                      </div>
                      <br />
                    </div>
                  </Col>
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
                          <h5>Time:</h5>
                        </Col>
                        <Col xs="12" md="9">
                          <div>
                            <input
                              type="radio"
                              value={test.estimated_time}
                              checked={
                                this.state.estimatedTime &&
                                this.state.estimatedTime == test.estimated_time
                              }
                              onClick={this.handleEstimatedTime}
                            />{" "}
                            {test.estimated_time} Mins{" "}
                            <span className="muted-text">(Recommended)</span>&nbsp;&nbsp;
                            <input
                              type="radio"
                              value={Math.round(
                                Number(test.estimated_time) * 1.25
                              )}
                              checked={
                                this.state.estimatedTime &&
                                this.state.estimatedTime ==
                                  Math.round(Number(test.estimated_time) * 1.25)
                              }
                              onClick={this.handleEstimatedTime}
                            />{" "}
                            {Math.round(Number(test.estimated_time) * 1.25)}{" "}
                            Mins <span className="muted-text">(25% more)</span>&nbsp;&nbsp;
                            <input
                              type="radio"
                              value={Math.round(
                                Number(test.estimated_time) * 1.5
                              )}
                              checked={
                                this.state.estimatedTime &&
                                this.state.estimatedTime ==
                                  Math.round(Number(test.estimated_time) * 1.5)
                              }
                              onClick={this.handleEstimatedTime}
                            />{" "}
                            {Math.round(Number(test.estimated_time) * 1.5)} Mins{" "}
                            <span className="muted-text">(50% more)</span>
                          </div>
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
                <div>
                  <hr />
                  <Row style={{ maxHeight: "500px" }}>
                    <Col xs="12">
                      <h5>Test Questions</h5>
                      <TestQuestionList
                        questions={test.question_details}
                        hideOrdering
                        review
                        disabledArrange
                      />
                    </Col>
                  </Row>
                </div>
                <br />
                <Row style={{ float: "right" }}>
                  <Col xs="12" s="4">
                    <a onClick={this.destroyTest}>
                      <Button color="link">Cancel</Button>
                    </a>{" "}
                    &nbsp;&nbsp;
                    <a onClick={this.handleCreateTest}>
                      <Button color="success">Create Test</Button>
                    </a>
                  </Col>
                </Row>
                <br />
                <br />
              </Container>
            )}
          </Card>
        </div>
      </Preloader>
    );
  }
}
