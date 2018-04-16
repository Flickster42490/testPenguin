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
const deepCopy = oldObj => {
  var newObj = oldObj;
  if (oldObj && typeof oldObj === "object") {
    newObj =
      Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
    for (var i in oldObj) {
      newObj[i] = deepCopy(oldObj[i]);
    }
  }
  return newObj;
};
export default class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      journalEntry: [],
      journalEntryFormat: [],
      disabled: props.disabled
    };

    this.constructEntryRow = this.constructEntryRow.bind(this);
    this.constructSegments = this.constructSegments.bind(this);
  }

  // componentWillMount() {
  //   this.updateFormat(journalEntry);
  // }

  componentWillReceiveProps(props) {
    if (props.question && this.state.disabled) {
      this.setState({
        journalEntry: deepCopy(props.question.module_answer.segments),
        journalEntryFormat: deepCopy(props.question.module_format.segments)
      });
    } else if (props.question && props.questionAnswered) {
      console.log(props.questionAnswered.module_candidate_answer.segments);
      this.setState({
        journalEntry: deepCopy(
          props.questionAnswered.module_candidate_answer.segments
        ),
        journalEntryFormat: deepCopy(props.question.module_format.segments)
      });
    } else {
      this.setState({
        journalEntry: deepCopy(props.question.module_candidate_answer.segments),
        journalEntryFormat: deepCopy(props.question.module_format.segments)
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
    this.props.handleSubModuleOneUpdate(this.state.journalEntry);
  }

  updateCalendar(currentRow, date) {
    currentRow.date = date.format("MM/DD/YYYY");
    this.props.handleSubModuleOneUpdate(this.state.journalEntry);
  }

  updateDebit(currentRow, event) {
    currentRow.debit = event.target.value;
    this.props.handleSubModuleOneUpdate(this.state.journalEntry);
  }

  updateCredit(currentRow, event) {
    currentRow.credit = event.target.value;
    this.props.handleSubModuleOneUpdate(this.state.journalEntry);
  }

  constructEntryRow(segment, row) {
    let { journalEntry, journalEntryFormat } = this.state;
    let segmentIndex = segment.id - 1;
    let rowIndex = row.id - 1;
    let currentRow = journalEntry[segmentIndex].rows[rowIndex];
    console.log(currentRow.date);
    return (
      <FormGroup row key={row.id}>
        <Col sm={4}>
          <DatePicker
            selected={moment(currentRow.date || Date.now())}
            onChange={date => this.updateCalendar(currentRow, date)}
            disabled={this.state.disabled}
          />
        </Col>
        <Col sm={4}>
          <Select
            className="journal-entry-select"
            options={
              Array.isArray(
                journalEntryFormat[segmentIndex].rows[rowIndex].account
              )
                ? journalEntryFormat[segmentIndex].rows[rowIndex].account.map(
                    i => {
                      return { value: i, label: i };
                    }
                  )
                : [{ value: currentRow.account, label: currentRow.account }]
            }
            disabled={this.state.disabled}
            searchable
            simpleValue
            clearable={false}
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
