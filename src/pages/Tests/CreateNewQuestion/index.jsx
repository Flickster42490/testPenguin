import React, { Component } from "react";
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

export default class CreateNewQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeValue: ""
    };
  }

  componentWillMount() {
    console.log(queryString.parse());
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
                      <Input
                        type="text"
                        id="text-input"
                        name="text-input"
                        placeholder="Text"
                      />
                      <FormText color="muted">This is a help text</FormText>
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
                        options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                        clearable
                        searchable
                        placeholder="select a value or enter your own"
                        value={this.state.timeValue}
                        onChange={this.updateTimeValue}
                        simpleValue
                      />
                      <span>
                        (How much time should the candidate have to answer the
                        question?)
                      </span>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Type</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                        options={["Multiple Choice", "Fill In Blank", "Module"]}
                        placeholder="select the question type"
                        value={this.state.typeValue}
                        onChange={this.updateTypeValue}
                        simpleValue
                      />
                      <span>
                        (Module type questions require an Enterprise
                        subscription.
                        <br />To add Module type questions, please click{" "}
                        <a href="#">here</a>)
                      </span>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Difficulty</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                        options={["Easy", "Medium", "Difficult"]}
                        placeholder="select question difficulty"
                        value={this.state.timeValue}
                        onChange={this.updateTimeValue}
                        simpleValue
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="email-input">Email Input</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="email"
                        id="email-input"
                        name="email-input"
                        placeholder="Enter Email"
                      />
                      <FormText className="help-block">
                        Please enter your email
                      </FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="password-input">Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="password"
                        id="password-input"
                        name="password-input"
                        placeholder="Password"
                      />
                      <FormText className="help-block">
                        Please enter a complex password
                      </FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="disabled-input">Disabled Input</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        id="disabled-input"
                        name="disabled-input"
                        placeholder="Disabled"
                        disabled
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select">Select</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="select" id="select">
                        <option value="0">Please select</option>
                        <option value="1">Option #1</option>
                        <option value="2">Option #2</option>
                        <option value="3">Option #3</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="selectLg">Select Large</Label>
                    </Col>
                    <Col xs="12" md="9" size="lg">
                      <Input
                        type="select"
                        name="selectLg"
                        id="selectLg"
                        bsSize="lg"
                      >
                        <option value="0">Please select</option>
                        <option value="1">Option #1</option>
                        <option value="2">Option #2</option>
                        <option value="3">Option #3</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="selectSm">Select Small</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="select"
                        name="selectSm"
                        id="SelectLm"
                        bsSize="sm"
                      >
                        <option value="0">Please select</option>
                        <option value="1">Option #1</option>
                        <option value="2">Option #2</option>
                        <option value="3">Option #3</option>
                        <option value="4">Option #4</option>
                        <option value="5">Option #5</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="disabledSelect">Disabled Select</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="select"
                        name="disabledSelect"
                        id="disabledSelect"
                        disabled
                      >
                        <option value="0">Please select</option>
                        <option value="1">Option #1</option>
                        <option value="2">Option #2</option>
                        <option value="3">Option #3</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="multiple-select">Multiple select</Label>
                    </Col>
                    <Col md="9">
                      <Input
                        type="select"
                        name="multiple-select"
                        id="multiple-select"
                        multiple
                      >
                        <option value="1">Option #1</option>
                        <option value="2">Option #2</option>
                        <option value="3">Option #3</option>
                        <option value="4">Option #4</option>
                        <option value="5">Option #5</option>
                        <option value="6">Option #6</option>
                        <option value="7">Option #7</option>
                        <option value="8">Option #8</option>
                        <option value="9">Option #9</option>
                        <option value="10">Option #10</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Radios</Label>
                    </Col>
                    <Col md="9">
                      <FormGroup check className="radio">
                        <Input
                          className="form-check-input"
                          type="radio"
                          id="radio1"
                          name="radios"
                          value="option1"
                        />
                        <Label
                          check
                          className="form-check-label"
                          htmlFor="radio1"
                        >
                          Option 1
                        </Label>
                      </FormGroup>
                      <FormGroup check className="radio">
                        <Input
                          className="form-check-input"
                          type="radio"
                          id="radio2"
                          name="radios"
                          value="option2"
                        />
                        <Label
                          check
                          className="form-check-label"
                          htmlFor="radio2"
                        >
                          Option 2
                        </Label>
                      </FormGroup>
                      <FormGroup check className="radio">
                        <Input
                          className="form-check-input"
                          type="radio"
                          id="radio3"
                          name="radios"
                          value="option3"
                        />
                        <Label
                          check
                          className="form-check-label"
                          htmlFor="radio3"
                        >
                          Option 3
                        </Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Inline Radios</Label>
                    </Col>
                    <Col md="9">
                      <FormGroup check inline>
                        <Input
                          className="form-check-input"
                          type="radio"
                          id="inline-radio1"
                          name="inline-radios"
                          value="option1"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="inline-radio1"
                        >
                          One
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input
                          className="form-check-input"
                          type="radio"
                          id="inline-radio2"
                          name="inline-radios"
                          value="option2"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="inline-radio2"
                        >
                          Two
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input
                          className="form-check-input"
                          type="radio"
                          id="inline-radio3"
                          name="inline-radios"
                          value="option3"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="inline-radio3"
                        >
                          Three
                        </Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Checkboxes</Label>
                    </Col>
                    <Col md="9">
                      <FormGroup check className="checkbox">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          id="checkbox1"
                          name="checkbox1"
                          value="option1"
                        />
                        <Label
                          check
                          className="form-check-label"
                          htmlFor="checkbox1"
                        >
                          Option 1
                        </Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          id="checkbox2"
                          name="checkbox2"
                          value="option2"
                        />
                        <Label
                          check
                          className="form-check-label"
                          htmlFor="checkbox2"
                        >
                          Option 2
                        </Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          id="checkbox3"
                          name="checkbox3"
                          value="option3"
                        />
                        <Label
                          check
                          className="form-check-label"
                          htmlFor="checkbox3"
                        >
                          Option 3
                        </Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Inline Checkboxes</Label>
                    </Col>
                    <Col md="9">
                      <FormGroup check inline>
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          id="inline-checkbox1"
                          name="inline-checkbox1"
                          value="option1"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="inline-checkbox1"
                        >
                          One
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          id="inline-checkbox2"
                          name="inline-checkbox2"
                          value="option2"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="inline-checkbox2"
                        >
                          Two
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          id="inline-checkbox3"
                          name="inline-checkbox3"
                          value="option3"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="inline-checkbox3"
                        >
                          Three
                        </Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">File input</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" id="file-input" name="file-input" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-multiple-input">
                        Multiple File input
                      </Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="file"
                        id="file-multiple-input"
                        name="file-multiple-input"
                        multiple
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row hidden>
                    <Col md="3">
                      <Label
                        className="custom-file"
                        htmlFor="custom-file-input"
                      >
                        Custom file input
                      </Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Label className="custom-file">
                        <Input
                          className="custom-file"
                          type="file"
                          id="custom-file-input"
                          name="file-input"
                        />
                        <span className="custom-file-control" />
                      </Label>
                    </Col>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    );
  }
}
