import * as React from 'react';
import { firebaseDb, firebaseAuth } from './util/firebase';

import { Dispatch, AnyAction } from 'redux';
import * as actions from './actions';
import { POPUP_MODE, PAGES, IBoard, IClickTarget, INewCard, INewListTitle } from './reducer';

import Board from './Board';
import ListMenu from './ListMenu';
import AddCardMenu from './AddCardMenu';
import CardEditView from './CardEditView';

import './App.css';


/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    board: IBoard;
    popupMode: number;
    clickTarget: IClickTarget;
    newCard: INewCard;
    newListTitle: INewListTitle;
    currentUser: firebase.User | null;
    dispatch: Dispatch<AnyAction>;
}


class Page extends React.Component<IProps> {

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
        await firebaseDb.ref('board/lists').on('value', snapshot => {
            (async () => {
                if (snapshot === null) {
                    console.log('Error : Snapshot is Enpty.');
                    return;
                }
                // console.log(snapshot.val());
                this.props.dispatch(actions.loadBoardData({ lists: snapshot.val() }));
            })();
        });
    }


    /* ---------------------------------
        OverView
    ---------------------------------- */
    public renderPopup = () => {
        // 非表示
        if (this.props.popupMode === POPUP_MODE.NONE) {
            return null;
        }

        const targetListIndex = this.props.clickTarget.listIndex;
        // リストメニュー
        if (this.props.popupMode === POPUP_MODE.LIST_MENU) {
            return (
                <ListMenu
                    targetList={this.props.board.lists[targetListIndex]}
                    targetListIndex={targetListIndex}
                    lists={this.props.board.lists}
                    dispatch={this.props.dispatch}
                    />
            );
        }
        // カード追加メニュー
        if (this.props.popupMode === POPUP_MODE.ADD_CARD_MENU) {
            return (
                <AddCardMenu
                    targetList={this.props.board.lists[targetListIndex]}
                    targetListIndex={targetListIndex}
                    newCard={this.props.newCard}
                    dispatch={this.props.dispatch}
                    />
            );
        }

        const targetCardIndex = this.props.clickTarget.cardIndex;
        // 編集ビュー
        if (this.props.popupMode === POPUP_MODE.EDIT_CARD) {
            return (
                <CardEditView
                    targetCard={this.props.board.lists[targetListIndex].cards[targetCardIndex]}
                    targetCardIndex={targetCardIndex}
                    targetListIndex={targetListIndex}
                    cards={this.props.board.lists[targetListIndex].cards}
                    dispatch={this.props.dispatch}
                    />
            );
        }

        return null;
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
        return (
            <div
                onClick={() => {
                    console.log('背景');
                    // カード追加フォームにテキストがあったら背景クリックで追加
                    if (this.props.newCard.listIndex !== -1 && this.props.newCard.newText !== '') {
                        const listIndex = this.props.newCard.listIndex;
                        const cards = this.props.board.lists[listIndex].cards;
                        actions.addCard(listIndex, cards, this.props.newCard.newText, this.props.newCard.newLabel);
                    }
                    // リストタイトルが空白でなければ背景クリックでリストタイトルを更新
                    if (this.props.newListTitle.listIndex !== -1 && this.props.newListTitle.newTitle !== '') {
                        const listIndex = this.props.newListTitle.listIndex;
                        const newTitle = this.props.newListTitle.newTitle;
                        actions.updateListTitle(listIndex, newTitle);
                    }
                    this.props.dispatch(actions.resetNewCard(null));
                    this.props.dispatch(actions.resetNewListTitle(null));
                    this.props.dispatch(actions.resetPopupMode(null));
                    this.props.dispatch(actions.resetClickTarget(null));
                }}
                >
                {/* ヘッダー */}
                <div id={'header'}>
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
                {/* ボード */}
                <Board
                    lists={this.props.board.lists}
                    popupMode={this.props.popupMode}
                    clickTarget={this.props.clickTarget}
                    newCard={this.props.newCard}
                    newListTitle={this.props.newListTitle}
                    dispatch={this.props.dispatch}
                    />
                {/* Overview */}
                <div
                    id={'over-view'}
                    style={{
                        display: this.props.popupMode === POPUP_MODE.NONE ? 'none' : 'block',
                        backgroundColor: this.props.popupMode === POPUP_MODE.EDIT_CARD ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        this.props.dispatch(actions.resetPopupMode(null));
                        this.props.dispatch(actions.resetClickTarget(null));
                    }}
                    >
                    {this.renderPopup()}
                </div>
            </div>
        );
    }
}

export default Page;
