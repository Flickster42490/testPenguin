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

export default class TestQuestionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: props.questions || [],
      addQuestions: false
    };
  }

  componentWillMount() {}

  componentWillReceiveProps(props) {
    if (props.questions) this.setState({ questions: props.questions });
  }

  handleOneUp(q) {
    console.log(q, this.state.questions);
    //need to move it up or down.
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
                  Cell: cell => (
                    <div>
                      <span onClick={() => this.handleOneUp(cell.original)}>
                        up
                      </span>&nbsp;&nbsp;
                      <span onClick={() => this.handleOneDown(cell.original)}>
                        down
                      </span>
                    </div>
                  )
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
                  Header: "Estimated Time",
                  accessor: "estimated_time",
                  Cell: cell => <span>{cell.original.estimated_time} mins</span>
                },
                {
                  Header: "Difficulty",
                  accessor: "difficulty",
                  maxWidth: "100",
                  Cell: cell => (
                    <span>{utils.toUpper(cell.original.difficulty)}</span>
                  )
                },
                {
                  Header: "Category",
                  accessor: "tags"
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
