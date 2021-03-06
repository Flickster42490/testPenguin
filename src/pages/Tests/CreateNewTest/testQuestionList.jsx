import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Badge,
  ButtonGroup,
  ButtonToolbar,
  Progress
} from "reactstrap";
import _ from "lodash";
import axios from "axios";
import ReactTable from "react-table";
import "react-table/react-table.css";
import arrayMove from "array-move";

import utils from "../../../utils";
import { Preloader } from "../../../components/Preloader.jsx";

export default class TestQuestionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: props.questions || [],
      addQuestions: false
    };
  }

  componentWillReceiveProps(props) {
    if (props.questions) this.setState({ questions: props.questions });
  }

  handleOneUp(q) {
    let { questions } = this.state;
    let qIdx = undefined;
    questions.forEach((i, idx) => {
      if (i.id === q.id) qIdx = idx;
    });
    let newQIdx = qIdx - 1;
    if (qIdx !== 0) {
      this.setState(
        {
          questions: arrayMove(questions, qIdx, newQIdx)
        },
        () => {
          this.props.handleUpdateOrder(arrayMove(questions, qIdx, newQIdx));
        }
      );
    }
    return;
  }

  handleOneDown(q) {
    let { questions } = this.state;
    let qIdx = undefined;
    questions.forEach((i, idx) => {
      if (i.id === q.id) qIdx = idx;
    });
    let newQIdx = qIdx + 1;
    if (qIdx !== questions.length - 1) {
      this.setState(
        {
          questions: arrayMove(questions, qIdx, newQIdx)
        },
        () => {
          this.props.handleUpdateOrder(arrayMove(questions, qIdx, newQIdx));
        }
      );
    }
    return;
  }

  removeItem(cell) {
    let index = _.findIndex(this.state.questions, { id: cell.id });
    let newQuestionList = this.state.questions;
    newQuestionList.splice(index, 1);
    this.setState({
      questions: newQuestionList
    });
  }

  render() {
    const { questions } = this.state;
    return (
      <div>
        <br />
        <Row>
          <Col xs="12">
            <ReactTable
              style={{ backgroundColor: "white" }}
              data={questions}
              sortable={false}
              columns={[
                {
                  Header: "Order",
                  maxWidth: 50,
                  show: this.props.hideOrdering ? false : true,
                  Cell: cell => (
                    <div>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => this.handleOneUp(cell.original)}
                      >
                        &#9650;
                      </span>&nbsp;&nbsp;
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => this.handleOneDown(cell.original)}
                      >
                        &#9660;
                      </span>
                    </div>
                  )
                },
                {
                  Header: "#",
                  maxWidth: 75,
                  Cell: cell => {
                    return (
                      <span>
                        {_.findIndex(questions, {
                          id: cell.original.id
                        }) + 1}
                      </span>
                    );
                  }
                },
                {
                  Header: "Question Name",
                  accessor: "name",
                  Cell: cell => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <div style={{ fontSize: "1rem" }} title={cell.value}>
                        <strong>{cell.value}</strong>
                      </div>
                    </div>
                  )
                },
                {
                  Header: "Question Type",
                  maxWidth: 200,
                  Cell: cell => (
                    <span>
                      {utils.toUpper(utils.addSpace(cell.original.type))}{" "}
                      {utils.toUpper(utils.addSpace(cell.original.type)) ===
                      "Module"
                        ? `(${utils.toUpper(
                            utils.addSpace(cell.original.module_type)
                          )})`
                        : ""}
                    </span>
                  )
                },
                {
                  Header: "Est. Time",
                  accessor: "estimated_time",
                  maxWidth: 100,
                  Cell: cell => <span>{cell.original.estimated_time} mins</span>
                },
                {
                  Header: "Difficulty",
                  accessor: "difficulty",
                  maxWidth: 100,
                  Cell: cell => (
                    <span>{utils.toUpper(cell.original.difficulty)}</span>
                  )
                },
                {
                  Header: "Categories",
                  accessor: "tags",
                  Cell: cell => {
                    let tags = cell.value && cell.value.split(",");
                    return tags && tags.length > 0 ? (
                      <span
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "start"
                        }}
                      >
                        {tags.map(i => {
                          return (
                            <span>
                              <Badge color="light" pill>
                                {i}
                              </Badge>&nbsp;
                            </span>
                          );
                        })}
                      </span>
                    ) : null;
                  }
                },
                {
                  Header: "Remove",
                  maxWidth: 100,
                  show: this.props.removeQuestion ? true : false,
                  Cell: cell => (
                    <span
                      onClick={() => this.removeItem(cell.original)}
                      style={{ cursor: "pointer" }}
                    >
                      <i class="fa fa-trash" aria-hidden="true" />
                    </span>
                  )
                }
              ]}
              defaultPageSize={5}
              showPageSizeOptions={false}
              className="-striped -highlight"
            />
          </Col>
        </Row>
      </div>
    );
  }
}
