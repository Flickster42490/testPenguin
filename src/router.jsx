import React from "react";
import { Router, Route, IndexRedirect, hashHistory } from "react-router";
import App from "./pages/main.jsx";
import TestAppContainer from "./pages/testAppContainer.jsx";
import TestApp from "./pages/Tests/TestApp/app.jsx";
import Completed from "./pages/Tests/TestApp/completed.jsx";
import Instructions from "./pages/Tests/TestApp/instructions.jsx";
import Dashboard from "./pages/dashboard.jsx";
import LoginContainer from "./pages/loginContainer.jsx";
import Login from "./pages/Login/index.jsx";
import Candidates from "./pages/Candidates/index.jsx";
import ReviewResults from "./pages/Candidates/reviewResults.jsx";
import Tests from "./pages/Tests/index.jsx";
import PreBuiltTests from "./pages/Tests/PreBuiltTests/index.jsx";
import PreBuiltViewQuestions from "./pages/Tests/PreBuiltTests/viewQuestions.jsx";
import CustomTests from "./pages/Tests/CustomTests/index.jsx";
import CustomViewQuestions from "./pages/Tests/CustomTests/viewQuestions.jsx";
import InviteCandidates from "./pages/Tests/InviteCandidates/index.jsx";
import IssuedTests from "./pages/Tests/IssuedTests/index.jsx";
import IssuedTestsReview from "./pages/Tests/IssuedTests/review.jsx";
import QuestionLibrary from "./pages/Tests/QuestionLibrary/index.jsx";
import PreviewQuestion from "./pages/Tests/QuestionLibrary/preview.jsx";
import QuestionDetails from "./pages/Tests/CreateNewQuestion/questionDetails.jsx";
import QuestionContents from "./pages/Tests/CreateNewQuestion/questionContents.jsx";
import QuestionReview from "./pages/Tests/CreateNewQuestion/questionReview.jsx";
import TestBasics from "./pages/Tests/CreateNewTest/testBasics.jsx";
import AddQuestions from "./pages/Tests/CreateNewTest/addQuestions.jsx";
import Review from "./pages/Tests/CreateNewTest/review.jsx";
import Profile from "./pages/Profile/index.jsx";
import NotFound from "./pages/NotFound/index.jsx";

const AppRouter = () => (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="dashboard" />
      <Route path="dashboard" component={Dashboard}>
        <IndexRedirect to="candidates" />
        <Route path="candidates" component={Candidates} />
        <Route path="candidates/reviewResults" component={ReviewResults} />
        <Route path="profile" component={Profile} />
        <Route path="tests" component={Tests}>
          <IndexRedirect to="preBuiltTests" />
          <Route path="preBuiltTests" component={PreBuiltTests} />
          <Route
            path="preBuiltTests/viewQuestions"
            component={PreBuiltViewQuestions}
          />
          <Route path="customTests" component={CustomTests} />
          <Route
            path="customTests/viewQuestions"
            component={CustomViewQuestions}
          />
          <Route path="inviteCandidates" component={InviteCandidates} />
          <Route path="issuedTests" component={IssuedTests} />
          <Route path="issuedTests/review" component={IssuedTestsReview} />
          <Route path="questionLibrary" component={QuestionLibrary} />
          <Route path="questionLibrary/preview" component={PreviewQuestion} />
          <Route path="createNewTest">
            <IndexRedirect to="testBasics" />
            <Route path="testBasics" component={TestBasics} />
            <Route path="addQuestions" component={AddQuestions} />
            <Route path="review" component={Review} />
          </Route>
        </Route>
      </Route>
      <Route path="testApp" component={TestAppContainer}>
        <Route path="instructions" component={Instructions} />
        <Route path="app" component={TestApp} />
        <Route path="completed" component={Completed} />
      </Route>
      <Route component={LoginContainer}>
        <Route path="login" component={Login} />
        <Route path="*" component={NotFound} />
      </Route>
    </Route>
  </Router>
);

export default AppRouter;
