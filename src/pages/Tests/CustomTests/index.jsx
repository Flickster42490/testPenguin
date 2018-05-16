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
          axios.get(`/tests/type/custom/${this.state.userId}`).then(d => {
            this.setState({
              tests: d.data,
              loading: false
            });
          });
        }
      );
    });
  }

  render() {
    const { tests, loading } = this.state;
    return (
      <div>
        <Preloader loading={loading}>
          <Row>
            <Col xs="12">
              <ReactTable
                style={{ backgroundColor: "white" }}
                data={tests}
                sortable={false}
                noDataText={`Please go to the Create New Tests tab to create a custom test`}
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
                          <strong>{cell.value}</strong>
                        </div>
                      </div>
                    )
                  },
                  {
                    Header: "Estimated Time",
                    accessor: "estimated_time",
                    maxWidth: 130,
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
                          {cell.value.multiple_choice} Multiple Choices
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
                    maxWidth: 300,
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
                            maxWidth: "50%"
                          }}
                        >
                          <Button size="sm" color="primary">
                            <a
                              href={`/#/dashboard/tests/customTests/viewQuestions?id=${
                                cell.original.id
                              }`}
                            >
                              View Questions
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
