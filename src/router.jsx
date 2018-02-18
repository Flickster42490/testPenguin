import React from "react";
import { Router, Route, IndexRedirect, hashHistory } from "react-router";
import App from "./pages/main.jsx";
import Candidates from "./pages/Candidates/index.jsx";
import ReviewResults from "./pages/Candidates/reviewResults.jsx";
import Tests from "./pages/Tests/index.jsx";
import CreateNewTest from "./pages/Tests/CreateNewTest/index.jsx";
import PreBuiltTests from "./pages/Tests/PreBuiltTests/index.jsx";
import QuestionLibrary from "./pages/Tests/QuestionLibrary/index.jsx";
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
        <Route path="questionLibrary" component={QuestionLibrary} />
        <Route path="createNewTest" component={CreateNewTest} />
      </Route>
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default AppRouter;
