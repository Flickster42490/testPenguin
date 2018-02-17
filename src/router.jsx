import React from "react";
import { Router, Route, IndexRedirect, hashHistory } from "react-router";
import App from "./pages/main.jsx";
import Candidates from "./pages/Candidates/index.jsx";
import Tests from "./pages/Tests/index.jsx";
import CreateNewTest from "./pages/Tests/CreateNewTest/index.jsx";
import NotFound from "./pages/notFound/index.jsx";

const AppRouter = () => (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="candidates" />
      <Route path="candidates" component={Candidates} />
      <Route path="tests" component={Tests}>
        <Route path="createNewTest" component={CreateNewTest} />
      </Route>
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default AppRouter;
