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
import _ from "lodash";
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
export default class Reconciliation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reconciliation: [],
      reconciliationFormat: [],
      disabled: props.disabled
    };

    this.constructEntryRow = this.constructEntryRow.bind(this);
    this.constructSegments = this.constructSegments.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.question && props.disabled && !props.review) {
      this.setState(
        {
          reconciliation: deepCopy(props.question.module_answer.segments),
          reconciliationFormat: deepCopy(props.question.module_format.segments)
        },
        () => this.forceUpdate()
      );
    } else if (props.question && props.questionAnswered) {
      let reconciliation = this.initialCalculateSum(
        deepCopy(props.questionAnswered.module_candidate_answer.segments)
      );
      this.setState(
        {
          reconciliation: reconciliation,
          reconciliationFormat: deepCopy(props.question.module_format.segments)
        },
        () => this.forceUpdate()
      );
    } else {
      this.setState(
        {
          reconciliation: deepCopy(props.question.module_answer.segments),
          reconciliationFormat: deepCopy(props.question.module_format.segments)
        },
        () => this.forceUpdate()
      );
    }
  }

  calculateSum(segmentIndex, segmentId, e) {
    let segment = _.find(this.state.reconciliation, { id: segmentId });
    let segmentSum = segment.rows.forEach(i => {
      if (i.sumText && !i.sum) i.sum = Number(e.target.value);
      else if (i.sumText && i.sum)
        i.sum = Number(i.sum) + Number(e.target.value);
    });
    this.props.handleSubModuleOneUpdate(this.state.reconciliation);
  }

  initialCalculateSum(segments) {
    segments.forEach((i, idx) => {
      if (i.rows) {
        let sum = 0;
        let sumId;
        i.rows.forEach(r => {
          if (r.value) sum = sum + Number(r.value);
          if (r.sumText) sumId = r.id;
        });
        let sumRow = _.find(i.rows, { id: sumId });
        sumRow.sum = sum;
      }
    });
    return segments;
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  updateOptions(currentRow, value) {
    currentRow.options = value;
    this.props.handleSubModuleOneUpdate(this.state.reconciliation);
  }

  updateValue(currentRow, event) {
    currentRow.value = Number(event.target.value);
    this.props.handleSubModuleOneUpdate(this.state.reconciliation);
  }

  constructEntryRow(segment, row) {
    let { reconciliation, reconciliationFormat, disabled } = this.state;
    let segmentIndex = segment.id - 1;
    let rowIndex = row.id - 1;
    let currentRow = reconciliation[segmentIndex].rows[rowIndex];
    return (
      <FormGroup row key={row.id}>
        <Col sm={6}>
          {reconciliationFormat[segmentIndex].rows[rowIndex].options && (
            <Select
              className="journal-entry-select"
              options={
                Array.isArray(
                  reconciliationFormat[segmentIndex].rows[rowIndex].options
                )
                  ? reconciliationFormat[segmentIndex].rows[
                      rowIndex
                    ].options.map(i => {
                      return { value: i, label: i };
                    })
                  : [{ value: currentRow.options, label: currentRow.options }]
              }
              disabled={disabled}
              searchable
              simpleValue
              clearable={false}
              value={currentRow.options}
              onChange={value => this.updateOptions(currentRow, value)}
            />
          )}
          {reconciliationFormat[segmentIndex].rows[rowIndex].subtitle && (
            <h6>
              {reconciliationFormat[segmentIndex].rows[rowIndex].subtitle}
            </h6>
          )}
          {reconciliationFormat[segmentIndex].rows[rowIndex].sumText && (
            <h6>{reconciliationFormat[segmentIndex].rows[rowIndex].sumText}</h6>
          )}
        </Col>
        <Col sm={6} className="right-align">
          {reconciliationFormat[segmentIndex].rows[rowIndex].options &&
            reconciliationFormat[segmentIndex].rows[rowIndex].value && (
              <Input
                className="right-align"
                type="text"
                readOnly={disabled}
                defaultValue={currentRow.value}
              />
            )}
          {reconciliationFormat[segmentIndex].rows[rowIndex].options &&
            !reconciliationFormat[segmentIndex].rows[rowIndex].value && (
              <Input
                className="right-align"
                type="text"
                readOnly={disabled}
                value={!currentRow.value ? " " : currentRow.value}
                onChange={value => this.updateValue(currentRow, value)}
                onBlur={value =>
                  this.calculateSum(segmentIndex, segment.id, value)
                }
              />
            )}
          {reconciliationFormat[segmentIndex].rows[rowIndex].sumText && (
            <span style={{ paddingRight: "5px" }}>
              <strong>$&nbsp;{this.numberWithCommas(currentRow.sum)}</strong>
            </span>
          )}
        </Col>
      </FormGroup>
    );
  }

  constructSegments() {
    return this.state.reconciliation.map(segment => {
      return (
        <div key={segment.id}>
          {segment.headers && (
            <FormGroup row className="text-center">
              {segment.headers.map(i => (
                <Label sm={12}>
                  <h5>{i.text}</h5>
                  <br />
                </Label>
              ))}
            </FormGroup>
          )}
          {segment.rows &&
            segment.rows.map(i => this.constructEntryRow(segment, i))}
          <hr />
        </div>
      );
    });
  }

  render() {
    return <Form>{this.constructSegments()}</Form>;
  }
}
