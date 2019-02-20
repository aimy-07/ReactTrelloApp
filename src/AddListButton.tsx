import * as React from 'react';

import { Dispatch, AnyAction } from 'redux';
import * as actions from './actions';
import { IList, INewListTitle } from './reducer';


/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    lists: IList[];
    newListTitle: INewListTitle;
    dispatch: Dispatch<AnyAction>;
}

interface IState {
    newTitle: string;
}


class AddListButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newTitle: '',
        };
    }


    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public addList = (title: string) => {
        if (title !== '') {
            actions.addList(this.props.lists, title);
            this.cancelAddList();
        }
    }

    public cancelAddList = () => {
        this.props.dispatch(actions.resetNewListTitle(null));
        this.setState({
            newTitle: '',
        });
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        // 追加ボタン
        const addBtnElement = (
            <button className={'save-btn'}
                onClick={() => {
                    this.addList(this.state.newTitle);
                }}>
                リストを追加
            </button>
        );

        // キャンセルボタン
        const cancelBtnElement = (
            <button className={'cancel-btn'}
                onClick={() => {
                    this.cancelAddList();
                }}>
                ×
            </button>
        );

        return (
            <div className={'list-conatiner'}>
                {this.props.newListTitle.listIndex !== this.props.lists.length
                 ?  <button className={'add-list-btn'}
                        onClick={(e) => {
                            this.props.dispatch(actions.changeNewListTitle({
                                listIndex: this.props.lists.length,
                                newTitle: '',
                            }));
                            this.setState({
                                newTitle: '',
                            });
                            e.stopPropagation();
                        }}
                        >
                        ＋ もう一つリストを追加
                    </button>
                 :  <div className={'add-list-form-container'}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}>
                        <input className={'add-list-form-input'}
                            value={this.state.newTitle}
                            onChange={(e) => {
                                this.setState({
                                    newTitle: e.currentTarget.value,
                                });
                            }}
                            onBlur={(e) => {
                                this.props.dispatch(actions.changeNewListTitle({
                                    listIndex: this.props.lists.length,
                                    newTitle: this.state.newTitle,
                                }));
                            }}
                            onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                    this.addList(this.state.newTitle);
                                }
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            />
                        {/* ボタン群 */}
                        <div className={'add-list-form-btns-container'}>
                            {addBtnElement}
                            {cancelBtnElement}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default AddListButton;
