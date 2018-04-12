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
import Select from "react-select";
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

  updateAccount(currentRow, value) {
    currentRow.account = value;
    this.forceUpdate();
  }

  updateCalendar(currentRow, date) {
    currentRow.date = date;
    this.forceUpdate();
  }

  updateDebit(currentRow, event) {
    currentRow.debit = event.target.value;
    this.forceUpdate();
  }

  updateCredit(currentRow, event) {
    currentRow.credit = event.target.value;
    this.forceUpdate();
  }

  constructEntryRow(segment, row) {
    let segmentIndex = segment.id - 1;
    let rowIndex = row.id - 1;
    let currentRow = this.state.journalEntry[segmentIndex].rows[rowIndex];
    return (
      <FormGroup row key={row.id}>
        <Col sm={4}>
          <DatePicker
            value={currentRow.date}
            onChange={date => this.updateCalendar(currentRow, date)}
          />
        </Col>
        <Col sm={4}>
          <Select
            className="journal-entry-select"
            options={Entries[segmentIndex].rows[rowIndex].account.map(i => {
              return { value: i, label: i };
            })}
            searchable
            simpleValue
            value={currentRow.account}
            onChange={value => this.updateAccount(currentRow, value)}
          />
        </Col>
        <Col sm={2}>
          <Input
            type="text"
            onBlur={value => this.updateDebit(currentRow, value)}
          />
        </Col>
        <Col sm={2}>
          <Input
            type="text"
            onBlur={value => this.updateCredit(currentRow, value)}
          />
        </Col>
      </FormGroup>
    );
  }

  constructSegments() {
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
              <span className="muted-header">Date</span>
            </Col>
            <Col sm={4} style={{ textAlign: "center" }}>
              <span className="muted-header">Account</span>
            </Col>
            <Col sm={2} style={{ textAlign: "center" }}>
              <span className="muted-header">Debit ($)</span>
            </Col>
            <Col sm={2} style={{ textAlign: "center" }}>
              <span className="muted-header">Credit ($)</span>
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
