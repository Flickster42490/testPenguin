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

const mockData = [
  {
    questionName: "A/P Clerk",
    estimatedTime: 3,
    type: "Journal Entry",
    difficulty: "Easy",
    categories: ["Finance"]
  },
  {
    questionName: "Batch Coding",
    estimatedTime: 2,
    type: "Journal Entry",
    difficulty: "Medium",
    categories: ["Accounting"]
  },
  {
    questionName: "ChargeBacks",
    estimatedTime: 5,
    type: "Multiple Choice",
    difficulty: "Hard",
    categories: ["CPA"]
  }
];

export default class QuestionLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      typeCount: {}
    };

    this.findTypeCount = this.findTypeCount.bind(this);
  }

  componentWillMount() {
    axios.get("/questions").then(d => {
      let typeCount = this.findTypeCount(d.data);
      this.setState({ typeCount: typeCount, questions: d.data });
    });
  }

  findTypeCount(questions) {
    return _.reduce(
      questions,
      (sum, q) => {
        console.log(sum);
        if (q.type === "module") sum.module++;
        if (q.type === "mc") sum.mc++;
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
                      <div style={{ fontSize: "1rem" }}>
                        <strong>{cell.value}</strong>
                      </div>
                    </div>
                  )
                },
                {
                  Header: "Question Type",
                  Cell: cell => (
                    <span>
                      {utils.toUpper(utils.addSpace(cell.original.type))}{" "}
                      {utils.toUpper(utils.addSpace(cell.original.type))
                        ? `(${utils.toUpper(
                            utils.addSpace(cell.original.module_type)
                          )})`
                        : ""}
                    </span>
                  )
                },
                {
                  Header: "Estimated Time",
                  accessor: "estimated_time",
                  Cell: cell => <span>{cell.original.estimated_time} mins</span>
                },
                {
                  Header: "Difficulty",
                  accessor: "difficulty",
                  Cell: cell => (
                    <span>{utils.toUpper(cell.original.difficulty)}</span>
                  )
                },
                {
                  Header: "Category",
                  accessor: "tags"
                },
                // {
                //   Header: "Details",
                //   Cell: cell => {
                //     return (
                //       <div>
                //         <div>
                //           <strong>Type: </strong>
                //           {cell.original.type} mins
                //           {/* will want to use moment duration fomrat */}
                //         </div>
                //         <div>
                //           <strong>Estimated Time: </strong>
                //           {cell.original.estimatedTime} mins
                //           {/* will want to use moment duration fomrat */}
                //         </div>
                //         <div>
                //           <strong>Difficulty: </strong>
                //           {cell.original.difficulty}
                //         </div>
                //         <div>
                //           <strong>Will Test Candidates in : </strong>
                //           {cell.original.categories.map((i, idx) => {
                //             if (idx === 0) return <span>{i}</span>;
                //             else return <span>, {i}</span>;
                //           })}
                //         </div>
                //       </div>
                //     );
                //   }
                // },
                {
                  Header: "Actions",
                  maxWidth: 300,
                  Cell: cell => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <ButtonGroup size="sm" vertical>
                        <Button size="sm" color="primary">
                          <a
                            href={`/#/dashboard/tests/questionLibrary/preview?q=${
                              cell.original.id
                            }`}
                          >
                            Preview Question
                          </a>
                        </Button>
                      </ButtonGroup>
                    </div>
                  )
                }
              ]}
              defaultPageSize={5}
              className="-striped -highlight"
            />
          </Col>
        </Row>
      </div>
    );
  }
}
