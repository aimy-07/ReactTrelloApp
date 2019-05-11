// 変数名をチェックしない
/* tslint:disable: variable-name */

import * as React from 'react';
import { DragSource, DropTarget } from 'react-dnd';

import { Dispatch, AnyAction } from 'redux';
import * as actions from './actions';
import { IList, INewCard, POPUP_MODE, IClickTarget, INewListTitle } from './reducer';

import DraggableCard from './Card';
import AddCardForm from './AddCardForm';



/* ---------------------------------
    DnD変数
---------------------------------- */
const Types = {
    CARD: 'card',
    LIST: 'list',
};


/* ---------------------------------
    ドラッグ関数
---------------------------------- */
const dragSource = {
    beginDrag(dragProps: any) {
        console.log('log : リストをドラッグしました');
        return {
            fromListIndex: dragProps.listIndex,
        };
    },
    endDrag(props: any) {
        return {};
    },
};

const ConnectedSource = (props: any) => {
    return props.connectDragSource(
        <div>
            <DroppableList {...props}/>
        </div>,
    );
};

const DraggableList = DragSource(
    Types.LIST,
    dragSource,
    (connect, monitor) => {
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        };
    },
)(ConnectedSource);


/* ---------------------------------
    ドロップ関数
---------------------------------- */
const dropTarget: any = {
    drop(dropProps: any, monitor: any) {
        if (monitor) {
            if (monitor.getItemType() === Types.LIST) {
                console.log('log : リストをリストにドロップしました');
                const fromListIndex = monitor.getItem().fromListIndex;
                const toListIndex = dropProps.listIndex;
                if (toListIndex !== fromListIndex) {
                    // 入れ替え処理
                    dropProps.moveList(fromListIndex, toListIndex);
                }
            } else if (monitor.getItemType() === Types.CARD) {
                console.log('log : カードをリストにドロップしました');
                const fromCardIndex = monitor.getItem().fromCardIndex;
                const fromListIndex = monitor.getItem().fromListIndex;
                const toListIndex = dropProps.listIndex;
                if (toListIndex !== fromListIndex) {
                    // 入れ替え処理
                    dropProps.moveCardToList(fromCardIndex, fromListIndex, toListIndex);
                }
            }
        }
        return {};
    },
    hover(dropProps: any, monitor: any) {
        return {};
    },
    canDrop(props: any, monitor: any) {
        return {};
    },
};

const ConnectedTarget = (props: any) => {
    return props.connectDropTarget(
        <div>
            <List {...props}/>
        </div>,
    );
};

const DroppableList = DropTarget(
    [Types.LIST, Types.CARD],
    dropTarget,
    (connect: any, monitor: any) => {
        return {
            connectDropTarget: connect.dropTarget(),
            canDrop: monitor.canDrop(),
        };
    },
)(ConnectedTarget);


/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    currentUser: firebase.User | null;
    list: IList;
    listIndex: number;
    popupMode: number;
    clickTarget: IClickTarget;
    newCard: INewCard;
    newListTitle: INewListTitle;
    moveList: (fromListIndex: number, toListIndex: number) => void;
    moveCardToList: (fromCardIndex: number, fromListIndex: number, toListIndex: number) => void;
    moveCard: (fromCardIndex: number, toCardIndex: number, fromListIndex: number, toListIndex: number) => void;
    dispatch: Dispatch<AnyAction>;
}


interface IState {
    newTitle: string;
}


class List extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newTitle: this.props.list.title,
        };
    }


    /* ---------------------------------
        Reactライフサイクル関数
    ---------------------------------- */
    // public shouldComponentUpdate = (nextProps: IProps) => {
    //     if (nextProps !== this.props) {
    //         return false;
    //     }
    //     return true;
    // }

    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public updateListTitle = (listIndex: number, newTitle: string) => {
        if (newTitle !== '') {
            actions.updateListTitle(listIndex, newTitle);
            this.props.dispatch(actions.resetNewListTitle(null));
            this.setState({
                newTitle: '',
            });
        }
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        // リストタイトル
        const listTitleElement = (
            <button
                className={'list-title'}
                id={'list-title-' + this.props.list.id}
                onClick={(e) => {
                    this.props.dispatch(actions.changeNewListTitle({
                        listIndex: this.props.listIndex,
                        newTitle: this.props.list.title,
                    }));
                    this.setState({
                        newTitle: this.props.list.title,
                    });
                    e.stopPropagation();
                }}
                >
                {this.props.list.title}
            </button>
        );

        // リストタイトル編集
        const editListTitleElement = (
            <input
                className={'list-title-input'}
                value={this.state.newTitle}
                onChange={(e) => {
                    this.setState({
                        newTitle: e.currentTarget.value,
                    });
                }}
                onBlur={(e) => {
                    this.props.dispatch(actions.changeNewListTitle({
                        listIndex: this.props.listIndex,
                        newTitle: this.state.newTitle,
                    }));
                }}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        this.updateListTitle(this.props.listIndex, this.state.newTitle);
                    }
                }}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            />
        );

        // オプションボタン
        const menuBtnElement = (
            <div className={'option-btn-container'}>
                <button className={'option-btn'}
                    id={'list-menu-option-btn-' + this.props.list.id}
                    style={{ top: '0px', left: '228px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        this.props.dispatch(actions.changePopupMode(POPUP_MODE.LIST_MENU));
                        this.props.dispatch(actions.changeClickTarget({
                            listIndex: this.props.listIndex,
                            cardIndex: -1,
                        }));
                    }}>
                    •••
                </button>
            </div>
        );

        // カード
        const cardElements = (
            this.props.list.cards !== undefined || this.props.list.cards !== null || this.props.list.cards !== []
             ?  this.props.list.cards.map((card, i) => (
                    <DraggableCard
                        key={'card-' + card.id}
                        card={card}
                        cardIndex={i}
                        listIndex={this.props.listIndex}
                        moveCard={this.props.moveCard}
                        dispatch={this.props.dispatch}
                    />
                ))
             :  null
        );

        // カード追加ボタン
        const addCardBtn = (
            <button
                className={'add-card-btn'}
                onClick={(e) => {
                    e.stopPropagation();
                    this.props.dispatch(actions.changeNewCard({
                        listIndex: this.props.listIndex,
                        newText: this.props.newCard.newText,
                        newLabel: this.props.newCard.newLabel,
                    }));
                }}>
                ＋ カードを追加
            </button>
        );

        return(
            <div className={'list-container'}>
                <div className={'list'}>
                    {/* リストタイトル */}
                    <div style={{ display: 'flex' }}>
                        {menuBtnElement}
                        {console.log(this.props.newListTitle.listIndex)}
                        {this.props.newListTitle.listIndex === this.props.listIndex
                         ?  editListTitleElement
                         :  listTitleElement}
                    </div>
                    {/* カード一覧 */}
                    {cardElements}
                </div>
                {/* 新規追加フォーム */}
                {this.props.newCard.listIndex === this.props.listIndex
                 ?  <AddCardForm
                        currentUser={this.props.currentUser}
                        listIndex={this.props.listIndex}
                        listId={this.props.list.id}
                        cards={this.props.list.cards}
                        newCard={this.props.newCard}
                        dispatch={this.props.dispatch}
                        />
                 :  addCardBtn
                }

            </div>
        );
    }
}

export default DraggableList;
