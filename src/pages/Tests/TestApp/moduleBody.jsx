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

export default class ModuleBody extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question: [],
      externalDocs: [],
      activeDocIndex: 0,
      width: 0,
      disabled: props.preview
    };
  }

  componentWillMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));

    let externalDocs = this.createExternalDocsArray(this.props.question);
    this.setState(
      {
        externalDocs: externalDocs,
        question: this.props.question,
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

  render() {
    const { question, externalDocs, questionList, currentIdx } = this.state;
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
                      <ButtonGroup>
                        {externalDocs.map((doc, idx) => {
                          return (
                            <Button outline color="default" key={idx}>
                              {doc.name}
                            </Button>
                          );
                        })}
                      </ButtonGroup>
                    </CardHeader>
                    <CardBody>
                      <PDF
                        file={`/img/${
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
                    disabled={this.state.disabled}
                  />
                )}
              <br />
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
                  {!this.state.disabled && (
                    <Input
                      type="textarea"
                      name="text"
                      rows="6"
                      id="exampleText"
                    />
                  )}
                  {this.state.disabled && (
                    <Input
                      type="textarea"
                      name="text"
                      rows="6"
                      value={question.module_stem_2_answer}
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* <CardFooter>
              <Row>
                <Col md="12">
                  <div>
                    <Card className="transparent-card">
                      <CardHeader className="transparent-card-header">
                        <strong>Question Notes:</strong>
                      </CardHeader>
                      <CardBody className="transparent-card-body">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: question.notes
                          }}
                        />
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
            </CardFooter> */}
        </CardBody>
      </div>
    );
  }
}
