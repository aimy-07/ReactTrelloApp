import * as React from 'react';
import { Provider } from 'react-redux';
import { buildStore } from './store';
import ConnectedComponent from './ConnectedComponent';

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
