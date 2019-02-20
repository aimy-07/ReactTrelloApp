import * as React from 'react';

import { Dispatch, AnyAction } from 'redux';
import * as actions from './actions';
import { IList } from './reducer';

import getElementPosition from './getElementPosition';




/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    targetList: IList;
    targetListIndex: number;
    lists: IList[];
    dispatch: Dispatch<AnyAction>;
}


class AddCardMenu extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.state = {

        };
    }

    /* ---------------------------------
        処理関数
    ---------------------------------- */
    public deleteList = (listIndex: number) => {
        actions.deleteList(this.props.lists, listIndex);
        this.props.dispatch(actions.resetPopupMode(null));
        this.props.dispatch(actions.resetClickTarget(null));
    }

    public deleteAllCards = (listIndex: number) => {
        actions.deleteAllCards(listIndex);
        this.props.dispatch(actions.resetPopupMode(null));
        this.props.dispatch(actions.resetClickTarget(null));
    }


    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        // ×ボタン
        const cancelBtn = (
            <div style={{ position: 'absolute' }}>
                <button className={'option-menu-cancel-btn'}
                    onClick={() => {
                        this.props.dispatch(actions.resetPopupMode(null));
                        this.props.dispatch(actions.resetClickTarget(null));
                    }}>
                    ×
                </button>
            </div>
        );

        return (
            <div className={'option-menu-container'}
                style={getElementPosition('list-menu-option-btn-' + this.props.targetList.id, 0, 34)}
                onClick={(e) => {
                    e.stopPropagation();
                }}>

                {/* メニュータイトル */}
                {cancelBtn}
                <div className={'option-menu-title'}>
                    リスト操作
                </div>
                <div className={'option-menu-line'}/>

                {/* メニューの中身 */}
                <button className={'option-menu-btn'}
                    onClick={() => {
                        this.deleteAllCards(this.props.targetListIndex);
                    }}>
                    このリストの全てのカードを削除
                </button>
                <button className={'option-menu-btn'}
                    onClick={() => {
                        this.deleteList(this.props.targetListIndex);
                    }}>
                    このリストを削除
                </button>
            </div>
        );
    }
}

export default AddCardMenu;
