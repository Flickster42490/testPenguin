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
import queryString from "querystring";
import FontAwesome from "react-fontawesome";

import JournalEntry from "./journalEntry.jsx";

export default class ModuleContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question: [],
      externalDocs: [],
      activeDocIndex: 0,
      width: 0,
      disabled: true,
      returnTo: null,
      returnToTestId: null
    };
  }

  componentWillMount() {
    const queries = window.location.hash.substring(
      window.location.hash.indexOf("?") + 1
    );
    const returnTo = queryString.parse(queries).returnTo || null;
    const returnToTestId = queryString.parse(queries).returnToTestId || null;
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));

    let externalDocs = this.createExternalDocsArray(this.props.question);
    this.setState(
      {
        externalDocs: externalDocs,
        question: this.props.question,
        returnTo: returnTo,
        returnToTestId: returnToTestId
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
    if (question[0].module_ext_name_1)
      externalDocs.push({
        name: question[0].module_ext_name_1,
        url: question[0].module_ext_url_1
      });
    if (question[0].module_ext_name_2)
      externalDocs.push({
        name: question[0].module_ext_name_2,
        url: question[0].module_ext_url_2
      });
    if (question[0].module_ext_name_3)
      externalDocs.push({
        name: question[0].module_ext_name_3,
        url: question[0].module_ext_url_3
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
    } else {
      return 1;
    }
  }

  /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }

  render() {
    const { question, externalDocs, returnTo, returnToTestId } = this.state;
    return (
      <div>
        {/* <PreviewMultipleChoice /> */}
        <Card className="module-container-card">
          <CardHeader className="preview-title">
            <Row>
              <Col md="10">
                <h3>{question[0] ? question[0].name : ""}</h3>
              </Col>
              <Col md="2">
                {!returnTo && (
                  <a
                    href="#/dashboard/tests/questionLibrary"
                    className="float-right"
                  >
                    <FontAwesome name="chevron-circle-left" size="2x" /> &nbsp;
                    Go Back
                  </a>
                )}
                {returnTo && (
                  <a
                    href={`${returnTo}?id=${returnToTestId}`}
                    className="float-right"
                  >
                    <FontAwesome name="chevron-circle-left" size="2x" /> &nbsp;
                    Go Back
                  </a>
                )}
              </Col>
            </Row>
          </CardHeader>
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
                          __html: question[0] ? question[0].module_stem_1 : ""
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
                {question[0] &&
                  question[0].type === "module" &&
                  question[0].module_type === "journal_entry" && (
                    <JournalEntry
                      question={question[0]}
                      disabled={this.state.disabled}
                    />
                  )}
                <br />
                {question[0].module_stem_2 && (
                  <Card className="transparent-card">
                    <CardHeader className="transparent-card-header">
                      <strong>Part 2:</strong>
                    </CardHeader>
                    <CardBody className="transparent-card-body">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: question[0] ? question[0].module_stem_2 : ""
                        }}
                      />
                      <Input
                        type="textarea"
                        name="text"
                        rows="6"
                        id="exampleText"
                        disabled={this.state.disabled}
                        value={
                          question[0] ? question[0].module_stem_2_answer : ""
                        }
                      />{" "}
                    </CardBody>
                  </Card>
                )}
              </Col>
            </Row>
            <CardFooter>
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
                            __html: question[0] ? question[0].notes : ""
                          }}
                        />
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
            </CardFooter>
          </CardBody>
        </Card>
      </div>
    );
  }
}
