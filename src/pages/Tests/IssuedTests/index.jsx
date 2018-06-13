import React, { Component } from "react";
import { Row, Col, Button, ButtonGroup } from "reactstrap";
import axios from "axios";
import moment from "moment";
import localForage from "localforage";
import ReactTable from "react-table";
import "react-table/react-table.css";

const typeMap = {
  custom: "Custom",
  pre_built: "Pre-Built"
};

export default class IssuedTests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tests: undefined
    };
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    localForage.getItem("userId").then(id => {
      axios.post("/tests/issued", { userId: id }).then(d => {
        console.log(d);
        this.setState(
          {
            tests: d.data
          },
          () => {
            let page = window.location.hash.split("tests/")[1];
            this.props.handlePageUpdate(page);
          }
        );
      });
    });
  }

  componentWillReceiveProps(np) {
    if (np.filters && Object.keys(np.filters).length > 0) {
      axios.post("/tests/issued", { filters: np.filters }).then(d => {
        this.setState({
          tests: d.data
        });
      });
    }
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h2 style={{ display: "inline" }}>&nbsp;REVIEW ISSUED TESTS</h2>&nbsp;&nbsp;&nbsp;&nbsp;
          <h6 style={{ display: "inline" }}>
            These are the tests you have invited candidates to take
          </h6>
        </div>
        {this.state.tests && (
          <Row>
            <Col xs="12">
              <ReactTable
                style={{ backgroundColor: "white" }}
                data={this.state.tests}
                sortable={false}
                columns={[
                  {
                    Header: "Test Name",
                    accessor: "name",
                    style: {
                      fontSize: "1rem",
                      textAlign: "left",
                      paddingLeft: "20px"
                    },
                    Cell: cell => (
                      <strong>
                        <a
                          href={`/#/dashboard/tests/issuedTests/review?id=${
                            cell.original.test_id
                          }`}
                        >
                          {cell.value}
                        </a>
                      </strong>
                    ),
                    maxWidth: 240
                  },
                  {
                    Header: "Allotted Time",
                    accessor: "estimated_time",
                    maxWidth: 150,
                    Cell: cell => <span>{cell.value} mins</span>
                  },
                  {
                    Header: "Questions",
                    maxWidth: 200,
                    Cell: cell => (
                      <ul style={{ listStyleType: "none" }}>
                        <li>
                          {cell.original.question_types.multiple_choice || "0"}{" "}
                          Multiple Choice
                        </li>
                        <li>
                          {cell.original.question_types.module || "0"} Modules
                        </li>
                      </ul>
                    )
                  },
                  {
                    Header: "Type",
                    maxWidth: 125,
                    Cell: cell => <span>{typeMap[cell.original.type]}</span>
                  },
                  {
                    Header: "History",
                    Cell: cell => {
                      return (
                        <span>
                          {cell.original.count} candidates{" "}
                          {cell.original.created_at
                            ? `since 
                          ${moment(cell.original.created_at).format(
                            "MM/DD/YYYY"
                          )}`
                            : ""}
                        </span>
                      );
                    },
                    maxWidth: 200
                  },
                  {
                    Header: "Actions",
                    maxWidth: 200,
                    Cell: cell => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <ButtonGroup
                          size="sm"
                          vertical
                          style={{
                            maxWidth: "100%"
                          }}
                        >
                          <Button size="sm" color="primary">
                            <a
                              href={`/#/dashboard/tests/issuedTests/review?id=${
                                cell.original.test_id
                              }`}
                            >
                              Review Test
                            </a>
                          </Button>
                          <Button size="sm" color="success">
                            <a
                              href={`/#/dashboard/tests/inviteCandidates?id=${
                                cell.original.id
                              }&name=${cell.original.name}`}
                            >
                              Invite Candidates
                            </a>
                          </Button>
                        </ButtonGroup>
                      </div>
                    )
                  }
                ]}
                defaultPageSize={
                  this.state.tests.length <= 5
                    ? 5
                    : this.state.tests.length < 10
                      ? this.state.tests.length
                      : 10
                }
                pageSizeOptions={[5, 10]}
                className="-striped -highlight"
              />
            </Col>
          </Row>
        )}
      </div>
    );
  }
}
