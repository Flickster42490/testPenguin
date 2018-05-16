import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Progress
} from "reactstrap";
import _ from "lodash";
import axios from "axios";
import ReactTable from "react-table";
import "react-table/react-table.css";

import utils from "../../../utils";
import { Preloader } from "../../../components/Preloader.jsx";

export default class QuestionLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      typeCount: {},
      addQuestions: false
    };

    this.findTypeCount = this.findTypeCount.bind(this);
  }

  componentWillMount() {
    axios.get("/questions").then(d => {
      let typeCount = this.findTypeCount(d.data);
      this.setState({
        typeCount: typeCount,
        questions: d.data,
        addQuestions: this.props.addQuestions
      });
    });
  }

  handleAddQuestion(q) {
    let updatedQuestions = _.filter(this.state.questions, i => i.id !== q.id);
    let typeCount = this.findTypeCount(updatedQuestions);
    this.setState(
      {
        typeCount: typeCount,
        questions: updatedQuestions
      },
      () => {
        this.props.handleAddQuestion(q, updatedQuestions);
      }
    );
  }

  findTypeCount(questions) {
    return _.reduce(
      questions,
      (sum, q) => {
        if (q.type === "module") sum.module++;
        if (q.type === "multiple_choice") sum.mc++;
        sum.total++;
        return sum;
      },
      { mc: 0, module: 0, total: 0 }
    );
  }

  render() {
    const { questions, typeCount } = this.state;
    return (
      <div>
        <Preloader loading={questions.length < 1}>
          <Row style={{ textAlign: "center" }}>
            <Col xs="12">
              <ButtonGroup size="lg" block>
                <Button outline color="default">
                  All Question Types ({typeCount.total})
                </Button>
                <Button outline color="default">
                  Multiple Choice ({typeCount.mc})
                </Button>
                <Button outline color="default">
                  Module ({typeCount.module})
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs="12">
              <ReactTable
                style={{ backgroundColor: "white" }}
                data={questions}
                sortable={false}
                columns={[
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
                    Cell: cell => (
                      <span>{cell.original.estimated_time} mins</span>
                    )
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
                        <div>
                          {tags.map((i, idx, arr) => {
                            if (idx === arr.length - 1) {
                              return <span>{i}</span>;
                            }
                            return (
                              <span>
                                {i}
                                <br />
                              </span>
                            );
                          })}
                        </div>
                      ) : null;
                    }
                  },
                  {
                    Header: "Actions",
                    maxWidth: 150,
                    Cell: cell => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {!this.state.addQuestions && (
                          <ButtonGroup size="sm" vertical>
                            <Button size="sm" color="primary">
                              <a
                                href={`/#/dashboard/tests/questionLibrary/preview?id=${
                                  cell.original.id
                                }`}
                              >
                                Preview Question
                              </a>
                            </Button>
                          </ButtonGroup>
                        )}
                        {this.state.addQuestions && (
                          <ButtonGroup size="sm" vertical>
                            <Button
                              size="sm"
                              color="primary"
                              onClick={() =>
                                this.handleAddQuestion(cell.original)
                              }
                            >
                              Add Question
                            </Button>
                          </ButtonGroup>
                        )}
                      </div>
                    )
                  }
                ]}
                defaultPageSize={5}
                className="-striped -highlight"
              />
            </Col>
          </Row>
        </Preloader>
      </div>
    );
  }
}
