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
import PreviewMultipleChoice from "./previewMultipleChoice.jsx";
import PDF from "react-pdf-js";

export default class Preview extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div>
        {/* <PreviewMultipleChoice /> */}
        <Card>
          <Container style={{ marginTop: "10px" }}>
            <Row>
              <Col md="5">
                <div>
                  <Card>
                    <CardHeader>
                      <strong>Part 1:</strong>
                    </CardHeader>
                    <CardBody>
                      <p>
                        Prepare the month-end bank reconciliation on the right,
                        using only the information presented below.
                      </p>
                      <p>
                        Note: Place a '-' sign in front of the amount when
                        inputting deductions.
                      </p>
                    </CardBody>
                  </Card>
                  <Card>
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
              <Col md="7">
                <Form>
                  <FormGroup row>
                    <Label sm={5}>
                      Ending Balance per Bank Statement <br />Add/(Deduct)
                    </Label>
                    <Label sm={2} />
                    <Label sm={5}>$117,888.95</Label>
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={5}>
                      <Input type="select" name="select" id="exampleSelect">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Input>
                    </Col>
                    <Col sm={2} />
                    <Col sm={5}>
                      <Input type="text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={5}>
                      <Input type="select" name="select" id="exampleSelect">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Input>
                    </Col>
                    <Col sm={2} />
                    <Col sm={5}>
                      <Input type="text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={5}>Correct Cash Balance</Label>
                    <Label sm={2} />
                    <Label sm={5}>$xxxxxx</Label>
                  </FormGroup>
                </Form>

                <Form>
                  <FormGroup row>
                    <Label sm={5}>
                      Ending Balance per Company Records <br />Add/(Deduct)
                    </Label>{" "}
                    <Label sm={2} />
                    <Label sm={5}>$91,743.22</Label>
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={5}>
                      <Input type="select" name="select" id="exampleSelect">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Input>
                    </Col>
                    <Col sm={2} />
                    <Col sm={5}>
                      <Input type="text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={5}>
                      <Input type="select" name="select" id="exampleSelect">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Input>
                    </Col>
                    <Col sm={2} />
                    <Col sm={5}>
                      <Input type="text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={5}>
                      <Input type="select" name="select" id="exampleSelect">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Input>
                    </Col>
                    <Col sm={2} />
                    <Col sm={5}>
                      <Input type="text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={5}>
                      <Input type="select" name="select" id="exampleSelect">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Input>
                    </Col>
                    <Col sm={2} />
                    <Col sm={5}>
                      <Input type="text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={5}>Correct Cash Balance</Label>
                    <Label sm={2} />
                    <Label sm={5}>$xxxxxx</Label>
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
