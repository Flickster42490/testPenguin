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
        <div style={{ paddingBottom: "10px" }}>
          <h2 style={{ display: "inline" }}>&nbsp;Review Issued Tests</h2>&nbsp;&nbsp;&nbsp;&nbsp;
          <h6 style={{ display: "inline" }}>
            These are the tests you have invited candidates to take
          </h6>
        </div>
        <Row>
          <Col xs="12">
            <ReactTable
              style={{ backgroundColor: "white" }}
              data={this.state.tests}
              sortable={false}
              columns={[
                {
                  Header: "Name",
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
                  ),
                  maxWidth: 240
                },
                {
                  Header: "Overview",
                  Cell: cell => {
                    return (
                      <div>
                        <div>
                          <strong>Estimated Time: </strong>
                          {cell.original.estimated_time} mins
                          {/* will want to use moment duration fomrat */}
                        </div>
                        <div>
                          <strong>Questions: </strong>
                          {cell.original.question_types.multiple_choice ||
                            "0"}{" "}
                          Multiple Choice,
                          {cell.original.question_types.module || "0"} Modules
                        </div>
                        <div>
                          <strong>Type : </strong>
                          {typeMap[cell.original.type]}
                        </div>
                      </div>
                    );
                  }
                },
                {
                  Header: "Candidates",
                  Cell: cell => {
                    return (
                      <div>
                        <div>
                          <strong>Candidates Invited: </strong>
                          {cell.original.count}
                        </div>
                      </div>
                    );
                  },
                  maxWidth: 200
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
                        <a
                          href={`/#/dashboard/tests/issuedTests/review?id=${
                            cell.original.test_id
                          }`}
                        >
                          <Button size="sm" color="primary">
                            Review
                          </Button>
                        </a>
                        <Button size="sm" color="default">
                          Archive Test
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
