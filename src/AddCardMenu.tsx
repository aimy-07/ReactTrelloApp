import * as React from 'react';

import { Dispatch, AnyAction } from 'redux';
import * as actions from './actions';
import { INewCard, IList } from './reducer';

import LabelList from './LabelList';
import getElementPosition from './getElementPosition';




/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    targetList: IList;
    targetListIndex: number;
    newCard: INewCard;
    dispatch: Dispatch<AnyAction>;
}

interface IState {
    newText: string;
}


class AddCardMenu extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newText: '',
        };
    }


    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public updateNewLabel = (label: string) => {
        this.props.dispatch(actions.changeNewCard({
            listIndex: this.props.targetListIndex,
            newText:this.props.newCard.newText,
            newLabel: label,
        }));
    }

    public cancelAddCard = () => {
        this.props.dispatch(actions.resetPopupMode(null));
        this.props.dispatch(actions.resetClickTarget(null));
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        const cancelBtn = (
            <div style={{ position: 'absolute' }}>
                <button className={'option-menu-cancel-btn'}
                    onClick={() => {
                        this.cancelAddCard();
                    }}>
                    ×
                </button>
            </div>
        );

        return (
            <div className={'option-menu-container'}
                style={getElementPosition('add-card-option-btn-' + this.props.targetList.id, 0, 34)}
                onClick={(e) => e.stopPropagation()}
                >

                {/* メニュータイトル */}
                {cancelBtn}
                <div className={'option-menu-title'}>
                    オプション
                </div>
                <div className={'option-menu-line'}/>

                {/* メニューの中身 */}
                <div className={'option-menu-text'}>
                    ラベル
                </div>
                <LabelList
                    updateLabel={this.updateNewLabel}
                    />
            </div>
        );
    }
}

export default AddCardMenu;
