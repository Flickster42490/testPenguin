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
      test: undefined
    };
  }

  componentWillMount() {
    document.body.classList.toggle("sidebar-hidden");
    const queries = window.location.hash.split("?")[1];
    const { id } = queryString.parse(queries);
    axios.get(`tests/${id}`).then(d => {
      this.setState({
        testId: id,
        test: d.data[0]
      });
    });
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
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
                          <h4>Test Name:</h4>
                        </Col>
                        <Col xs="12" md="9">
                          {test.name}
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <h4>Description</h4>
                        </Col>
                        <Col xs="12" md="9">
                          {test.description}
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <h4>Estimated Time</h4>
                        </Col>
                        <Col xs="12" md="9">
                          {test.estimated_time} Mins
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <h4>Tags</h4>
                        </Col>
                        <Col xs="12" md="9">
                          {this.stringifyTags(test.tags)}
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <h4>Question Types</h4>
                        </Col>
                        <Col xs="12" md="9">
                          {this.stringifyQuestionTypes(test.question_types)}
                        </Col>
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>
                <div>
                  <hr />
                  <Row style={{ maxHeight: "500px" }}>
                    <Col xs="12">
                      <h4>Test Questions</h4>
                      <TestQuestionList
                        questions={test.question_details}
                        disabledArrange
                      />
                    </Col>
                  </Row>
                </div>
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
