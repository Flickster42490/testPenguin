import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  Button,
  ModalBody,
  ModalFooter
} from "reactstrap";
import axios from "axios";
import moment from "moment";
import ReactTable from "react-table";
import localForage from "localforage";
import "status-indicator/styles.css";
import "react-table/react-table.css";

import CandidateResults from "./candidateResultsTable.jsx";
import { Preloader } from "../../components/Preloader.jsx";

const typeMap = {
  journalEntry: "Journal Entry",
  multipleChoice: "Multiple Choice"
};

const firstTimeInfo = [
  {
    header: "Header 1",
    image:
      "https://www.lockportny.gov/wp-content/uploads/2018/04/placeholder-300x225.png",
    paragraph:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam odio arcu, vulputate id sem quis, volutpat vestibulum risus. Donec nec rhoncus justo. Curabitur varius lobortis suscipit. Curabitur tempus sit amet justo dictum sagittis. Etiam posuere justo ut urna lobortis egestas. Aenean sapien libero, tincidunt pharetra sapien tempus, gravida finibus eros. Nam suscipit tortor enim, vel lacinia massa elementum at. Vestibulum sed consequat risus, quis lobortis nulla. "
  },
  {
    header: "Header 2",
    image:
      "https://www.lockportny.gov/wp-content/uploads/2018/04/placeholder-300x225.png",
    paragraph:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam odio arcu, vulputate id sem quis, volutpat vestibulum risus. Donec nec rhoncus justo. Curabitur varius lobortis suscipit. Curabitur tempus sit amet justo dictum sagittis. Etiam posuere justo ut urna lobortis egestas. Aenean sapien libero, tincidunt pharetra sapien tempus, gravida finibus eros. Nam suscipit tortor enim, vel lacinia massa elementum at. Vestibulum sed consequat risus, quis lobortis nulla. "
  },
  {
    header: "Header 3",
    image:
      "https://www.lockportny.gov/wp-content/uploads/2018/04/placeholder-300x225.png",
    paragraph:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam odio arcu, vulputate id sem quis, volutpat vestibulum risus. Donec nec rhoncus justo. Curabitur varius lobortis suscipit. Curabitur tempus sit amet justo dictum sagittis. Etiam posuere justo ut urna lobortis egestas. Aenean sapien libero, tincidunt pharetra sapien tempus, gravida finibus eros. Nam suscipit tortor enim, vel lacinia massa elementum at. Vestibulum sed consequat risus, quis lobortis nulla. "
  },
  {
    header: "Header 4",
    image:
      "https://www.lockportny.gov/wp-content/uploads/2018/04/placeholder-300x225.png",
    paragraph:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam odio arcu, vulputate id sem quis, volutpat vestibulum risus. Donec nec rhoncus justo. Curabitur varius lobortis suscipit. Curabitur tempus sit amet justo dictum sagittis. Etiam posuere justo ut urna lobortis egestas. Aenean sapien libero, tincidunt pharetra sapien tempus, gravida finibus eros. Nam suscipit tortor enim, vel lacinia massa elementum at. Vestibulum sed consequat risus, quis lobortis nulla. "
  }
];

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidateList: [],
      loading: true,
      userId: undefined,
      filters: {},
      firstTimeModal: false,
      firstTimeModalIdx: 0
    };
    this.handleRefetch = this.handleRefetch.bind(this);
    this.toggleFirstTimeModal = this.toggleFirstTimeModal.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    let userId;
    localForage.getItem("userId").then(id => {
      userId = id;
      axios.post("/testAttempts", { userId: id }).then(d => {
        axios.get(`/users/${userId}`).then(user => {
          console.log(user);
          this.setState(
            {
              candidateList: d.data,
              userId: id,
              user: user.data[0],
              firstTimeModal: user.data[0].times_signed_in === 1 ? true : false,
              loading: false
            },
            () => {
              this.forceUpdate();
            }
          );
        });
      });
    });
  }

  componentWillReceiveProps(np) {
    axios
      .post("/testAttempts", {
        userId: this.state.userId,
        filters: np.filters || {}
      })
      .then(d => {
        this.setState(
          {
            candidateList: d.data,
            loading: false,
            filters: np.filters
          },
          () => this.forceUpdate()
        );
      });
  }

  toggleFirstTimeModal() {
    this.setState({
      firstTimeModal: !this.state.firstTimeModal
    });
  }

  handlePrevious() {
    this.setState({
      firstTimeModalIdx:
        this.state.firstTimeModalIdx === 0
          ? this.state.firstTimeModalIdx
          : this.state.firstTimeModalIdx - 1
    });
  }

  handleNext() {
    this.setState({
      firstTimeModalIdx:
        this.state.firstTimeModalIdx === 3
          ? this.state.firstTimeModalIdx
          : this.state.firstTimeModalIdx + 1
    });
  }

  handleRefetch() {
    axios
      .post("/testAttempts", {
        userId: this.state.userId,
        filters: this.state.filters || {}
      })
      .then(d => {
        this.setState(
          {
            candidateList: d.data,
            loading: false
          },
          () => this.forceUpdate()
        );
      });
  }

  render() {
    const { candidateList, loading } = this.state;
    return (
      <div>
        <Modal
          isOpen={this.state.firstTimeModal}
          toggle={this.toggleFirstTimeModal}
          size="lg"
        >
          <ModalHeader toggle={this.toggleFirstTimeModal}>
            <h4>{firstTimeInfo[this.state.firstTimeModalIdx].header}</h4>
          </ModalHeader>
          <ModalBody
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <img src={firstTimeInfo[this.state.firstTimeModalIdx].image} />
            <p>{firstTimeInfo[this.state.firstTimeModalIdx].paragraph}</p>
            {/* <button onClick={this.handlePrevious}>
              Previous
            </button>&nbsp;&nbsp;<button onClick={this.handleNext}>Next</button> */}
          </ModalBody>
          <ModalFooter>
            {this.state.firstTimeModalIdx !== 0 && (
              <Button color="secondary" onClick={this.handlePrevious}>
                Previous
              </Button>
            )}
            {this.state.firstTimeModalIdx !== 3 && (
              <Button color="secondary" onClick={this.handleNext}>
                Next
              </Button>
            )}
            {this.state.firstTimeModalIdx == 3 && (
              <Button color="secondary" onClick={this.toggleFirstTimeModal}>
                Close
              </Button>
            )}
          </ModalFooter>
        </Modal>
        <div className="page-header">
          {" "}
          <h2 style={{ display: "inline" }}>
            &nbsp;CANDIDATES
          </h2>&nbsp;&nbsp;&nbsp;&nbsp;
          <h6 style={{ display: "inline" }}>
            You will find your active candidates here
          </h6>
        </div>
        <Preloader loading={loading}>
          <Row>
            <Col xs="12">
              <CandidateResults
                candidateList={candidateList}
                userId={this.state.userId}
                handleRefetch={this.handleRefetch}
              />
            </Col>
          </Row>
        </Preloader>
      </div>
    );
  }
}

export default Dashboard;
