/* tslint:disable:object-literal-sort-keys jsx-no-lambda jsx-no-bind curly ordered-imports*/

import * as React from "react";
import { Dispatch, AnyAction } from "redux";
import TextareaAutosize from 'react-textarea-autosize';

import * as actions from "./actions";
import { INewTodo } from "./reducer";

import { overViewMode } from './Page';



/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    listId: string;
    newTodo: INewTodo;
    changeOverViewMode: (mode: number, listId: string, todoId: string) => void;
    dispatch: Dispatch<AnyAction>;
}

interface IState {
    newText: string;
}



export default class extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newText: this.props.newTodo.newText
        }
    }


    public addTodo = (listId: string, text: string, label: string) => {
        this.props.dispatch( actions.addTodo({listId, text, label}) );
        this.props.dispatch( actions.updateNewTodo({listId: "", text: "", label: ""}) );
        this.setState({
            newText: ""
        })
    }

    public updateNewText = (text: string) => {
        this.props.dispatch( actions.updateNewTodo({listId: this.props.listId, text, label: this.props.newTodo.newLabel}) );
    }

    public cancelAddTodo = () => {
        this.props.dispatch( actions.updateNewTodo({listId: "", text: "", label: ""}) );
        this.setState({
            newText: ""
        })
        this.props.changeOverViewMode(overViewMode.NONE, "", "");
    }


    public render() {
        // ラベル
        const labelElement = (
            this.props.newTodo.newLabel !== ""
             ?  <div 
                    className={"card-label"}
                    style={{backgroundColor: this.props.newTodo.newLabel}}
                />
             :  null
        )

        // 追加ボタン
        const addBtnElement = (
            <button
                className={"add-todo-btn"}
                onClick={() => {
                    this.addTodo(this.props.listId, this.state.newText, this.props.newTodo.newLabel);
                }}>
                カードを追加
            </button>
        )

        // キャンセルボタン
        const cancelBtnElement = (
            <button
                className={"add-todo-cancel-btn"}
                onClick={() => {
                    this.cancelAddTodo();
                }}>
                ×
            </button>
        )

        // オプションボタン
        const optionBtnElement = (
            <button
                id={"add-todo-option-btn-" + this.props.listId}
                className={"add-todo-option-btn"}
                onClick={() => {
                    this.props.changeOverViewMode(overViewMode.ADD_MENU, this.props.listId, "");
                }}
                >
                •••
            </button>
        )


        return (
            <div className={"add-todo-input-container"}>

                {/* カード */}
                <div className={"add-todo-card"}>
                    {/* ラベル */}
                    {labelElement}
                    {/* テキストインプット */}
                    <TextareaAutosize
                        key={"add-todo-input-" + this.props.listId}
                        className={"add-todo-input"}
                        value={this.state.newText}
                        onChange={(e) => {
                            this.setState({
                                newText: e.currentTarget.value
                            })
                        }}
                        onBlur={(e) => {
                            this.updateNewText(this.state.newText);
                        }}
                    />
                </div>

                {/* ボタン群 */}
                <div className={"add-todo-btns-container"}>
                    {addBtnElement}
                    {cancelBtnElement}
                    {optionBtnElement}
                </div>

            </div>
        );
    }
}