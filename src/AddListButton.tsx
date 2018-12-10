/* tslint:disable:object-literal-sort-keys ordered-imports jsx-no-lambda jsx-no-bind curly no-console*/

import * as React from "react";
import { Dispatch, AnyAction } from "redux";

import * as actions from "./actions";


/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    dispatch: Dispatch<AnyAction>;
}

interface IState {
    isAdd: boolean;
    newListTitle: string;
}


class AddListButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isAdd: false,
            newListTitle: ""
        };
    }


    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public addList = (title: string) => {
        this.props.dispatch( actions.addList(title) );
        this.setState({
            isAdd: false,
            newListTitle: "",
        })
    }

    public cancelAddList = () => {
        this.setState({
            isAdd: false,
            newListTitle: "",
        })
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        // 追加ボタン
        const addBtnElement = (
            <button className={"add-todo-btn"}
                onClick={() => {
                    this.addList(this.state.newListTitle);
                }}>
                リストを追加
            </button>
        )

        // キャンセルボタン
        const cancelBtnElement = (
            <button className={"add-todo-cancel-btn"}
                onClick={() => {
                    this.cancelAddList();
                }}>
                ×
            </button>
        )

        return (
            <div className={"list-conatiner"}>
                {!this.state.isAdd
                 ?  <button className={"add-list-btn"}
                        onClick={() => {
                            this.setState({
                                isAdd: true
                            })
                        }}>
                        ＋ もう一つリストを追加
                    </button>
                 :  <div className={"add-list-container"}>
                        <input className={"add-list-input"}
                            value={this.state.newListTitle}
                            onChange={(e) => {
                                this.setState({
                                    newListTitle: e.currentTarget.value
                                })
                            }}
                            />
                        {/* ボタン群 */}
                        <div className={"add-list-btns-container"}>
                            {addBtnElement}
                            {cancelBtnElement}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default AddListButton;