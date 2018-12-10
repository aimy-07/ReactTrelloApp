/* tslint:disable:ordered-imports*/
import * as React from "react";
import { Provider } from "react-redux";

import { buildTodoStore } from "./store";

import "./App.css";

import ConnectedComponent from "./ConnectedComponent";




class App extends React.Component {
  public render() {
    return (
      <Provider store={buildTodoStore()}>
        <ConnectedComponent/>
      </Provider>
    );
  }
}

export default App;