/* tslint:disable:object-literal-sort-keys ordered-imports jsx-no-lambda jsx-no-bind curly no-console*/

import * as React from "react";
import { Dispatch, AnyAction } from "redux";

import { IStoreState, IList, ITodo } from "./reducer";

import Board from "./Board";
import TodoEditView from "./TodoEditView";
import ListTitleEditView from "./ListTitleEditView";
import AddTodoMenu from "./AddTodoMenu";
import ListMenu from "./ListMenu";



/* ---------------------------------
    Enum
---------------------------------- */
export const enum overViewMode {
    NONE,
    EDIT_TODO,
    EDIT_LIST_TITLE,
    LIST_MENU,
    ADD_MENU,
}

/* ---------------------------------
    エレメントの位置を取得
---------------------------------- */
export const getElemPosition = (elementId: string, dx: number,dy: number) => {
    const element = document.getElementById(elementId) !== null ? document.getElementById(elementId) : null;
    if (element === null) {
        return;
    } else {
        const rect = element.getBoundingClientRect();
        return {left: (rect.left + dx) + "px", top: (rect.top + dy) + "px"}
    }
}



/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps extends IStoreState {
    dispatch: Dispatch<AnyAction>;
}

interface IState {
    overViewMode: number;
    targetListId: string;
    targetTodoId: string;
}


class Page extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            overViewMode: overViewMode.NONE,
            targetListId: "",
            targetTodoId: "",
        };
    }

    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public changeOverViewMode = (mode: number, listId: string, todoId: string) => {
        this.setState({
            overViewMode: mode,
            targetListId: listId,
            targetTodoId: todoId,
        })
    }

    public closeOverView = () => {
        this.setState({
            overViewMode: overViewMode.NONE,
            targetListId: "",
            targetTodoId: "",
        });
    }



    /* ---------------------------------
        OverView
    ---------------------------------- */
    public renderOverView = () => {
        // 非表示
        if (this.state.overViewMode === overViewMode.NONE) {
            return null;
        }

        const listIndex = this.props.todoData.lists.findIndex((list: IList) => list.id === this.state.targetListId);
        const targetList = this.props.todoData.lists[listIndex];
        // リストタイトル編集ビュー
        if (this.state.overViewMode === overViewMode.EDIT_LIST_TITLE) {
            return (
                <ListTitleEditView
                    editList={targetList}
                    dispatch={this.props.dispatch}
                    />
            )
        }
        // リストメニュー
        if (this.state.overViewMode === overViewMode.LIST_MENU) {
            return (
                <ListMenu
                    listId={this.state.targetListId}
                    closeOverView={this.closeOverView}
                    dispatch={this.props.dispatch}
                    />
            );
        }
        // カード追加メニュー
        if (this.state.overViewMode === overViewMode.ADD_MENU) {
            return (
                <AddTodoMenu
                    listId={this.state.targetListId}
                    newTodo={this.props.newTodo}
                    closeOverView={this.closeOverView}
                    dispatch={this.props.dispatch}
                    />
            );
        }
        
        // 編集ビュー
        const todoIndex: number = this.props.todoData.lists[listIndex].todos.findIndex((todo: ITodo) => todo.id === this.state.targetTodoId);
        const targetTodo = targetList.todos[todoIndex];
        if (this.state.overViewMode === overViewMode.EDIT_TODO) {
            return (
                <TodoEditView
                    editTodo={targetTodo}
                    editListId={this.state.targetListId}
                    closeOverView={this.closeOverView}
                    dispatch={this.props.dispatch}
                />
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
                <div className={"header"}>
                    React Trello App
                </div>
                <Board
                    lists={this.props.todoData.lists}
                    newTodo={this.props.newTodo}
                    addTargetListId={this.state.targetListId}
                    overViewMode={this.state.overViewMode}
                    changeOverViewMode={this.changeOverViewMode}
                    dispatch={this.props.dispatch}
                    />
                {/* 編集ビュー */}
                {/* メニューウィンドウ */}
                <div className={"over-view"}
                    id={"over-view"}
                    style={{
                        display: this.state.overViewMode === overViewMode.NONE ? "none" : "block",
                        backgroundColor: this.state.overViewMode === overViewMode.EDIT_TODO ? "rgba(0, 0, 0, 0.5)" : "transparent",
                    }}
                    onClick={() => {
                        this.closeOverView();
                    }}>
                    {this.renderOverView()}
                </div>
            </div>
        )
    }
}

export default Page;
