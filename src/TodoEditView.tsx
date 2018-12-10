/* tslint:disable:object-literal-sort-keys ordered-imports jsx-no-lambda jsx-no-bind curly*/

import * as React from "react";
import { Dispatch, AnyAction } from "redux";
import TextareaAutosize from "react-textarea-autosize";

import * as actions from "./actions";
import { ITodo } from "./reducer";

import { getElemPosition} from "./Page";
import LabelList from "./LabelList";




/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    editTodo: ITodo;
    editListId: string;
    closeOverView: () => void;
    dispatch: Dispatch<AnyAction>;
}

interface IState {
    newText: string;
    newLabel: string;
    isLabelEdit: boolean;
}


class TodoEditView extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newText: props.editTodo.text,
            newLabel: props.editTodo.label,
            isLabelEdit: false,
        }
    }


    /* ---------------------------------
        Reactライフサイクル関数
    ---------------------------------- */
    public componentWillReceiveProps = (nextProps: IProps) => {
        if (nextProps !== this.props) {
            this.setState ({
                newText: nextProps.editTodo.text,
                newLabel: nextProps.editTodo.label,
            })
        }
    }


    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public updateTodo = (listId: string, id: string, text: string, label: string) => {
        this.props.dispatch( actions.updateTodo({listId, id, text, label}) );
        this.props.closeOverView();
    }

    public deleteTodo = (listId: string, id: string) => {
        this.props.dispatch( actions.deleteTodo({listId, id}) );
        this.props.closeOverView();
    }

    public updateLabel = (newLabel: string) => {
        this.setState({
            newLabel
        })
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        // ラベル
        const labelElement = (
            this.state.newLabel !== ""
            ?   <div 
                    className={"card-label"}
                    style={{backgroundColor: this.state.newLabel}}
                />
            :  null
        )

        // 保存ボタン
        const saveBtnElement = (
            <button
                className={"edit-todo-btn"}
                onClick={(e) => {
                    this.updateTodo(this.props.editListId, this.props.editTodo.id, this.state.newText, this.state.newLabel);
                    this.setState({
                        newText: "",
                        newLabel: ""
                    })
                    e.stopPropagation();
                }}
                >
                {"   保存   "}
            </button>
        )

        // ラベル編集ボタン
        const editLabelBtnElement = (
            <button
                id={"edit-side-label-btn-" + this.props.editTodo.id}
                className={"edit-side-btn"}
                onClick={(e) => {
                    this.setState({
                        isLabelEdit: !this.state.isLabelEdit
                    })
                    e.stopPropagation();
                }}
                >
                ラベルを編集
            </button>
        )

        // 削除ボタン
        const deleteBtnElement = (
            <button
                className={"edit-side-btn"}
                onClick={(e: any) => {
                    this.deleteTodo(this.props.editListId, this.props.editTodo.id);
                    e.stopPropagation();
                }}
                >
                削除
            </button>
        )

        // ラベル編集メニュー
        const editLabelView = (
            <div className={"option-menu-container"}
                style={getElemPosition("edit-side-label-btn-" + this.props.editTodo.id, 0, 32)}
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                <div style={{position: "absolute"}}>
                    <button className={"option-menu-cancel-btn"}
                        onClick={(e) => {
                            this.setState({
                                isLabelEdit: false
                            })
                        }}>
                        ×
                    </button>
                </div>
                <div className={"option-menu-title"}>
                    ラベル
                </div>
                <div className={"option-menu-line"}/>
                <LabelList
                    updateLabel={this.updateLabel}
                    />
            </div>
        )

        return (
            // 背景をクリックした時に保存するならコメントアウトを実行
            // <div className={"over-view"}
            //     onClick={() => {
            //         this.updateTodo(this.props.editListId, this.props.editTodo.id, this.state.newText, this.state.newLabel);
            //     }}>
            <div className={"edit-container"}
                style={getElemPosition("card-" + this.props.editTodo.id, 0, 0)}>

                <div style={{display: "block"}}>
                    <div className={"edit-card"}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}>
                        {/* ラベル */}
                        {labelElement}
                        {/* テキストエリア */}
                        <TextareaAutosize
                            className={"add-todo-input"}
                            value={this.state.newText}
                            onChange={(e) => {
                                this.setState({
                                    newText: e.currentTarget.value
                                })
                            }}
                        />
                    </div>
                    {/* 保存ボタン */}
                    {saveBtnElement}
                </div>

                <div style={{display: "block"}}>
                    {/* ラベル編集ボタン */}
                    {editLabelBtnElement}
                    {/* 削除ボタン */}
                    {deleteBtnElement}
                    {/* ラベル編集メニュー */}
                    {this.state.isLabelEdit ? editLabelView : null}
                </div>
            </div>
            // </div>
        );
    }
}


export default TodoEditView;