// からのインタフェースOK
/* tslint:disable: no-empty-interface */

import * as React from 'react';

import { Dispatch, AnyAction } from 'redux';
import { IStoreState, PAGES } from './reducer';
// import * as actions from './actions';

import Home from './Home';
import LoginPage from './LoginPage';
import CreateAccountPage from './CreateAccountPage';


/* ---------------------------------
    Firebase
---------------------------------- */
// データベース初期化
// import { firebaseDb } from './util/firebase';
// firebaseDb.ref('boards').set({
//     ['User:JoUOHpXbv9Qv8jK1bCrvNDdZlqq2']: {
//         ['Board:board0'] : {
//             id: 'board0',
//             lists: [
//                 {
//                     id: 'list0',
//                     title: 'TODO',
//                     createDate: '2019/2/11 12:04:45',
//                     updateDate: '2019/2/11 12:04:45',
//                     cards: [
//                         {
//                             id: 'card0',
//                             text: 'タスク1',
//                             label: 'red',
//                             createDate: '2019/2/11 12:25:51',
//                             updateDate: '2019/2/11 12:25:51',
//                         },
//                         {
//                             id: 'card1',
//                             text: 'タスク2',
//                             label: 'blue',
//                             createDate: '2019/2/11 12:26:35',
//                             updateDate: '2019/2/11 12:26:35',
//                         },
//                     ],
//                 },
//                 {
//                     id: 'list1',
//                     title: 'DONE',
//                     createDate: '2019/2/11 12:04:20',
//                     updateDate: '2019/2/11 12:04:20',
//                     cards: [
//                         {
//                             id: 'card2',
//                             text: 'タスク3',
//                             label: 'red',
//                             createDate: '2019/2/11 12:27:20',
//                             updateDate: '2019/2/11 12:27:20',
//                         },
//                     ],
//                 },
//             ],
//         },
//     },
//     ['User:W4mmVFFrVDSWMl5zMFc7VUTo5SD3']: {
//         ['Board:board0'] : {
//             id: 'board0',
//             lists: [
//                 {
//                     id: 'list0',
//                     title: 'New List',
//                     createDate: '2019/2/11 12:04:20',
//                     updateDate: '2019/2/11 12:04:20',
//                     cards: [
//                         {
//                             id: 'card0',
//                             text: 'ようこそ！',
//                             label: 'red',
//                             createDate: '2019/2/11 12:27:20',
//                             updateDate: '2019/2/11 12:27:20',
//                         },
//                     ],
//                 },
//             ],
//         },
//     },
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

    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        switch (this.props.currentPage) {
        case PAGES.LOGIN:
            // 初期ページはLOGIN
            // LOGINページの ComponentDidMount で既にログイン済みだったら currentPage = HOME に変更
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
        // currentUser !== null の時しか表示されない
        case PAGES.HOME:
            if (this.props.currentUser === null) {
                break;
            }
            return (
                <Home
                    currentUser={this.props.currentUser}
                    currentBoardId={this.props.currentBoardId}
                    boards={this.props.boards}
                    popupMode={this.props.popupMode}
                    clickTarget={this.props.clickTarget}
                    newCard={this.props.newCard}
                    newListTitle={this.props.newListTitle}
                    dispatch={this.props.dispatch}
                    />
            );
        }
        return <div/>;
    }
}


export default Root;
