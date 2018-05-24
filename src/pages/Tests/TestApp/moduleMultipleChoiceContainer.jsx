import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Progress
} from "reactstrap";
import queryString from "querystring";
import _ from "lodash";
import FontAwesome from "react-fontawesome";
import MultipleChoice from "./multipleChoiceBody.jsx";

export default class ModuleMultipleChoiceContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question: props.question,
      questionAnswered: props.questionAnswered,
      disabled: props.disabled,
      review: props.review
    };

    this.handleMultipleChoiceUpdate = this.handleMultipleChoiceUpdate.bind(
      this
    );
  }

  handleMultipleChoiceUpdate(id, value) {
    console.log(this.state.questionAnswered, id, value);
    let segmentIdx;
    this.state.questionAnswered.module_candidate_answer.segments.forEach(
      (i, idx) => {
        if (i.id === id) segmentIdx = idx;
      }
    );
    let segmentsCopy = Object.assign(
      {},
      this.state.questionAnswered.module_candidate_answer.segments
    );
    segmentsCopy[segmentIdx].mc_candidate_answer = value.id;
    segmentsCopy = Object.values(segmentsCopy);
    console.log(Object.values(segmentsCopy));
    // this.props.handleSubModuleOneUpdate(segmentsCopy);
  }

  render() {
    let { question, questionAnswered, disabled, review } = this.state;
    return (
      <div>
        {question.module_answer.segments.map(i => {
          let q = Object.assign({}, question, {
            mc_answer: i.mc_answer,
            mc_stem: i.mc_stem,
            mc_choices: i.mc_choices,
            mc_segment_id: i.id
          });
          return (
            <MultipleChoice
              question={q}
              questionAnswered={questionAnswered}
              handleMultipleChoiceUpdate={this.handleMultipleChoiceUpdate}
              disabled={this.state.disabled}
              review={this.state.review}
              module
            />
          );
        })}
      </div>
    );
  }
}
