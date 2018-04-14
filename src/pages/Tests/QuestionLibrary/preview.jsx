import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardGroup,
  CardHeader,
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
import PreviewMultipleChoice from "./previewMultipleChoice.jsx";
import { Preloader } from "../../../components/Preloader.jsx";

export default class Preview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question: [],
      externalDocs: [],
      activeDocIndex: 0,
      width: 0
    };
  }

  componentWillMount() {
    const queries = window.location.hash.split("?")[1];
    const questionId = queryString.parse(queries).id;
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    axios.get(`/questions/id/${questionId}`).then(d => {
      let externalDocs = this.createExternalDocsArray(d.data);
      this.setState({ externalDocs: externalDocs, question: d.data }, () => {
        this.forceUpdate();
      });
    });
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
    const { question, externalDocs } = this.state;
    return (
      <div>
        {/* <PreviewMultipleChoice /> */}
        <Preloader loading={!question[0]}>
          <Card className="module-container-card">
            <CardHeader className="preview-title">
              <Row>
                <Col md="10">
                  <h3>{question[0] ? question[0].name : ""}</h3>
                </Col>
                <Col md="2">
                  <a href="#/dashboard/tests/questionLibrary">
                    <FontAwesome name="chevron-circle-left" size="2x" /> &nbsp;
                    Go Back
                  </a>
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
                  <JournalEntry question={question[0]} />
                  <br />
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
                      />{" "}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Preloader>
      </div>
    );
  }
}
