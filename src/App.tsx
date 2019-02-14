/* tslint:disable: no-console ordered-imports object-literal-sort-keys */

import * as React from "react";
import { Provider } from "react-redux";
import { buildStore } from "./store";
import ConnectedComponent from "./ConnectedComponent";
import "./App.css";

class App extends React.Component {
  public render() {
    return (
      <Provider store={buildStore()}>
        <ConnectedComponent/>
      </Provider>
    );
  }
}

export default App;