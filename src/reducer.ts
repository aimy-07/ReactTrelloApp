import { reducerWithInitialState } from 'typescript-fsa-reducers';

import * as actions from './actions';
import * as firebase from 'firebase/app';


/* ---------------------------------
    Cardの型
---------------------------------- */
export interface ICard {
    id: string;
    text: string;
    label: string;
    createDate: string;
    updateDate: string;
}

/* ---------------------------------
    Listの型
---------------------------------- */
export interface IList {
    id: string;
    title: string;
    createDate: string;
    updateDate: string;
    cards: ICard[];
}

/* ---------------------------------
    Boardの型
---------------------------------- */
export interface IBoard {
    id: string;
    lists: IList[];
}

/* ---------------------------------
    Enums
---------------------------------- */
export const POPUP_MODE = {
    NONE: 0,
    EDIT_CARD: 1,
    ADD_CARD_MENU: 2,
    LIST_MENU: 3,
};

export const PAGES = {
    LOGIN: 0,
    CREATE_ACCOUNT: 1,
    HOME: 2,
};

/* ---------------------------------
    ClickTargetの型
---------------------------------- */
export interface IClickTarget {
    listIndex: number;
    cardIndex: number;
}

/* ---------------------------------
    新規Card, 新規ListTitleの型
---------------------------------- */
export interface INewCard {
    listIndex: number;
    newText: string;
    newLabel: string;
}
export interface INewListTitle {
    listIndex: number;
    newTitle: string;
}

/* ---------------------------------
    Local Storeの型
---------------------------------- */
export interface IStoreState {
    boards: IBoard[];
    popupMode: number;
    clickTarget: IClickTarget;
    newCard: INewCard;
    newListTitle: INewListTitle;
    currentBoardId: string;
    currentPage: number;
    currentUser: firebase.User | null;
}

/* ---------------------------------
    Storeの初期状態
---------------------------------- */
export const initialStoreState: IStoreState = {
    // firebaseから読み込み/更新
    boards: [],
    // ローカルステート
    popupMode: POPUP_MODE.NONE,
    clickTarget: {
        listIndex: -1,
        cardIndex: -1,
    },
    newCard: {
        listIndex: -1,
        newText: '',
        newLabel: '',
    },
    newListTitle: {
        listIndex: -1,
        newTitle: '',
    },
    currentBoardId: '',
    currentPage: PAGES.LOGIN,
    currentUser: null,
};



/* ---------------------------------
    Reducer関数
---------------------------------- */
export default reducerWithInitialState(initialStoreState)
    // firebaseの変更リスナー
    .case(actions.loadBoardData, (state: IStoreState, payload) => {
        return {
            ...state,
            boards: payload,
        };
    })

    // popupModeの変更
    .case(actions.changePopupMode, (state: IStoreState, payload) => {
        return {
            ...state,
            popupMode: payload,
        };
    })

    // popupModeのリセット
    .case(actions.resetPopupMode, (state: IStoreState) => {
        return {
            ...state,
            popupMode: POPUP_MODE.NONE,
        };
    })

    // Targetの変更
    .case(actions.changeClickTarget, (state: IStoreState, payload) => {
        return {
            ...state,
            clickTarget: payload,
        };
    })

    // Targetリセット
    .case(actions.resetClickTarget, (state: IStoreState) => {
        return {
            ...state,
            clickTarget: {
                listIndex: -1,
                cardIndex: -1,
            },
        };
    })

    // NewCardの変更
    .case(actions.changeNewCard, (state: IStoreState, payload) => {
        return {
            ...state,
            newCard: payload,
        };
    })

    // NewCardのリセット
    .case(actions.resetNewCard, (state: IStoreState) => {
        return {
            ...state,
            newCard: {
                listIndex: -1,
                newText: '',
                newLabel: '',
            },
        };
    })

    // NewListTitleの変更
    .case(actions.changeNewListTitle, (state: IStoreState, payload) => {
        return {
            ...state,
            newListTitle: payload,
        };
    })

    // NewListTitleのリセット
    .case(actions.resetNewListTitle, (state: IStoreState) => {
        return {
            ...state,
            newListTitle: {
                listIndex: -1,
                newTitle: '',
            },
        };
    })

    // Boardの変更
    .case(actions.changeBoard, (state: IStoreState, payload) => {
        return {
            ...state,
            currentBoardId: payload,
        };
    })

    // Pageの変更
    .case(actions.changePage, (state: IStoreState, payload) => {
        return {
            ...state,
            currentPage: payload,
        };
    })

    // Userの変更
    .case(actions.changeUser, (state: IStoreState, payload) => {
        return {
            ...state,
            currentUser: payload,
        };
    })

    .build();
