import React, { Component } from "react";
import { Row, Col, Button, ButtonGroup } from "reactstrap";
import moment from "moment";
import axios from "axios";
import localForage from "localforage";
import ReactTable from "react-table";
import "react-table/react-table.css";

import { Preloader } from "../../../components/Preloader.jsx";

export default class CustomTests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tests: [],
      loading: true,
      userId: undefined
    };
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    localForage.getItem("userId").then(id => {
      this.setState(
        {
          userId: id
        },
        () => {
          axios.post(`/tests/type/custom/${this.state.userId}`).then(d => {
            this.setState(
              {
                tests: d.data,
                loading: false
              },
              () => {
                let page = window.location.hash.split("tests/")[1];
                this.props.handlePageUpdate(page);
              }
            );
          });
        }
      );
    });
  }

  componentWillReceiveProps(np) {
    if (np.filters && Object.keys(np.filters).length > 0 && this.state.userId) {
      axios
        .post(`/tests/type/custom/${this.state.userId}`, {
          filters: np.filters
        })
        .then(d => {
          this.setState({
            tests: d.data,
            loading: false
          });
        });
    }
  }

  render() {
    const { tests, loading } = this.state;
    return (
      <div>
        <div className="page-header">
          {" "}
          <Row>
            <Col>
              <h2 style={{ display: "inline" }}>&nbsp;YOUR CUSTOM TESTS</h2>&nbsp;&nbsp;&nbsp;&nbsp;
              <h6 style={{ display: "inline" }}>
                You will find your custom-built tests here
              </h6>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a href="/#/dashboard/tests/createNewTest/testBasics">
                <Button color="primary">Create New Custom Test</Button>
              </a>
            </Col>
          </Row>
        </div>
        <Preloader loading={loading}>
          <Row>
            <Col xs="12">
              <ReactTable
                style={{ backgroundColor: "white" }}
                data={tests}
                noDataText={`No Custom Tests Matched Your Criteria. Please Try Again Or Go To 'Create New Test'.`}
                columns={[
                  {
                    Header: "Test Name",
                    accessor: "name",
                    style: {
                      justifyContent: "center"
                    },
                    Cell: cell => (
                      <a
                        href={`/#/dashboard/tests/customTests/viewQuestions?id=${
                          cell.original.id
                        }`}
                      >
                        <strong>{cell.value}</strong>
                      </a>
                    )
                  },
                  {
                    Header: "Date Created",
                    accessor: "created_at",
                    maxWidth: 120,
                    Cell: cell => (
                      <span>{moment(cell.value).format("MM/DD/YYYY")}</span>
                    )
                  },
                  {
                    Header: "Allotted Time",
                    accessor: "estimated_time",
                    maxWidth: 150,
                    Cell: cell => (
                      <span>{cell.original.estimated_time} mins</span>
                    )
                  },
                  {
                    Header: "Question Types",
                    accessor: "question_types",
                    Cell: cell => (
                      <div>
                        <span>
                          {cell.value.multiple_choice || 0} Multiple Choice
                        </span>
                        <br />
                        <span>{cell.value.module} Modules</span>
                      </div>
                    )
                  },
                  {
                    Header: "Categories",
                    accessor: "tags",
                    Cell: cell =>
                      cell.value && cell.value.length > 0 ? (
                        <div>
                          {cell.value.map((i, idx, arr) => {
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
                      ) : null
                  },
                  {
                    Header: "Actions",
                    maxWidth: 200,
                    sortable: false,
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
                              href={`/#/dashboard/tests/customTests/viewQuestions?id=${
                                cell.original.id
                              }`}
                            >
                              Test Overview
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
                          <Button size="sm" color="secondary">
                            <a
                              href={`/#/testApp/app?testId=${
                                cell.original.id
                              }&preview=true&returnTo=${window.location.hash}`}
                            >
                              Preview Test
                            </a>
                          </Button>
                        </ButtonGroup>
                      </div>
                    )
                  }
                ]}
                defaultSorted={[
                  {
                    id: "created_at",
                    desc: true
                  }
                ]}
                defaultPageSize={
                  tests.length <= 5 ? 5 : tests.length < 10 ? tests.length : 10
                }
                pageSizeOptions={[5, 10]}
                className="-striped -highlight"
              />
            </Col>
          </Row>
        </Preloader>
      </div>
    );
  }
}
