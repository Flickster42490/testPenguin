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
import ReactTable from "react-table";
import "react-table/react-table.css";

import QuestionLibrary from "../QuestionLibrary/index.jsx";
import TestQuestionList from "./testQuestionList.jsx";

export default class addQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testQuestionList: [],
      testId: undefined
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleOpenLibrary = this.handleOpenLibrary.bind(this);
    this.handleAddQuestion = this.handleAddQuestion.bind(this);
  }

  componentWillMount() {
    document.body.classList.toggle("sidebar-hidden");
    const queries = window.location.hash.split("?")[1];
    const { id } = queryString.parse(queries);
    this.setState({
      testId: id
    });
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  calculateEstimatedTime(list) {
    let total = 0;
    list.forEach(i => (total = total + Number(i.estimated_time)));
    console.log(total);
    return total;
  }

  extractQuestionIds(list) {
    return list.map(i => {
      return String(i.id);
    });
  }

  extractQuestionTypes(list) {
    return _.reduce(
      list,
      (sum, q) => {
        if (q.type === "module" && !sum.module) sum.module = 1;
        else if (q.type === "multiple_choice" && !sum.multiple_choice)
          sum.multiple_choice = 1;
        else if (q.type === "module" && sum.module) sum.module++;
        else if (q.type === "multiple_choice") sum.multiple_choice++;
        return sum;
      },
      {}
    );
  }

  extractQuestionTags(list) {
    let tags = [];
    list.forEach(i => {
      if (i.tags) {
        tags = tags.concat(i.tags.split(","));
      }
    });
    tags.forEach(i => i.trim());
    return _.uniq(tags);
  }

  handleAddQuestion(v) {
    let questions = this.state.testQuestionList;
    questions.push(v);
    this.setState({
      testQuestionList: questions
    });
  }

  handleNext() {
    let { testQuestionList } = this.state;
    let questions = this.extractQuestionIds(testQuestionList);
    let types = this.extractQuestionTypes(testQuestionList);
    let tags = this.extractQuestionTags(testQuestionList);
    let estimatedTime = this.calculateEstimatedTime(testQuestionList);
    console.log(questions, types, tags);
    axios
      .post(`/tests/create/addQuestions/${this.state.testId}`, {
        questions: questions,
        questionDetails: testQuestionList,
        types: types,
        tags: tags,
        estimatedTime: estimatedTime
      })
      .then(data => {
        hashHistory.push(
          `dashboard/tests/createNewTest/review?id=${this.state.testId}`
        );
      });
  }

  handleOpenLibrary() {
    this.setState({
      questionLibraryDisplayed: true
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
                  <h3>Add Questions</h3> (<strong>step 2 of 4</strong>)
                </div>
              </Col>
              <br />
            </Row>
            <Row>
              <Col xs="12">
                <div className="text-center">
                  <div className="progress">
                    <Progress bar color="success" value="2" max="3" />
                  </div>
                  <br />
                </div>
              </Col>
            </Row>
            <div>
              <hr />
              <Row style={{ maxHeight: "500px" }}>
                <Col xs="12">
                  <h4>Test Questions</h4>
                  <TestQuestionList questions={this.state.testQuestionList} />
                </Col>
              </Row>
            </div>
            <br />

            <Row>
              <Col xs="12">
                <div className="text-center">
                  <ButtonGroup
                    size="sm"
                    vertical
                    style={{
                      maxWidth: "50%"
                    }}
                  >
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => this.handleOpenLibrary()}
                    >
                      Open Question Library
                    </Button>
                  </ButtonGroup>
                </div>
              </Col>
            </Row>

            <div>
              <hr />
              <Row style={{ maxHeight: "500px" }}>
                <Col xs="12">
                  <h4>Question Library</h4>
                  <QuestionLibrary
                    addQuestions={true}
                    handleAddQuestion={this.handleAddQuestion}
                  />
                </Col>
              </Row>
            </div>
            <br />
            <Row style={{ float: "right" }}>
              <Col xs="4">
                <Button color="success" onClick={() => this.handleNext()}>
                  Next
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
