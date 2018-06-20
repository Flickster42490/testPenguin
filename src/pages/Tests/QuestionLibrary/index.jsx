import React, { Component } from "react";
import { Container, Row, Col, Button, ButtonGroup, Badge } from "reactstrap";
import _ from "lodash";
import axios from "axios";
import ReactTable from "react-table";
import "react-table/react-table.css";
import localForage from "localforage";
import FontAwesome from "react-fontawesome";

import utils from "../../../utils";
import { Preloader } from "../../../components/Preloader.jsx";

export default class QuestionLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      typeCount: {},
      addQuestions: false,
      loading: true,
      userId: undefined
    };

    this.findTypeCount = this.findTypeCount.bind(this);
  }

  componentWillMount() {
    let userId;
    localForage.getItem("userId").then(id => {
      userId = id;
      axios.get(`users/${id}`).then(u => {
        if (u.data[0].trial && u.data[0].trial_expired) {
          window.location.href = "/#/dashboard/profile?trialError=true";
        }
        axios.post("/questions", { userId: userId }).then(d => {
          let typeCount = this.findTypeCount(d.data);
          this.setState(
            {
              userId: userId,
              typeCount: typeCount,
              questions: d.data,
              addQuestions: this.props.addQuestions,
              loading: false
            },
            () => {
              let page = window.location.hash.split("tests/")[1];
              if (page == "questionLibrary") {
                this.props.handlePageUpdate(page);
              }
            }
          );
        });
      });
    });
  }

  componentWillReceiveProps(np) {
    if (np.filters && Object.keys(np.filters).length > 0) {
      axios
        .post("/questions", { filters: np.filters, userId: this.state.userId })
        .then(d => {
          let typeCount = this.findTypeCount(d.data);
          this.setState({
            typeCount: typeCount,
            questions: d.data,
            addQuestions: this.props.addQuestions,
            loading: false
          });
        });
    }
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
    const { questions, typeCount, loading } = this.state;
    console.log(questions);
    return (
      <div>
        {!this.props.addQuestions && (
          <div className="page-header">
            <h2 style={{ display: "inline" }}>&nbsp;QUESTION LIBRARY</h2>&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        )}
        <Preloader loading={loading}>
          <Row>
            <Col xs="12">
              <ReactTable
                style={{ backgroundColor: "white", textOverflow: "ellipsis" }}
                data={questions}
                noDataText={`No Questions Matched Your Criteria. Please Try Again.`}
                columns={[
                  {
                    Header: "Question Name",
                    accessor: "name",
                    style: {
                      fontSize: "1rem",
                      textAlign: "left",
                      paddingLeft: "10px"
                    },
                    sortable: true,
                    Cell: cell => (
                      <span>
                        <a
                          href={`/#/dashboard/tests/questionLibrary/preview?id=${
                            cell.original.id
                          }`}
                        >
                          <strong>{cell.value}</strong> -{" "}
                          <span className="muted-text">
                            {cell.original.subname}
                          </span>
                        </a>{" "}
                      </span>
                    )
                  },
                  {
                    Header: "Question Type",
                    accessor: "module_type",
                    sortable: true,
                    maxWidth: 180,
                    Cell: cell => (
                      <span>
                        {utils.toUpper(utils.addSpace(cell.original.type)) ===
                        "Module"
                          ? `${utils.toUpper(
                              utils.addSpace(cell.original.module_type)
                            )} `
                          : ""}
                        {utils.toUpper(utils.addSpace(cell.original.type)) ===
                        "Module"
                          ? `(${utils.toUpper(
                              utils.addSpace(cell.original.type)
                            )})`
                          : utils.toUpper(
                              utils.addSpace(cell.original.type)
                            )}{" "}
                      </span>
                    )
                  },
                  {
                    Header: "Est. Time",
                    accessor: "estimated_time",
                    maxWidth: 125,
                    sortMethod: (a, b) => {
                      return a - b;
                    },
                    Cell: cell => (
                      <span>{cell.original.estimated_time} mins</span>
                    )
                  },
                  {
                    Header: "Difficulty",
                    accessor: "difficulty",
                    maxWidth: 125,
                    Cell: cell => (
                      <span>{utils.toUpper(cell.original.difficulty)}</span>
                    )
                  },
                  {
                    Header: "Categories",
                    accessor: "tags",
                    sortable: false,
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
                    Header: "Actions",
                    width: 150,
                    sortable: false,
                    Cell: cell => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {!this.state.addQuestions && (
                          <a
                            href={`/#/dashboard/tests/questionLibrary/preview?id=${
                              cell.original.id
                            }`}
                          >
                            <ButtonGroup size="sm" vertical>
                              <Button size="sm" color="primary">
                                Preview Question
                              </Button>
                            </ButtonGroup>
                          </a>
                        )}
                        {this.state.addQuestions && (
                          <ButtonGroup size="sm" vertical>
                            <Button
                              size="sm"
                              color="primary"
                              onClick={() =>
                                this.handleAddQuestion(cell.original)
                              }
                              disabled={this.props.disableAdd}
                            >
                              Add Question
                            </Button>
                            <a
                              href={`/#/dashboard/tests/questionLibrary/preview?id=${
                                cell.original.id
                              }`}
                              target="_blank"
                            >
                              <Button size="sm" color="link">
                                Go To Question
                              </Button>
                            </a>
                          </ButtonGroup>
                        )}
                      </div>
                    )
                  }
                ]}
                defaultSorted={[
                  {
                    id: "name",
                    desc: false
                  }
                ]}
                defaultPageSize={this.state.addQuestions ? 5 : 20}
                showPageSizeOptions={this.state.addQuestions ? false : true}
                pageSizeOptions={[20, 50, 100]}
                className="-striped -highlight"
              />
            </Col>
          </Row>
        </Preloader>
      </div>
    );
  }
}
