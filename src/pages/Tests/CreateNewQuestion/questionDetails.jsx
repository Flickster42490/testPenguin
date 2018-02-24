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

    this.updateDifficultyValue = this.updateDifficultyValue.bind(this);
    this.updateTimeValue = this.updateTimeValue.bind(this);
    this.updateSkillValue = this.updateSkillValue.bind(this);
    this.updateTypeValue = this.updateTypeValue.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentWillMount() {
    console.log(queryString.parse());
  }

  handleNext() {
    hashHistory.push("tests/createNewQuestion/questionContents");
  }

  updateDifficultyValue(value) {
    this.setState({
      difficultyValue: value
    });
  }

  updateTimeValue(value) {
    this.setState({
      timeValue: value
    });
  }

  updateSkillValue(value) {
    this.setState({
      skillValue: value
    });
  }

  updateTypeValue(value) {
    this.setState({
      typeValue: value
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
                  <h3>Question Details</h3> (<strong>step 1 of 3</strong>)
                </div>
              </Col>
              <br />
            </Row>
            <Row>
              <Col xs="12">
                <div className="text-center">
                  <div className="progress">
                    <Progress bar color="success" value="1" max="3" />
                  </div>
                  <br />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="1" />
              <Col xs="10">
                <Form
                  action=""
                  method="post"
                  encType="multipart/form-data"
                  className="form-horizontal"
                >
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Question Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Description</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="textarea"
                        name="textarea-input"
                        id="textarea-input"
                        rows="3"
                        placeholder="Content..."
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Timing</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                        options={[
                          { label: 1, value: 1 },
                          { label: 2, value: 2 },
                          { label: 3, value: 3 },
                          { label: 4, value: 4 },
                          { label: 5, value: 5 },
                          { label: 6, value: 6 },
                          { label: 7, value: 7 },
                          { label: 8, value: 8 },
                          { label: 9, value: 9 },
                          { label: 10, value: 10 }
                        ]}
                        clearable
                        searchable
                        placeholder="select a value or enter your own"
                        value={this.state.timeValue}
                        onChange={this.updateTimeValue}
                      />
                      <FormText color="muted">
                        (How much time should the candidate have to answer the
                        question?)
                      </FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Type</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                        options={[
                          {
                            label: "Multiple Choice",
                            value: "Multiple Choice"
                          },
                          { label: "Fill In Blank", value: "Fill In Blank" },
                          { label: "Module", value: "Module" }
                        ]}
                        placeholder="select the question type"
                        value={this.state.typeValue}
                        onChange={this.updateTypeValue}
                      />
                      <FormText color="muted">
                        (Module type questions require an Enterprise
                        subscription.
                        <br />To add Module type questions, please click{" "}
                        <a href="#">here</a>)
                      </FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Difficulty</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                        options={[
                          { label: "Easy", value: "Easy" },
                          { label: "Medium", value: "Medium" },
                          { label: "Difficult", value: "Difficult" }
                        ]}
                        placeholder="select question difficulty"
                        value={this.state.difficultyValue}
                        onChange={this.updateDifficultyValue}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Skills Tested</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                        options={[
                          { label: "Finance", value: "Finance" },
                          { label: "Accounting", value: "Accounting" },
                          { label: "BookKeeping", value: "BookKeeping" },
                          { label: "CPA", value: "CPA" },
                          { label: "CFA", value: "CFA" }
                        ]}
                        placeholder="Select skills to tested"
                        value={this.state.skillValue}
                        onChange={this.updateSkillValue}
                        multi
                      />
                      <FormText color="muted">
                        (Search for question 'tags'. Select up to three)
                      </FormText>
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
