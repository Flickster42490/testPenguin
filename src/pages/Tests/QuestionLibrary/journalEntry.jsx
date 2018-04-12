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
    id: "1",
    subtitle: "To record payment of the interest accrued since June 30, 2019",
    rows: [
      {
        id: "1",
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
        id: "2",
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
    id: "2",
    subtitle:
      "To record retirement of the bonds, per the terms of the bond indenture",
    rows: [
      {
        id: "1",
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
        id: "2",
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
        id: "3",
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
        id: "4",
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

    this.state = {
      journalEntry: []
    };
  }

  componentWillMount() {
    this.updateFormat(Entries);
  }

  updateFormat(data) {
    this.setState({
      journalEntry: data.map(segment => {
        return {
          id: segment.id,
          rows: segment.rows.map(row => {
            return {
              id: row.id,
              date: row.date || undefined,
              account: undefined,
              debit: row.debit || undefined,
              credit: row.credit || undefined
            };
          })
        };
      })
    });
  }

  updateCalendar(segment, row, date) {
    let segmentIndex = segment.id - 1;
    let rowIndex = row.id - 1;
    this.state.journalEntry[segmentIndex].rows[rowIndex].date = date;
    this.forceUpdate();
  }

  updateAnswer(segment, row, attribute) {}

  constructEntryRow(segment, row) {
    let segmentIndex = segment.id - 1;
    let rowIndex = row.id - 1;
    return (
      <FormGroup row key={row.id}>
        <Col sm={4}>
          <DatePicker
            value={this.state.journalEntry[segmentIndex].rows[rowIndex].date}
            onChange={date => this.updateCalendar(segment, row, date)}
          />
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
    console.log(this.state);
    return Entries.map(segment => {
      return (
        <div key={segment.id}>
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
          {segment.rows.map(i => this.constructEntryRow(segment, i))}
        </div>
      );
    });
  }

  render() {
    return <Form>{this.constructSegments()}</Form>;
  }
}
