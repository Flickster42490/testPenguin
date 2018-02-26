import React from "react";
import { Router, Route, IndexRedirect, hashHistory } from "react-router";
import App from "./pages/main.jsx";
import Candidates from "./pages/Candidates/index.jsx";
import ReviewResults from "./pages/Candidates/reviewResults.jsx";
import Tests from "./pages/Tests/index.jsx";
import PreBuiltTests from "./pages/Tests/PreBuiltTests/index.jsx";
import PreviousTests from "./pages/Tests/PreviousTests/index.jsx";
import QuestionLibrary from "./pages/Tests/QuestionLibrary/index.jsx";
import PreviewQuestion from "./pages/Tests/QuestionLibrary/preview.jsx";
import QuestionDetails from "./pages/Tests/CreateNewQuestion/questionDetails.jsx";
import QuestionContents from "./pages/Tests/CreateNewQuestion/questionContents.jsx";
import QuestionReview from "./pages/Tests/CreateNewQuestion/questionReview.jsx";
import TestBasics from "./pages/Tests/CreateNewTest/testBasics.jsx";
import AddQuestions from "./pages/Tests/CreateNewTest/addQuestions.jsx";
import Settings from "./pages/Tests/CreateNewTest/settings.jsx";
import NotFound from "./pages/notFound/index.jsx";

const AppRouter = () => (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="candidates" />
      <Route path="candidates" component={Candidates} />
      <Route path="candidates/reviewResults" component={ReviewResults} />
      <Route path="tests" component={Tests}>
        <IndexRedirect to="preBuiltTests" />
        <Route path="preBuiltTests" component={PreBuiltTests} />
        <Route path="previousTests" component={PreviousTests} />
        <Route path="questionLibrary" component={QuestionLibrary} />
        <Route path="questionLibrary/preview" component={PreviewQuestion} />
        <Route path="createNewTest">
          <IndexRedirect to="testBasics" />
          <Route path="testBasics" component={TestBasics} />
          <Route path="addQuestions" component={AddQuestions} />
          <Route path="settings" component={Settings} />
        </Route>
        <Route path="createNewQuestion">
          <IndexRedirect to="questionDetails" />
          <Route path="questionDetails" component={QuestionDetails} />
          <Route path="questionContents" component={QuestionContents} />
          <Route path="questionReview" component={QuestionReview} />
        </Route>
      </Route>
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default AppRouter;
