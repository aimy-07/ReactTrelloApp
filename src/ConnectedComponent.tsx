/* tslint:disable: no-console ordered-imports object-literal-sort-keys */

import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IStoreState } from "./reducer";

import Page from "./Page";



const mapStateToProps = (state: IStoreState) => state;

const mapDispatchToProps = (dispatch: Dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Page);