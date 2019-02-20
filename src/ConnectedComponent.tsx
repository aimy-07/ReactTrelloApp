import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IStoreState } from './reducer';

import Root from './Root';



const mapStateToProps = (state: IStoreState) => state;

const mapDispatchToProps = (dispatch: Dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Root);
