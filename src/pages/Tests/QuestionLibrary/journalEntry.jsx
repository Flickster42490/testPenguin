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
import DatePicker from "react-date-picker";
import PDF from "react-pdf-js";
const Entries = [
  {
    subtitle: "To record payment of the interest accrued since June 30, 2019",
    rows: [
      {
        date: undefined,
        account: [
          "Interest Expense",
          "Cash",
          "Bonds Payable",
          "Loss on Bond Retirement"
        ],
        debit: undefined,
        credit: undefined
      },
      {
        date: undefined,
        account: [
          "Interest Expense",
          "Cash",
          "Bonds Payable",
          "Loss on Bond Retirement"
        ],
        debit: undefined,
        credit: undefined
      }
    ]
  },
  {
    subtitle:
      "To record retirement of the bonds, per the terms of the bond indenture",
    rows: [
      {
        date: undefined,
        account: [
          "Interest Expense",
          "Cash",
          "Bonds Payable",
          "Loss on Bond Retirement"
        ],
        debit: undefined,
        credit: undefined
      },
      {
        date: undefined,
        account: [
          "Interest Expense",
          "Cash",
          "Bonds Payable",
          "Loss on Bond Retirement"
        ],
        debit: undefined,
        credit: undefined
      },
      {
        date: undefined,
        account: [
          "Interest Expense",
          "Cash",
          "Bonds Payable",
          "Loss on Bond Retirement"
        ],
        debit: undefined,
        credit: undefined
      },
      {
        date: undefined,
        account: [
          "Interest Expense",
          "Cash",
          "Bonds Payable",
          "Loss on Bond Retirement"
        ],
        debit: undefined,
        credit: undefined
      }
    ]
  }
];
export default class Preview extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  constructEntryRow(row) {
    return (
      <FormGroup row>
        <Col sm={4}>
          <DatePicker value={row.date} />
        </Col>
        <Col sm={4}>
          <Input type="select" name="select" id="exampleSelect">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Input>
        </Col>
        <Col sm={2}>
          <Input type="text" />
        </Col>
        <Col sm={2}>
          <Input type="text" />
        </Col>
      </FormGroup>
    );
  }

  constructSegments() {
    return Entries.map(segment => {
      return (
        <div>
          <FormGroup row>
            <Label sm={12}>
              <strong>Journal Entry: </strong> {segment.subtitle}
            </Label>
          </FormGroup>
          <FormGroup row sm={12}>
            <Col sm={4} style={{ textAlign: "center" }}>
              <strong>Date</strong>
            </Col>
            <Col sm={4} style={{ textAlign: "center" }}>
              <strong>Account</strong>
            </Col>
            <Col sm={2} style={{ textAlign: "center" }}>
              <strong>Debit</strong>
            </Col>
            <Col sm={2} style={{ textAlign: "center" }}>
              <strong>Credit</strong>
            </Col>
          </FormGroup>
          {segment.rows.map(i => this.constructEntryRow(i))}
        </div>
      );
    });
  }

  render() {
    return <Form>{this.constructSegments()}</Form>;
  }
}
