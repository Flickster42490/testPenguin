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
import Select from "react-select";
import "react-select/dist/react-select.css";

export default class questionDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeValue: "",
      skillValue: "",
      difficultyValue: "",
      typeValue: ""
    };

    this.updateAnswerValue = this.updateAnswerValue.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  handleNext() {
    hashHistory.push("tests/createNewQuestion/questionReview");
  }

  updateAnswerValue(value) {
    this.setState({
      answerValue: value
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
                  <h3>Question Contents</h3> (<strong>step 2 of 3</strong>)
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
            <Row>
              <Col xs="1" />
              <Col xs="10">
                <h4>A/P Clerk</h4>
                <br />
                <Form
                  action=""
                  method="post"
                  encType="multipart/form-data"
                  className="form-horizontal"
                >
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Question Stem</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="textarea"
                        name="textarea-input"
                        id="textarea-input"
                        rows="3"
                        placeholder="Content..."
                      />
                      <FormText color="muted">
                        (Fill in question content)
                      </FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Answer Choice 1</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Answer Choice 2</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Answer Choice 3</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Answer Choice 4</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Correct Answer</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                        options={[
                          {
                            label: "Answer Choice 1",
                            value: "Answer Choice 1"
                          },
                          {
                            label: "Answer Choice 2",
                            value: "Answer Choice 2"
                          },
                          {
                            label: "Answer Choice 3",
                            value: "Answer Choice 3"
                          },
                          { label: "Answer Choice 4", value: "Answer Choice 4" }
                        ]}
                        value={this.state.answerValue}
                        onChange={this.updateAnswerValue}
                      />
                    </Col>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
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
