import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { Dispatch, AnyAction } from 'redux';
import * as actions from './actions';
import { INewCard, POPUP_MODE, ICard } from './reducer';



/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    currentUser: firebase.User | null;
    listIndex: number;
    listId: string;
    cards: ICard[];
    newCard: INewCard;
    dispatch: Dispatch<AnyAction>;
}

interface IState {
    newText: string;
}



export default class extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newText: this.props.newCard.newText,
        };
    }


    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public addCard = (text: string, label: string) => {
        if (text !== '' && this.props.currentUser !== null) {
            actions.addCard(this.props.currentUser, this.props.listIndex, this.props.cards, text, label);
            this.cancelAddCard();
        }
    }

    public cancelAddCard = () => {
        this.props.dispatch(actions.resetNewCard(null));
        this.setState({
            newText: '',
        });
    }


    public render() {
        // ラベル
        const labelElement = (
            this.props.newCard.newLabel !== ''
             ?  <div
                    className={'card-label'}
                    style={{ backgroundColor: this.props.newCard.newLabel }}
                />
             :  null
        );

        // 追加ボタン
        const addBtnElement = (
            <button
                className={'save-btn'}
                onClick={() => {
                    this.addCard(this.state.newText, this.props.newCard.newLabel);
                }}>
                カードを追加
            </button>
        );

        // キャンセルボタン
        const cancelBtnElement = (
            <button
                className={'cancel-btn'}
                onClick={() => {
                    this.cancelAddCard();
                }}>
                ×
            </button>
        );

        // オプションボタン
        const optionBtnElement = (
            <button
                id={'add-card-option-btn-' + this.props.listId}
                className={'option-btn'}
                onClick={() => {
                    this.props.dispatch(actions.changePopupMode(POPUP_MODE.ADD_CARD_MENU));
                    this.props.dispatch(actions.changeClickTarget({
                        listIndex: this.props.listIndex,
                        cardIndex: -1,
                    }));
                }}
                >
                •••
            </button>
        );


        return (
            <div className={'add-card-form-container'}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                >

                {/* カード */}
                <div className={'new-card'}>
                    {/* ラベル */}
                    {labelElement}
                    {/* テキストインプット */}
                    <TextareaAutosize
                        key={'card-input-' + this.props.listId}
                        className={'card-input'}
                        value={this.state.newText}
                        onChange={(e) => {
                            this.setState({
                                newText: e.currentTarget.value,
                            });
                        }}
                        onBlur={(e) => {
                            this.props.dispatch(actions.changeNewCard({
                                listIndex: this.props.listIndex,
                                newText: this.state.newText,
                                newLabel: this.props.newCard.newLabel,
                            }));
                        }}
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                this.addCard(this.state.newText, this.props.newCard.newLabel);
                            }
                        }}
                    />
                </div>

                {/* ボタン群 */}
                <div className={'add-card-form-btns-container'}>
                    {addBtnElement}
                    {cancelBtnElement}
                    {optionBtnElement}
                </div>

            </div>
        );
    }
}
