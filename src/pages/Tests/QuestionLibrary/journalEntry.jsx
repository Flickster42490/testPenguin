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
import DatePicker from "../../../components/DatePicker/dist/react-datepicker";
import moment from "moment";
import "../../../components/DatePicker/dist/react-datepicker.css";
import Select from "react-select";

import utils from "../../../utils";

export default class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      journalEntry: [],
      disabled: true
    };

    this.constructEntryRow = this.constructEntryRow.bind(this);
    this.constructSegments = this.constructSegments.bind(this);
  }

  // componentWillMount() {
  //   this.updateFormat(journalEntry);
  // }

  componentWillReceiveProps(props) {
    if (props.question) {
      this.setState({
        journalEntry: props.question.module_answer.segments
      });
    }
  }

  // updateFormat(data) {
  //   this.setState({
  //     journalEntry: data.map(segment => {
  //       return {
  //         id: segment.id,
  //         rows: segment.rows.map(row => {
  //           return {
  //             id: row.id,
  //             date: row.date || undefined,
  //             account: undefined,
  //             debit: row.debit || undefined,
  //             credit: row.credit || undefined
  //           };
  //         })
  //       };
  //     })
  //   });
  // }

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
    let { journalEntry } = this.state;
    let segmentIndex = segment.id - 1;
    let rowIndex = row.id - 1;
    let currentRow = journalEntry[segmentIndex].rows[rowIndex];
    return (
      <FormGroup row key={row.id}>
        <Col sm={4}>
          <DatePicker
            selected={moment(currentRow.date)}
            onChange={date => this.updateCalendar(currentRow, date)}
            disabled={this.state.disabled}
          />
        </Col>
        <Col sm={4}>
          <Select
            className="journal-entry-select"
            options={
              Array.isArray(currentRow.account)
                ? currentRow.account.map(i => {
                    return { value: i, label: i };
                  })
                : [{ value: currentRow.account, label: currentRow.account }]
            }
            disabled={this.state.disabled}
            searchable
            simpleValue
            value={currentRow.account}
            onChange={value => this.updateAccount(currentRow, value)}
          />
        </Col>
        <Col sm={2}>
          <Input
            type="text"
            readOnly={this.state.disabled}
            value={currentRow.debit}
            onBlur={value => this.updateDebit(currentRow, value)}
          />
        </Col>
        <Col sm={2}>
          <Input
            type="text"
            value={currentRow.credit}
            readOnly={this.state.disabled}
            onBlur={value => this.updateCredit(currentRow, value)}
          />
        </Col>
      </FormGroup>
    );
  }

  constructSegments() {
    return this.state.journalEntry.map(segment => {
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
