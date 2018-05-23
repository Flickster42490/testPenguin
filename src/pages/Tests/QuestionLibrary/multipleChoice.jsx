import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Progress
} from "reactstrap";
import queryString from "querystring";
import _ from "lodash";
import FontAwesome from "react-fontawesome";

export default class PreviewMultipleChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: props.question,
      returnTo: null,
      returnToTestId: null,
      module: props.module
    };
  }

  componentWillMount() {
    const queries = window.location.hash.substring(
      window.location.hash.indexOf("?") + 1
    );
    const returnTo = queryString.parse(queries).returnTo || null;
    const returnToTestId = queryString.parse(queries).returnToTestId || null;
    this.setState({
      returnTo: returnTo,
      returnToTestId: returnToTestId
    });
  }
  render() {
    const { question, returnTo, returnToTestId, module } = this.state;
    return (
      <div>
        {!module && (
          <Card className="module-container-card">
            <CardHeader className="preview-title">
              <Row>
                <Col md="10">
                  <h3>{question.name}</h3>
                </Col>
                <Col md="2">
                  {!returnTo && (
                    <a
                      href="#/dashboard/tests/questionLibrary"
                      className="float-right"
                    >
                      <FontAwesome name="chevron-circle-left" size="2x" />{" "}
                      &nbsp; Go Back
                    </a>
                  )}
                  {returnTo && (
                    <a
                      href={`${returnTo}?id=${returnToTestId}`}
                      className="float-right"
                    >
                      <FontAwesome name="chevron-circle-left" size="2x" />{" "}
                      &nbsp; Go Back
                    </a>
                  )}
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Card className="transparent-card">
                <CardHeader className="transparent-card-header">
                  <h4
                    dangerouslySetInnerHTML={{
                      __html: question.mc_stem
                    }}
                  />
                </CardHeader>
                <CardBody className="transparent-card-body">
                  {question.mc_choices.map((i, idx) => (
                    <div className="radio">
                      <label>
                        <input
                          type="radio"
                          value={i.id}
                          checked={question.mc_answer === i.id}
                          disabled
                        />
                        &nbsp;&nbsp;{i.value}
                      </label>
                    </div>
                  ))}
                  <br />
                  <strong>Correct Answer:&nbsp;</strong>
                  {
                    _.find(question.mc_choices, { id: question.mc_answer })
                      .value
                  }
                </CardBody>
              </Card>
              <br />
            </CardBody>
            <CardFooter>
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
            </CardFooter>
          </Card>
        )}
        {module && (
          <div>
            <h5
              dangerouslySetInnerHTML={{
                __html: question.mc_stem
              }}
            />
            {question.mc_choices.map((i, idx) => (
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    value={i.id}
                    checked={question.mc_answer === i.id}
                    disabled
                  />
                  &nbsp;&nbsp;{i.value}
                </label>
              </div>
            ))}
          </div>
        )}
        <br />
      </div>
    );
  }
}
