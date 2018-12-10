/* tslint:disable:object-literal-sort-keys no-console jsx-no-lambda jsx-no-bind curly ordered-imports*/

import * as React from "react";
import { DragSource, DropTarget } from "react-dnd";

import { ITodo } from "./reducer";

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
        console.log("log : カードをドラッグしました");
        return {
            fromId: dragProps.todo.id,
            fromListId: dragProps.listId,
        }
    },
    endDrag(props: any) {
        return {}
    }
};

const ConnectedSource = (props: any) => {
    return props.connectDragSource(
        <div>
            <DroppableCard {...props}/>
        </div>
    )
}

const DraggableCard = DragSource(
    Types.CARD,
    dragSource,
    (connect: any, monitor: any) => {
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
            if (monitor.getItemType() === Types.CARD) {
                console.log("log : カードをカードにドロップしました");
                const fromId = monitor.getItem().fromId;
                const fromListId = monitor.getItem().fromListId;
                const toId = dropProps.todo.id;
                const toListId = dropProps.listId;
                if (toId !== fromId) {
                    dropProps.moveTodoItem(fromId, toId, fromListId, toListId);
                }
            }
        }
        return {};
    },
    hover(dropProps: any, monitor: any) {
        return {};
    },
    canDrop(dropProps: any, monitor: any) {
        return {};
    }
};

const ConnectedTarget = (props: any) => {
    return props.connectDropTarget(
        <div>
            <Card {...props}/>
        </div>
    )
}

const DroppableCard = DropTarget(
    Types.CARD,
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
    todo: ITodo;
    listId: string;
    moveTodoItem: (fromId: string, toId: string, fromListId: string, toListId: string) => void;
    changeOverViewMode: (mode: number, listId: string, todoId: string) => void;
}

interface IState {
    isMouseOver: boolean;
}




class Card extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isMouseOver: false
        }
    }

    public shouldComponentUpdate = (nextProps: any) => {
        if (nextProps !== this.props) {
            return false;
        }
        return true;
    }


    public render(): JSX.Element {
        // 編集アイコン */}
        const editIconElement = (
            <div style={{position: "relative"}}>
                {this.state.isMouseOver
                 ?  <div className={"card-edit-icon"}>
                        =
                    </div>
                 :  null
                }
            </div>
        )

        // ラベル */}
        const labelElement = (
            this.props.todo.label !== ""
             ?  <div 
                    className={"card-label"}
                    style={{backgroundColor: this.props.todo.label}}
                />
             :  null
        )

        // テキスト
        const textElement = (
            <div className={"card-text"}>
                {this.props.todo.text}
            </div>
        )

        return (
            <div
                id={"card-" + this.props.todo.id}
                className={"card"}
                onClick={() => {
                    this.props.changeOverViewMode(overViewMode.EDIT_TODO, this.props.listId, this.props.todo.id);
                }}
                onMouseOver={() => {
                    this.setState({
                        isMouseOver: true
                    })
                }}
                onMouseLeave={() => {
                    this.setState({
                        isMouseOver: false
                    })
                }}
                >
                {/* 編集アイコン */}
                {editIconElement}
                {/* ラベル */}
                {labelElement}
                {/* テキスト */}
                {textElement}
            </div>
        )
    }
}


export default DraggableCard;