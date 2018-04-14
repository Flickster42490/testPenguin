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
      question: []
    };
  }

  componentWillMount() {
    const queries = window.location.hash.split("?")[1];
    const questionId = queryString.parse(queries).id;
    axios.get(`/questions/id/${questionId}`).then(d => {
      this.setState({ question: d.data }, () => {
        this.forceUpdate();
      });
    });
  }
  render() {
    const { question } = this.state;
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
                  <div>
                    <Card className="pdf-card">
                      <CardHeader>
                        <Button outline color="default" block>
                          Reconciling Items
                        </Button>
                      </CardHeader>
                      <CardBody>
                        <PDF file="/img/q1.pdf" fillWidth />
                      </CardBody>
                    </Card>
                  </div>
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
                      <Input type="textarea" name="text" id="exampleText" />{" "}
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
