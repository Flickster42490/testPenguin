import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Badge,
  Progress
} from "reactstrap";
import axios from "axios";
import ReactTable from "react-table";
import "react-table/react-table.css";
import localForage from "localforage";

import { Preloader } from "../../../components/Preloader.jsx";

export default class PreBuiltTests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tests: [],
      loading: true
    };
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    let userId;
    localForage.getItem("userId").then(id => {
      userId = id;
      axios.get(`users/${userId}`).then(u => {
        if (u.data[0].trial && u.data[0].trial_expired) {
          window.location.href = "/#/dashboard/profile?trialError=true";
        }
        axios.post("/tests/type/pre_built").then(d => {
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
      });
    });
  }

  componentWillReceiveProps(np) {
    if (np.filters && Object.keys(np.filters).length > 0) {
      axios.post("/tests/type/pre_built", { filters: np.filters }).then(d => {
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
          <h2 style={{ display: "inline" }}>&nbsp;PRE-BUILT TESTS</h2>&nbsp;&nbsp;&nbsp;&nbsp;
          <h6 style={{ display: "inline" }}>
            These are the system generated pre-built tests
          </h6>
        </div>
        <Preloader loading={loading}>
          <Row>
            <Col xs="12">
              <ReactTable
                style={{ backgroundColor: "white" }}
                data={tests}
                noDataText={`No Pre-Built Tests Matched Your Criteria. Please Try Again.`}
                columns={[
                  {
                    Header: "Test Name",
                    accessor: "name",
                    Cell: cell => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <div style={{ maxWidth: "50%", fontSize: "1rem" }}>
                          <a
                            href={`/#/dashboard/tests/customTests/viewQuestions?id=${
                              cell.original.id
                            }`}
                          >
                            <strong>{cell.value}</strong>
                          </a>{" "}
                        </div>
                      </div>
                    )
                  },
                  {
                    Header: "Allotted Time",
                    accessor: "estimated_time",
                    maxWidth: 150,
                    sortMethod: (a, b) => {
                      return a - b;
                    },
                    Cell: cell => (
                      <span>{cell.original.estimated_time} mins</span>
                    )
                  },
                  {
                    Header: "Question Types",
                    accessor: "question_types",
                    sortable: false,
                    Cell: cell => (
                      <div>
                        <span>
                          {cell.value.multiple_choice || 0} Multiple Choice
                        </span>
                        <br />
                        <span>{cell.value.module || 0} Modules</span>
                      </div>
                    )
                  },
                  {
                    Header: "Categories",
                    accessor: "tags",
                    sortable: false,
                    Cell: cell =>
                      cell.value && cell.value.length > 0 ? (
                        <span
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "start"
                          }}
                        >
                          {cell.value.map(i => {
                            return (
                              <span>
                                <Badge color="light" pill>
                                  {i}
                                </Badge>&nbsp;
                              </span>
                            );
                          })}
                        </span>
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
                          size="md"
                          vertical
                          style={{
                            maxWidth: "100%"
                          }}
                        >
                          <Button size="md" color="success">
                            <a
                              href={`/#/dashboard/tests/inviteCandidates?id=${
                                cell.original.id
                              }&name=${cell.original.name}`}
                            >
                              <strong>Invite Candidates</strong>
                            </a>
                          </Button>
                          <Button size="md" color="primary">
                            <a
                              href={`/#/dashboard/tests/preBuiltTests/viewQuestions?id=${
                                cell.original.id
                              }`}
                            >
                              Test Overview
                            </a>
                          </Button>
                          <Button size="md" color="secondary">
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
                    id: "name",
                    desc: true
                  }
                ]}
                defaultPageSize={
                  tests.length <= 5 ? 5 : tests.length < 10 ? tests.length : 10
                }
                pageSizeOptions={[10, 20]}
                className="-striped -highlight"
              />
            </Col>
          </Row>
        </Preloader>
      </div>
    );
  }
}
