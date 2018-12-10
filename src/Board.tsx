/* tslint:disable:object-literal-sort-keys ordered-imports jsx-no-lambda jsx-no-bind curly no-console*/

import * as React from "react";
import { Dispatch, AnyAction } from "redux";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import * as actions from "./actions";
import { INewTodo } from "./reducer";
import { IList } from "./reducer";

import DraggableList from "./List";
import AddListButton from "./AddListButton"
// import { overViewMode } from './Page';



/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    lists: IList[];
    newTodo: INewTodo;
    addTargetListId: string;
    overViewMode: number;
    changeOverViewMode: (mode: number, listId: string, todoId: string) => void;
    dispatch: Dispatch<AnyAction>;
}


class Kanban extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.state = {

        };
    }


    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public moveListItem = (fromListId: string, toListId: string) => {
        this.props.dispatch( actions.moveListItem({fromListId, toListId}) )
    }

    public moveTodoItemToList = (fromId: string, fromListId: string, toListId: string) => {
        this.props.dispatch( actions.moveTodoItemToList({fromId, fromListId, toListId}) )
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        // リスト
        const listElement = (
            this.props.lists.map((list) => {
                return (
                    <DraggableList
                        key={"list-" + list.id + "-" + list.updateDate + Math.random()}
                        list={list}
                        newTodo={this.props.newTodo}
                        addTargetListId={this.props.addTargetListId}
                        moveListItem={this.moveListItem}
                        moveTodoItemToList={this.moveTodoItemToList}
                        overViewMode={this.props.overViewMode}
                        changeOverViewMode={this.props.changeOverViewMode}
                        dispatch={this.props.dispatch}
                    />
                )
            })
        )

        return (
            <div id={"kanban"}>
                {/* Listコンポーネント */}
                {listElement}
                {/* リスト追加ボタン */}
                <AddListButton
                    dispatch={this.props.dispatch}
                    />
            </div>
        )
    }
}

export default DragDropContext(HTML5Backend)(Kanban);