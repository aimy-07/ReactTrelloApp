import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

/* ---------------------------------
   Firebaseへの変更要請は全てここから行う
---------------------------------- */
import { firebaseDb } from './util/firebase';
import * as firebase from 'firebase/app';
import { IBoard, IList, ICard } from './reducer';
import * as uuidv4 from 'uuid/v4';



/* ---------------------------------
   Local Action
---------------------------------- */
export const changePopupMode = actionCreator<number>(
    'CHANGE_POPUP_MODE',
);

export const resetPopupMode = actionCreator<null>(
    'RESET_POPUP_MODE',
);

export const changeClickTarget = actionCreator<{listIndex: number, cardIndex: number}>(
    'CHANGE_CLICK_TARGET',
);

export const resetClickTarget = actionCreator<null>(
    'RESET_CLICK_TARGET',
);

export const changeNewCard = actionCreator<{listIndex: number, newText:string, newLabel:string}>(
    'CHANGE_NEW_CARD',
);

export const resetNewCard = actionCreator<null>(
    'RESET_NEW_CARD',
);

export const changeNewListTitle = actionCreator<{listIndex: number, newTitle:string}>(
    'CHANGE_NEW_LIST_TITLE',
);

export const resetNewListTitle = actionCreator<null>(
    'RESET_NEW_LIST_TITLE',
);

export const changeBoard = actionCreator<string>(
    'CHANGE_BOARD',
);

export const changePage = actionCreator<number>(
    'CHANGE_PAGE',
);

export const changeUser = actionCreator<firebase.User | null>(
    'CHANGE_USER',
);



/* ---------------------------------
   Firebase Action
---------------------------------- */
// Firebaseロード
export const loadBoardData = actionCreator<IBoard[]>(
    'LOAD_BOARD_DATA',
);

const boardId = 'board0';

// カードの追加
export const addCard = (currentUser: firebase.User, currentBoardId: string, listIndex: number, cards: ICard[], text: string, label:string) => {
    const date = new Date().toLocaleString();
    if (cards === undefined) {
        cards = [];
    }
    firebaseDb.ref('boards/User:' + currentUser.uid + '/Board:' + boardId + '/lists/' + listIndex + '/cards').set(cards.concat({
        id: uuidv4(),
        text,
        label,
        createDate: date,
        updateDate: date,
    }))
        .catch((error:Error) => {
            console.log('Error : Add card error.');
        });
};

// カードの編集
export const updateCard = (listIndex: number, cardIndex: number, text:string, label: string) => {
    const date = new Date().toLocaleString();
    firebaseDb.ref('board/lists/' + listIndex + '/cards/' + cardIndex).update({
        'text': text,
        'label': label,
        'updateDate': date,
    })
        .catch((error:Error) => {
            console.log('Error : Update card error.');
        });
};

// カードの削除
export const deleteCard = (listIndex: number, cards: ICard[], cardIndex: number) => {
    const newCards = cards.concat();
    newCards.splice(cardIndex, 1);
    const date = new Date().toLocaleString();
    firebaseDb.ref('board/lists/' + listIndex + '/').update({
        'cards': newCards,
        'updateDate': date,
    })
        .catch((error:Error) => {
            console.log('Error : Delete card error.');
        });
};

// カード同士の移動
export const moveCard = (lists: IList[], fromCardIndex: number, toCardIndex: number, fromListIndex: number, toListIndex: number) => {
    const newLists = lists.concat();
    // 同じリスト内
    if (fromListIndex === toListIndex) {
        // カードの順番入れ替え
        const tmpCard = newLists[fromListIndex].cards[fromCardIndex];
        newLists[fromListIndex].cards[fromCardIndex] = newLists[toListIndex].cards[toCardIndex];
        newLists[toListIndex].cards[toCardIndex] = tmpCard;
    // 違うリスト
    } else {
        // ドラッグしたカードを移動前のリストから削除
        // movedCardには取り除いたカードが要素1の配列として代入される
        const movedCard = newLists[fromListIndex].cards.splice(fromCardIndex, 1);
        // 行き先のリストの末尾にCardを追加
        const newCards = newLists[toListIndex].cards.concat(movedCard);
        newLists[toListIndex].cards = newCards;
    }
    firebaseDb.ref('board/lists/').set(
        newLists,
    )
        .catch((error:Error) => {
            console.log('Error : Move card to list error.');
        });
};

// カードをリストに移動
export const moveCardToList = (lists: IList[], fromCardIndex: number, fromListIndex: number, toListIndex: number) => {
    const newLists = lists.concat();
    // ドラッグしたカードを移動前のリストから削除
    // movedCardには取り除いたカードが要素1の配列として代入される
    const movedCard = newLists[fromListIndex].cards.splice(fromCardIndex, 1);
    // 行き先のリストの末尾にCardを追加
    const newCards = newLists[toListIndex].cards.concat(movedCard);
    newLists[toListIndex].cards = newCards;
    firebaseDb.ref('board/lists/').set(
        newLists,
    )
        .catch((error:Error) => {
            console.log('Error : Move card to list error.');
        });
};

// リストの追加
export const addList = (lists: IList[], title: string) => {
    const date = new Date().toLocaleString();
    firebaseDb.ref('board/lists').set(lists.concat({
        id: uuidv4(),
        title,
        createDate: date,
        updateDate: date,
        cards: [],
    }))
        .catch((error:Error) => {
            console.log('Error : Add list error.');
        });
};

// リストタイトルの編集
export const updateListTitle = (listIndex: number, title:string) => {
    const date = new Date().toLocaleString();
    firebaseDb.ref('board/lists/' + listIndex + '/').update({
        'title': title,
        'updateDate': date,
    })
        .catch((error:Error) => {
            console.log('Error : Update list title error.');
        });
};

// リストの削除
export const deleteList = (lists: IList[], listIndex: number) => {
    const newLists = lists.concat();
    newLists.splice(listIndex, 1);
    firebaseDb.ref('board/').update({
        'lists': newLists,
    })
        .catch((error:Error) => {
            console.log('Error : Delete list error.');
        });
};

// リスト内の全てのカードを削除
export const deleteAllCards = (listIndex: number) => {
    const date = new Date().toLocaleString();
    firebaseDb.ref('board/lists/' + listIndex + '/').update({
        'cards': null,
        'updateDate': date,
    })
        .catch((error:Error) => {
            console.log('Error : Delete all cards error.');
        });
};

// リスト同士の移動
export const moveList = (lists: IList[], fromListIndex: number, toListIndex: number) => {
    const newLists = lists.concat();
    const tmpList = newLists[fromListIndex];
    newLists[fromListIndex] = newLists[toListIndex];
    newLists[toListIndex] = tmpList;
    firebaseDb.ref('board/lists/').set(
        newLists,
    )
        .catch((error:Error) => {
            console.log('Error : Move list error.');
        });
};



// export const addUser = (user: firebase.User | null) => {
//     if (user === null)  return;
//     console.log('aaa')
//     firebaseDb.ref('users/' + user.uid).set({
//         uid: user.uid,
//     })
//         .catch((error:Error) => {
//             console.log('Error : Add User Error.');
//         });
// };
