/* tslint:disable:object-literal-sort-keys no-console no-shadowed-variable jsx-no-lambda jsx-no-bind curly ordered-imports*/

import * as React from "react";
import { Dispatch, AnyAction } from "redux";
import { DragSource, DropTarget } from "react-dnd";

import * as actions from "./actions";
import { IList, INewTodo } from "./reducer";

import DraggableCard from "./Card";
import AddTodoForm from "./AddTodoForm";
import { overViewMode } from './Page';



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
        console.log("log : リストをドラッグしました");
        return {
            fromListId: dragProps.list.id
        }
    },
    endDrag(props: any) {
        return {}
    }
};

const ConnectedSource = (props: any) => {
    return props.connectDragSource(
        <div>
            <DroppableList {...props}/>
        </div>
    )
}

const DraggableList = DragSource(
    Types.LIST,
    dragSource,
    (connect, monitor) => {
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging()
        }
    }
)(ConnectedSource);


/* ---------------------------------
    ドロップ関数
---------------------------------- */
const dropTarget: any = {
    drop(dropProps: any, monitor: any) {
        if (monitor) {
            if (monitor.getItemType() === Types.LIST) {
                console.log("log : リストをリストにドロップしました");
                const fromListId = monitor.getItem().fromListId;
                const toListId = dropProps.list.id;
                if (toListId !== fromListId) {
                    // 入れ替え処理
                    dropProps.moveListItem(fromListId, toListId);
                }
            } else if (monitor.getItemType() === Types.CARD) {
                console.log("log : カードをリストにドロップしました");
                const fromId = monitor.getItem().fromId;
                const fromListId = monitor.getItem().fromListId;
                const toListId = dropProps.list.id;
                if (toListId !== fromListId) {
                    // 入れ替え処理
                    dropProps.moveTodoItemToList(fromId, fromListId, toListId);
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
    }
};

const ConnectedTarget = (props: any) => {
    return props.connectDropTarget(
        <div>
            <List {...props}/>
        </div>
    )
}

const DroppableList = DropTarget(
    [Types.LIST, Types.CARD],
    dropTarget,
    (connect: any, monitor: any) => {
        return {
            connectDropTarget: connect.dropTarget(),
            canDrop: monitor.canDrop()
        }
    }
)(ConnectedTarget);



/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    list: IList;
    newTodo: INewTodo;
    addTargetListId: string;
    moveListItem: (fromListId: string, toListId: string) => void;
    moveTodoItemToList: (fromId: string, fromListId: string, toListId: string) => void;
    overViewMode: number;
    changeOverViewMode: (mode: number, listId: string, todoId: string) => void;
    dispatch: Dispatch<AnyAction>;
}


class List extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            
        };
    }


    /* ---------------------------------
        Reactライフサイクル関数
    ---------------------------------- */
    public shouldComponentUpdate = (nextProps: IProps) => {
        if (nextProps !== this.props) {
            return false;
        }
        return true;
    }


    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public moveTodoItem = (fromId: string, toId: string, fromListId: string, toListId: string) => {
        this.props.dispatch( actions.moveTodoItem({fromId, toId, fromListId, toListId}) )
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        console.log(this.props.overViewMode);
        console.log(this.props.addTargetListId);

        // オプションボタン
        const menuBtnElement = (
            <button className={"add-todo-option-btn"}
                id={"list-menu-btn-" + this.props.list.id}
                style={{top: "0px", left: "228px"}}
                onClick={() => {
                    this.props.changeOverViewMode(overViewMode.LIST_MENU, this.props.list.id, "");
                }}>
                •••
            </button>
        )

        // リストタイトル
        const listTitleElement = (
            <div style={{display: "flex"}}>
                {menuBtnElement}
                <button className={"list-title"}
                    id={"list-title-" + this.props.list.id}
                    onClick={() => {
                        this.props.changeOverViewMode(overViewMode.EDIT_LIST_TITLE, this.props.list.id, "");
                    }}>
                    {this.props.list.title}
                </button>
            </div>
        )

        // カード
        const cardElement = (
            this.props.list.todos.map((todo) => (
                <DraggableCard
                    key={"card-" + todo.id + "-" + todo.updateDate + Math.random()}
                    todo={todo}
                    listId={this.props.list.id}
                    moveTodoItem={this.moveTodoItem}
                    changeOverViewMode={this.props.changeOverViewMode}
                />
                )
            )
        )

        // カード追加ボタン
        const addTodoBtn = (
            <button
                className={"add-todo-btn-container"}
                onClick={() => {
                    this.props.dispatch( actions.updateNewTodo({listId: this.props.list.id, text: this.props.newTodo.newText, label: this.props.newTodo.newLabel}) );
                }}>
                ＋ カードを追加
            </button>
        )

        // 追加フォームのエリア
        // const addTodoFromArea = (
        //     <div className={"add-todo-from-area"}
        //         id={"add-todo-form-" + this.props.list.id}
        //         />
        // )

        return(
            <div className={"list-container"}>
                <div className={"list"}>
                    {/* リストタイトル */}
                    {listTitleElement}
                    {/* リスト */}
                    {cardElement}
                </div>
                {/* 新規追加フォーム */}
                {this.props.newTodo.listId === this.props.list.id
                 ?  <AddTodoForm
                        listId={this.props.list.id}
                        newTodo={this.props.newTodo}
                        changeOverViewMode={this.props.changeOverViewMode}
                        dispatch={this.props.dispatch}
                        />
                //  ?  addTodoFromArea
                 :  addTodoBtn
                }
            </div>
        )
    }
}

export default DraggableList;