// からのインタフェースOK
/* tslint:disable: no-empty-interface */

import * as React from 'react';
import './Home.css';
import { Dispatch, AnyAction } from 'redux';
import * as actions from './actions';

import { IBoard, IClickTarget, INewCard, INewListTitle, PAGES } from './reducer';

import { firebaseDb, firebaseAuth } from './util/firebase';
import Page from './Page';

/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    currentUser: firebase.User;
    currentBoardId: string;
    boards: IBoard[];
    popupMode: number;
    clickTarget: IClickTarget;
    newCard: INewCard;
    newListTitle: INewListTitle;
    dispatch: Dispatch<AnyAction>;
}


class Home extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.state = {

        };
    }

    /* ---------------------------------
        Reactライフサイクル関数
    ---------------------------------- */
    public async componentWillMount () {
        // firebaseからデータ取得
        await firebaseDb.ref('boards/User:' + this.props.currentUser.uid).on('value', snapshot => {
            (async () => {
                if (snapshot === null) {
                    console.log('Error : Snapshot is Enpty.');
                    return;
                }
                console.log('boards : ');
                console.log(snapshot.val());
                this.props.dispatch(actions.loadBoardData(snapshot.val()));
            })();
        });
    }

    public logout() {
        firebaseAuth.signOut();
        this.props.dispatch(actions.changeUser(null));
        this.props.dispatch(actions.changePage(PAGES.LOGIN));
    }

    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {

        // ヘッダー
        const headerElements = (
            <div className={'header'}>
                <div
                    className="header-text">
                    React Trello App
                </div>
                <button
                    className="logout-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        this.logout();
                    }}
                    >
                    ログアウト
                </button>
            </div>
        );

        // リスト
        const boardListElements = (
            this.props.boards.length !== 0
            ?  this.props.boards.map((board, i) => {
                return (
                    <div
                        className={'home-board-button'}
                        key={'board-btn-' + board.id}
                        onClick={() => this.props.dispatch(actions.changeBoard(board.id))}
                        >
                        {'ID : ' + board.id}
                    </div>
                );
            })
            :  null
        );

        const currentBoard = this.props.boards.find((board) => {
            return (board.id === this.props.currentBoardId);
        });

        return (
            <div>
                {headerElements}
                {this.props.currentBoardId === '' || currentBoard === undefined
                ?
                // ボードリスト
                <div className={'home-body'}>
                    <div className={'home-menu-container'}>
                        <div className={'home-menu-button'}>
                            <div className={'home-menu-button-text'}>
                                ボード
                            </div>
                        </div>
                    </div>
                    <div className={'board-list-container'}>
                        <div className={'board-list-title'}>
                            マイボード
                        </div>
                        <div className={'board-list'}>
                            {boardListElements}
                        </div>
                        <div className={'board-list-title'}>
                            お気に入り
                        </div>
                        <div className={'board-list'}>
                            {/* とりあえず同じ */}
                            {boardListElements}
                        </div>
                    </div>
                </div>
                :
                // ボード
                <Page
                    currentUser={this.props.currentUser}
                    board={currentBoard}
                    popupMode={this.props.popupMode}
                    clickTarget={this.props.clickTarget}
                    newCard={this.props.newCard}
                    newListTitle={this.props.newListTitle}
                    dispatch={this.props.dispatch}
                    />
                }
            </div>
        );
    }
}


export default Home;
