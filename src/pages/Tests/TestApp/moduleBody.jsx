import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardGroup,
  CardHeader,
  CardFooter,
  CardBody,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap";
import axios from "axios";
import PDF from "react-pdf-js";
import FontAwesome from "react-fontawesome";

import JournalEntry from "../QuestionLibrary/journalEntry.jsx";
import Reconciliation from "../QuestionLibrary/reconciliation.jsx";
import MultipleChoiceContainer from "./moduleMultipleChoiceContainer.jsx";

const deepCopy = oldObj => {
  var newObj = oldObj;
  if (oldObj && typeof oldObj === "object") {
    newObj =
      Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
    for (var i in oldObj) {
      newObj[i] = deepCopy(oldObj[i]);
    }
  }
  return newObj;
};
export default class ModuleBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: null,
      questionAnswered: null,
      externalDocs: [],
      activeDocIndex: 0,
      width: 0,
      disabled: props.preview,
      review: props.review
    };
    this.handleSubModuleOneUpdate = this.handleSubModuleOneUpdate.bind(this);
    this.handleSubModuleTwoUpdate = this.handleSubModuleTwoUpdate.bind(this);
  }

  componentWillMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));

    let externalDocs = this.createExternalDocsArray(this.props.question);
    this.setState(
      {
        externalDocs: externalDocs,
        question: this.props.question,
        questionAnswered: this.props.questionAnswered,
        questionList: this.props.questionList,
        currentIdx: this.props.currentIdx
      },
      () => {
        this.forceUpdate();
      }
    );
  }

  componentWillReceiveProps(props) {
    let externalDocs = this.createExternalDocsArray(this.props.question);
    this.setState(
      {
        externalDocs: externalDocs,
        question: this.props.question,
        questionAnswered: this.props.questionAnswered,
        questionList: this.props.questionList,
        currentIdx: this.props.currentIdx
      },
      () => {
        this.forceUpdate();
      }
    );
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  handleSubModuleOneUpdate(subModule) {
    this.setState(
      {
        questionAnswered: Object.assign(this.state.questionAnswered, {
          module_candidate_answer: { segments: subModule }
        })
      },
      () => {
        this.props.handleAnswerUpdate(this.state.questionAnswered);
      }
    );
  }

  handleSubModuleTwoUpdate(e) {
    this.setState(
      {
        questionAnswered: Object.assign(this.state.questionAnswered, {
          module_stem_2_candidate_answer: e.target.value
        })
      },
      () => {
        this.props.handleAnswerUpdate(this.state.questionAnswered);
      }
    );
  }

  createExternalDocsArray(question) {
    let externalDocs = [];
    if (question.module_ext_name_1)
      externalDocs.push({
        name: question.module_ext_name_1,
        url: question.module_ext_url_1
      });
    if (question.module_ext_name_2)
      externalDocs.push({
        name: question.module_ext_name_2,
        url: question.module_ext_url_2
      });
    if (question.module_ext_name_3)
      externalDocs.push({
        name: question.module_ext_name_3,
        url: question.module_ext_url_3
      });
    return externalDocs;
  }

  setPdfScale() {
    if (this.state.width < 1340) {
      return 0.6;
    } else if (this.state.width < 1441) {
      return 0.7;
    } else if (this.state.width < 1651) {
      return 0.8;
    } else if (this.state.width < 1851) {
      return 0.9;
    } else if (this.state.width < 2000) {
      return 1;
    } else return 1.1;
  }

  /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }

  updatePDF(idx) {
    console.log(idx);
    this.setState({
      activeDocIndex: idx
    });
  }

  render() {
    const {
      question,
      questionAnswered,
      externalDocs,
      questionList,
      currentIdx
    } = this.state;
    return (
      <div>
        <CardBody>
          <Row>
            <Col md="5" className="left-column">
              <div>
                <Card className="transparent-card">
                  <CardHeader className="transparent-card-header">
                    <strong>Part 1:</strong>
                  </CardHeader>
                  <CardBody className="transparent-card-body">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: question.module_stem_1
                      }}
                    />
                  </CardBody>
                </Card>
              </div>
              {externalDocs.length > 0 && (
                <div>
                  <Card className="pdf-card">
                    <CardHeader>
                      <ButtonGroup style={{ width: "100%" }}>
                        {externalDocs.map((doc, idx) => {
                          return (
                            <Button
                              outline
                              color="default"
                              key={idx}
                              style={{ width: "100%", borderRadius: "2px" }}
                              onClick={() => this.updatePDF(idx)}
                              active={this.state.activeDocIndex === idx}
                            >
                              {doc.name}
                            </Button>
                          );
                        })}
                      </ButtonGroup>
                    </CardHeader>
                    <CardBody
                      style={{
                        display: "flex",
                        justifyContent: "center"
                      }}
                    >
                      <PDF
                        file={`https://s3-us-west-2.amazonaws.com/question-assets/pdf/${
                          externalDocs[this.state.activeDocIndex].url
                        }`}
                        style={{ maxWidth: "100%", height: "auto" }}
                        scale={this.setPdfScale()} //lowest is 0.7. Based on viewport size.
                      />
                    </CardBody>
                  </Card>
                </div>
              )}
            </Col>
            <Col md="7" className="right-column">
              {question &&
                question.type === "module" &&
                question.module_type === "journal_entry" && (
                  <JournalEntry
                    question={question}
                    questionAnswered={questionAnswered}
                    handleSubModuleOneUpdate={this.handleSubModuleOneUpdate}
                    disabled={this.state.disabled || this.state.review}
                    review={this.state.review}
                  />
                )}
              {question &&
                question.type === "module" &&
                question.module_type === "reconciliation" && (
                  <Reconciliation
                    question={question}
                    questionAnswered={questionAnswered}
                    handleSubModuleOneUpdate={this.handleSubModuleOneUpdate}
                    disabled={this.state.disabled || this.state.review}
                    review={this.state.review}
                  />
                )}
              {question &&
                question.type === "module" &&
                question.module_type === "financial_statement" && (
                  <Reconciliation
                    question={question}
                    questionAnswered={questionAnswered}
                    handleSubModuleOneUpdate={this.handleSubModuleOneUpdate}
                    disabled={this.state.disabled || this.state.review}
                    review={this.state.review}
                  />
                )}
              {question &&
                question.type === "module" &&
                question.module_type === "multiple_choice" && (
                  <div>
                    <MultipleChoiceContainer
                      question={question}
                      questionAnswered={questionAnswered}
                      handleSubModuleOneUpdate={this.handleSubModuleOneUpdate}
                      disabled={this.state.disabled}
                      review={this.state.review}
                    />
                  </div>
                )}
              <br />
              {question.module_stem_2 && (
                <Card className="transparent-card">
                  <CardHeader className="transparent-card-header">
                    <strong>Part 2:</strong>
                  </CardHeader>
                  <CardBody className="transparent-card-body">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: question.module_stem_2
                      }}
                    />
                    {!this.state.disabled &&
                      !this.state.review && (
                        <Input
                          type="textarea"
                          name="text"
                          rows="6"
                          value={
                            !questionAnswered.module_stem_2_candidate_answer
                              ? " "
                              : questionAnswered.module_stem_2_candidate_answer
                          }
                          onChange={value =>
                            this.handleSubModuleTwoUpdate(value)
                          }
                          maxLength="500"
                        />
                      )}
                    {!this.state.disabled &&
                      this.state.review && (
                        <Input
                          type="textarea"
                          name="text"
                          rows="6"
                          disabled
                          value={
                            !questionAnswered.module_stem_2_candidate_answer
                              ? " "
                              : questionAnswered.module_stem_2_candidate_answer
                          }
                          onChange={value =>
                            this.handleSubModuleTwoUpdate(value)
                          }
                          maxLength="500"
                        />
                      )}

                    {this.state.disabled &&
                      !this.state.review && (
                        <Input
                          type="textarea"
                          name="text"
                          rows="6"
                          disabled
                          defaultValue={question.module_stem_2_answer}
                        />
                      )}
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>
        </CardBody>
      </div>
    );
  }
}
