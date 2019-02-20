import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
// react-textarea-autosize デモサイト
// https://andreypopp.github.io/react-textarea-autosize/

import { Dispatch, AnyAction } from 'redux';
import * as actions from './actions';
import { ICard } from './reducer';

import LabelList from './LabelList';
import getElementPosition from './getElementPosition';




/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    targetCard: ICard;
    targetCardIndex: number;
    targetListIndex: number;
    cards: ICard[];
    dispatch: Dispatch<AnyAction>;
}

interface IState {
    newText: string;
    newLabel: string;
    isLabelEdit: boolean;
}


class CardEditView extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newText: props.targetCard.text,
            newLabel: props.targetCard.label,
            isLabelEdit: false,
        };
    }


    /* ---------------------------------
        Reactライフサイクル関数
    ---------------------------------- */
    public componentWillReceiveProps = (nextProps: IProps) => {
        if (nextProps !== this.props) {
            this.setState({
                newText: nextProps.targetCard.text,
                newLabel: nextProps.targetCard.label,
            });
        }
    }


    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public updateCard = (text: string, label: string) => {
        if (text !== '') {
            actions.updateCard(this.props.targetListIndex, this.props.targetCardIndex, text, label);
            this.props.dispatch(actions.resetPopupMode(null));
            this.props.dispatch(actions.resetClickTarget(null));
        }
    }

    public deleteCard = () => {
        actions.deleteCard(this.props.targetListIndex, this.props.cards, this.props.targetCardIndex);
        this.props.dispatch(actions.resetPopupMode(null));
        this.props.dispatch(actions.resetClickTarget(null));
    }

    public updateLabel = (newLabel: string) => {
        this.setState({
            newLabel,
        });
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        // ラベル
        const labelElement = (
            this.state.newLabel !== ''
            ?   <div
                    className={'card-label'}
                    style={{ backgroundColor: this.state.newLabel }}
                />
            :  null
        );

        // 保存ボタン
        const saveBtnElement = (
            <button
                className={'save-btn'}
                onClick={(e) => {
                    this.updateCard(this.state.newText, this.state.newLabel);
                    this.setState({
                        newText: '',
                        newLabel: '',
                    });
                    e.stopPropagation();
                }}
                >
                {'   保存   '}
            </button>
        );

        // ラベル編集ボタン
        const editLabelBtnElement = (
            <button
                id={'edit-side-label-btn-' + this.props.targetCard.id}
                className={'edit-side-btn'}
                onClick={(e) => {
                    this.setState({
                        isLabelEdit: !this.state.isLabelEdit,
                    });
                    e.stopPropagation();
                }}
                >
                ラベルを編集
            </button>
        );

        // 削除ボタン
        const deleteBtnElement = (
            <button
                className={'edit-side-btn'}
                onClick={(e: any) => {
                    this.deleteCard();
                    e.stopPropagation();
                }}
                >
                削除
            </button>
        );

        // ラベル編集メニュー
        const editLabelView = (
            <div className={'option-menu-container'}
                style={getElementPosition('edit-side-label-btn-' + this.props.targetCard.id, 0, 32)}
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                <div style={{ position: 'absolute' }}>
                    <button className={'option-menu-cancel-btn'}
                        onClick={(e) => {
                            this.setState({
                                isLabelEdit: false,
                            });
                        }}>
                        ×
                    </button>
                </div>
                <div className={'option-menu-title'}>
                    ラベル
                </div>
                <div className={'option-menu-line'}/>
                <LabelList
                    updateLabel={this.updateLabel}
                    />
            </div>
        );

        return (
            <div className={'edit-container'}
                style={getElementPosition('card-' + this.props.targetCard.id, 0, 0)}>

                <div style={{ display: 'block' }}>
                    <div className={'edit-card'}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}>
                        {/* ラベル */}
                        {labelElement}
                        {/* テキストエリア */}
                        <TextareaAutosize
                            className={'card-input'}
                            value={this.state.newText}
                            onChange={(e) => {
                                this.setState({
                                    newText: e.currentTarget.value,
                                });
                            }}
                        />
                    </div>
                    {/* 保存ボタン */}
                    {saveBtnElement}
                </div>

                <div style={{ display: 'block' }}>
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


export default CardEditView;
