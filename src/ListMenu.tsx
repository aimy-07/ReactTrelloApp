/* tslint:disable:object-literal-sort-keys ordered-imports jsx-no-lambda jsx-no-bind curly no-console*/

import * as React from "react";
import { Dispatch, AnyAction } from "redux";

import * as actions from "./actions";

import { getElemPosition } from "./Page";



/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    listId: string;
    closeOverView: () => void;
    dispatch: Dispatch<AnyAction>;
}


class AddTodoMenu extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.state = {

        }
    }

    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public deleteList = (listId: string) => {
        this.props.dispatch( actions.deleteList(listId) )
        this.props.closeOverView();
    }

    public deleteAllTodo = (listId: string) => {
        this.props.dispatch( actions.deleteAllTodo(listId) )
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
                        this.props.closeOverView()
                    }}>
                    ×
                </button>
            </div>
        )

        return (
            <div className={"option-menu-container"}
                style={getElemPosition("list-menu-btn-" + this.props.listId, 0, 36)}
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                
                {/* メニュータイトル */}
                {cancelBtn}
                <div className={"option-menu-title"}>
                    リスト操作
                </div>
                <div className={"option-menu-line"}/>

                {/* メニューの中身 */}
                <button className={"option-menu-btn"}
                    onClick={() => {
                        this.deleteAllTodo(this.props.listId);
                    }}>
                    このリストの全てのカードを削除
                </button>
                <button className={"option-menu-btn"}
                    onClick={() => {
                        this.deleteList(this.props.listId);
                    }}>
                    このリストを削除
                </button>

            </div>
        )
    }
}

export default AddTodoMenu;