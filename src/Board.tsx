import * as React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Dispatch, AnyAction } from 'redux';
import * as actions from './actions';
import { IList, IClickTarget, INewCard, INewListTitle } from './reducer';

import DraggableList from './List';
import AddListButton from './AddListButton';



/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    lists: IList[];
    popupMode: number;
    clickTarget: IClickTarget;
    newCard: INewCard;
    newListTitle: INewListTitle;
    dispatch: Dispatch<AnyAction>;
}


class Board extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.state = {

        };
    }


    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public moveList = (fromListIndex: number, toListIndex: number) => {
        actions.moveList(this.props.lists, fromListIndex, toListIndex);
    }

    public moveCardToList = (fromCardIndex: number, fromListIndex: number, toListIndex: number) => {
        actions.moveCardToList(this.props.lists, fromCardIndex, fromListIndex, toListIndex);
    }

    public moveCard = (fromCardIndex: number, toCardIndex: number, fromListIndex: number, toListIndex: number) => {
        actions.moveCard(this.props.lists, fromCardIndex, toCardIndex, fromListIndex, toListIndex);
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        // リスト
        const listElements = (
            this.props.lists !== []
            ?  this.props.lists.map((list, i) => {
                return (
                    <DraggableList
                        key={'list-' + list.id}
                        list={list}
                        listIndex={i}
                        popupMode={this.props.popupMode}
                        clickTarget={this.props.clickTarget}
                        newCard={this.props.newCard}
                        newListTitle={this.props.newListTitle}
                        moveList={this.moveList}
                        moveCardToList={this.moveCardToList}
                        moveCard={this.moveCard}
                        dispatch={this.props.dispatch}
                    />
                );
            })
            :  null
    );

        return (
            <div
                id={'board'}>
                {/* Listコンポーネント */}
                {listElements}
                {/* リスト追加ボタン */}
                <AddListButton
                    lists={this.props.lists}
                    newListTitle={this.props.newListTitle}
                    dispatch={this.props.dispatch}
                    />
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Board);
