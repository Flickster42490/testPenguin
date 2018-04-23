import React, { Component } from "react";
import axios from "axios";
import queryString from "querystring";

import ModuleContainer from "./moduleContainer.jsx";
import MultipleChoice from "./multipleChoice.jsx";
import { Preloader } from "../../../components/Preloader.jsx";

export default class Preview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question: []
    };
  }

  componentWillMount() {
    document.body.classList.toggle("sidebar-hidden");
    const queries = window.location.hash.split("?")[1];
    const questionId = queryString.parse(queries).id;
    axios.get(`/questions/id/${questionId}`).then(d => {
      this.setState({ question: d.data }, () => {
        console.log(this.state.question);
        this.forceUpdate();
      });
    });
  }

  componentWillUnmount() {
    document.body.classList.toggle("sidebar-hidden");
  }

  render() {
    const { question } = this.state;
    return (
      <div>
        <Preloader loading={!question[0]}>
          {question[0] &&
            question[0].type === "module" && (
              <ModuleContainer question={question} />
            )}
          {question[0] &&
            question[0].type === "multiple_choice" && (
              <MultipleChoice question={question} />
            )}
        </Preloader>
      </div>
    );
  }
}
