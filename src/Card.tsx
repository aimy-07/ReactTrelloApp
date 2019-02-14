/* tslint:disable: no-console ordered-imports object-literal-sort-keys jsx-no-lambda jsx-no-bind curly*/

import * as React from "react";
import { DragSource, DropTarget } from "react-dnd";

import { Dispatch, AnyAction } from "redux";
import * as actions from "./actions";
import { ICard, POPUP_MODE } from "./reducer";



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
            fromCardIndex: dragProps.cardIndex,
            fromListIndex: dragProps.listIndex,
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
                const fromCardIndex = monitor.getItem().fromCardIndex;
                const fromListIndex = monitor.getItem().fromListIndex;
                const toCardIndex = dropProps.cardIndex;
                const toListIndex = dropProps.listIndex;
                if (toCardIndex !== fromCardIndex || toListIndex !== fromListIndex) {
                    dropProps.moveCard(fromCardIndex, toCardIndex, fromListIndex, toListIndex);
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
    card: ICard;
    cardIndex: number
    listIndex: number;
    moveCard: (fromCardIndex: number, toCardIndex: number, fromListIndex: number, toListIndex: number) => void;
    dispatch: Dispatch<AnyAction>;
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

    
    /* ---------------------------------
        Reactライフサイクル関数
    ---------------------------------- */
    // public shouldComponentUpdate = (nextProps: any) => {
    //     if (nextProps !== this.props) {
    //         return false;
    //     }
    //     return true;
    // }


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

        // ラベル
        const labelElement = (
            this.props.card.label !== ""
             ?  <div 
                    className={"card-label"}
                    style={{backgroundColor: this.props.card.label}}
                />
             :  null
        )

        // テキスト
        const textElement = (
            <div className={"card-text"}>
                {this.props.card.text}
            </div>
        )

        return (
            <div
                id={"card-" + this.props.card.id}
                className={"card"}
                onClick={(e) => {
                    e.stopPropagation();
                    this.props.dispatch( actions.changePopupMode(POPUP_MODE.EDIT_CARD) );
                    this.props.dispatch( actions.changeClickTarget({
                        listIndex: this.props.listIndex,
                        cardIndex: this.props.cardIndex
                    }));
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