/* tslint:disable:object-literal-sort-keys ordered-imports jsx-no-lambda jsx-no-bind curly no-console*/

import * as React from "react";
import { Dispatch, AnyAction } from "redux";

import * as actions from "./actions";
import { INewTodo } from "./reducer";

import { getElemPosition } from "./Page";
import LabelList from "./LabelList";



/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    listId: string;
    newTodo: INewTodo;
    closeOverView: () => void;
    dispatch: Dispatch<AnyAction>;
}

interface IState {
    newText: string;
}


class AddTodoMenu extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newText: ""
        }
    }


    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public updateNewLabel = (label: string) => {
        this.props.dispatch( actions.updateNewTodo({listId: this.props.listId, text:this.props.newTodo.newText, label}) )
    }

    public cancelAddTodo = () => {
        this.props.closeOverView();
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        const cancelBtn = (
            <div style={{position: "absolute"}}>
                <button className={"option-menu-cancel-btn"}
                    onClick={() => {
                        this.cancelAddTodo();
                    }}>
                    ×
                </button>
            </div>
        )

        return (
            <div className={"option-menu-container"}
                style={getElemPosition("add-todo-option-btn-" + this.props.listId, 0, 36)}
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                
                {/* メニュータイトル */}
                {cancelBtn}
                <div className={"option-menu-title"}>
                    オプション
                </div>
                <div className={"option-menu-line"}/>

                {/* メニューの中身 */}
                <div className={"option-menu-text"}>
                    ラベル
                </div>
                <LabelList
                    updateLabel={this.updateNewLabel}
                    />
            </div>
        )
    }
}

export default AddTodoMenu;
