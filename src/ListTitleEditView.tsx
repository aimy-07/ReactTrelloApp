/* tslint:disable:object-literal-sort-keys ordered-imports jsx-no-lambda jsx-no-bind curly no-console*/

import * as React from "react";
import { Dispatch, AnyAction } from "redux";

import * as actions from "./actions";
import { IList } from "./reducer";

import { getElemPosition} from "./Page";


/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    editList: IList;
    dispatch: Dispatch<AnyAction>;
}

interface IState {
    newTitle: string;
}


class ListTitleEditView extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newTitle: this.props.editList.title,
        }
    }


    /* ---------------------------------
        Reactライフサイクル関数
    ---------------------------------- */
    public componentWillReceiveProps = (nextProps: IProps) => {
        if (nextProps !== this.props) {
            this.setState ({
                newTitle: nextProps.editList.title,
            })
        }
    }


    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public updateListTitle = (listId: string, title: string) => {
        this.props.dispatch( actions.updateListTitle({listId, title}) )
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        return (
            <div className={"over-view"}
                onClick={() => {
                    this.updateListTitle(this.props.editList.id, this.state.newTitle);
                }}>
                <input
                    className={"edit-list-input"}
                    style={getElemPosition("list-title-" + this.props.editList.id, 0, 0)}
                    value={this.state.newTitle}
                    onChange={(e) => {
                        this.setState({
                            newTitle: e.currentTarget.value
                        })
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    />
            </div>
        )
    }
}

export default ListTitleEditView;
