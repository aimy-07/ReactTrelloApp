// からのインタフェースOK
/* tslint:disable: no-empty-interface */

import * as React from 'react';

import { Dispatch, AnyAction } from 'redux';
import { IStoreState, PAGES } from './reducer';
import * as actions from './actions';

import Page from './Page';
import LoginPage from './LoginPage';
import CreateAccountPage from './CreateAccountPage';


/* ---------------------------------
    Firebase
---------------------------------- */
// import {firebaseDb} from './util/firebase';
// データベース初期化
// firebaseDb.ref('board').set({
//         lists: [
//             {
//                 id: 'list0',
//                 title: 'TODO',
//                 createDate: '2019/2/11 12:04:45',
//                 updateDate: '2019/2/11 12:04:45',
//                 cards: [
//                     {
//                         id: '0000',
//                         text: 'タスク1',
//                         label: 'red',
//                         createDate: '2019/2/11 12:25:51',
//                         updateDate: '2019/2/11 12:25:51',
//                     },
//                     {
//                         id: '0001',
//                         text: 'タスク2',
//                         label: 'blue',
//                         createDate: '2019/2/11 12:26:35',
//                         updateDate: '2019/2/11 12:26:35',
//                     },
//                 ],
//             },
//             {
//                 id: 'list1',
//                 title: 'DONE',
//                 createDate: '2019/2/11 12:04:20',
//                 updateDate: '2019/2/11 12:04:20',
//                 cards: [
//                     {
//                         id: '0002',
//                         text: 'タスク3',
//                         label: 'red',
//                         createDate: '2019/2/11 12:27:20',
//                         updateDate: '2019/2/11 12:27:20',
//                     },
//                 ],
//             },
//         ]
// });
// 書き込み
// set 指定ノード以下全体を更新
// update 指定のノードのみを更新(ノード全体が置き換えられるのを回避)
// push.set 指定ノードに新しいデータを追加(追加時に新規IDを自動割り振り。配列にはできないかも)





/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps extends IStoreState {
    dispatch: Dispatch<AnyAction>;
}


class Root extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.state = {

        };
    }

    public changePage() {
        if (this.props.currentUser !== null) {
            this.props.dispatch(actions.changePage(PAGES.BOARD));
        }
        switch (this.props.currentPage) {
        case PAGES.LOGIN:
            return (
                <div className="login-body">
                <LoginPage
                    dispatch={this.props.dispatch}
                    />
                </div>
            );
        case PAGES.CREATE_ACCOUNT:
            return (
                <div className="login-body">
                <CreateAccountPage
                    dispatch={this.props.dispatch}
                    />
                </div>
            );
        case PAGES.BOARD:
            return (
                <div className="board-body">
                <Page
                    board={this.props.board}
                    popupMode={this.props.popupMode}
                    clickTarget={this.props.clickTarget}
                    newCard={this.props.newCard}
                    newListTitle={this.props.newListTitle}
                    // currentPage={this.props.currentPage}
                    currentUser={this.props.currentUser}
                    dispatch={this.props.dispatch}
                    />
                </div>
            );
        }
        return null;
    }

    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        return (
            <div>
                {this.changePage()}
            </div>
        );
    }
}


export default Root;
