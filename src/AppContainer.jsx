// import React, { Component } from "react";
// import { Link, Switch, Route, Redirect } from "react-router-dom";
// import { Container } from "reactstrap";
// import Header from "./components/Header/";
// import Sidebar from "./components/Sidebar/";
// import Breadcrumb from "./components/Breadcrumb/";
// import Aside from "./components/Aside/";
// import Footer from "./components/Footer/";

// import Dashboard from "./pages/Dashboard/index.jsx";

// class Full extends Component {
//   render() {
//     return (
//       <div className="app">
//         <Header />
//         <div className="app-body">
//           <Sidebar {...this.props} />
//           <main className="main">
//             <Breadcrumb />
//             <Container fluid>
//               <Switch>
//                 <Route
//                   path="/candidates"
//                   name="Candidates"
//                   component={Dashboard}
//                 />
//                 <Redirect from="/" to="/candidates" />
//               </Switch>
//             </Container>
//           </main>
//           <Aside />
//         </div>
//         <Footer />
//       </div>
//     );
//   }
// }

// export default Full;

// eslint-disable-next-line import/no-extraneous-dependencies
import "babel-polyfill";
import React from "react";
import { connect } from "react-redux";
// import { ApolloProvider } from "react-apollo";
// import ApolloClient, { createNetworkInterface } from "apollo-client";

import AppRouter from "./router.jsx";
// import { loadConfig } from "./AppReducer.jsx";

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false
    };
  }

  // componentWillMount() {
  //   this.props.loadConfig().then(config => {
  //     this.apolloClient = this.createAplloClient(config);
  //     this.setState({ init: true, config });
  //   });
  // }

  // createAplloClient(config) {
  //   const graphqlUrl = config.graphqlUrl;
  //   const networkInterface = createNetworkInterface({ uri: graphqlUrl });
  //   const client = new ApolloClient({
  //     networkInterface: networkInterface,
  //     ssrForceFetchDelay: 100,
  //     connectToDevTools: true
  //   });
  //   return client;
  // }

  render() {
    // const { config, store } = this.props;
    // const { init } = this.state;
    // if (Object.keys(config).length === 0 || !init) return null;
    return (
      <AppRouter />

      // <ApolloProvider store={store} client={this.apolloClient}>
      //   <div>
      //     <AppRouter />
      //   </div>
      // </ApolloProvider>
    );
  }
}

// const mapStateToProps = state => ({
//   baseUrl: state.app.baseUrl,
//   config: state.app.config
// });

// export default connect(mapStateToProps)(AppContainer);
export default AppContainer;
