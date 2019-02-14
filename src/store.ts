/* tslint:disable: no-console ordered-imports object-literal-sort-keys */

import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import reducer from "./reducer";



const composeEnhancers = composeWithDevTools({});

/* ---------------------------------
    production環境でない場合にはRedux Dev Toolsを有効化する
---------------------------------- */
export const buildStore = () => (
    process.env.NODE_ENV === "production"
     ?  createStore(
            reducer,
        )
     :  createStore(
            reducer,
            composeEnhancers()
        )
)