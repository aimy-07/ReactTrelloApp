/* tslint:disable:object-literal-sort-keys no-console jsx-no-lambda jsx-no-bind curly ordered-imports*/
import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as uuidv4 from "uuid/v4";

import * as actions from "./actions";



/* ---------------------------------
    todos[] 配列に格納するオブジェクトの型（１つ１つのTODOの型）
---------------------------------- */
export interface ITodo {
    id: string;
    text: string;
    label: string;
    createDate: string;
    updateDate: string;
}

export interface IList {
    id: string;
    title: string;
    todos: ITodo[];
    createDate: string;
    updateDate: string;
}

export interface INewTodo {
    listId: string;
    newText: string;
    newLabel: string;
}

/* ---------------------------------
    Storeの型
---------------------------------- */
export interface IStoreState {
    todoData: {
        lists: IList[]
    };
    newTodo: INewTodo;
}

/* ---------------------------------
    Storeの初期状態
---------------------------------- */
const initialTime = new Date().toLocaleString();

export const initialStoreState: IStoreState = {
    todoData: {
        lists: [
            {
                id: uuidv4(),
                title: "TODO",
                createDate: initialTime,
                updateDate: initialTime,
                todos: [
                    {
                        id: uuidv4(),
                        text: "タスク１あいうえおあいうえおあいうえおあいうえおあいうえお",
                        label: "red",
                        createDate: initialTime,
                        updateDate: initialTime,
                    },
                    {
                        id: uuidv4(),
                        text: "タスク２",
                        label: "blue",
                        createDate: initialTime,
                        updateDate: initialTime,
                    }
                ],
            },
            {
                id: uuidv4(),
                title: "DONE",
                createDate: initialTime,
                updateDate: initialTime,
                todos: [
                    {
                        id: uuidv4(),
                        text: "タスク３",
                        label: "red",
                        createDate: initialTime,
                        updateDate: initialTime,
                    },
                ]
         }
        ]
    },
    newTodo: {
        listId: "",
        newText: "",
        newLabel: "",
    }
};



/* ---------------------------------
    Reducer関数
---------------------------------- */
export default reducerWithInitialState(initialStoreState)
    // 【addTodo】
    .case(actions.addTodo, (state: IStoreState, payload) => {
        const listsCopy = state.todoData.lists.concat();
        const listIndex: number = listsCopy.findIndex((list: IList) => list.id === payload.listId);
        listsCopy[listIndex].todos = listsCopy[listIndex].todos.concat(
            createNewTodo(payload.text, payload.label)
        )
        const updateDate = new Date().toLocaleString();
        listsCopy[listIndex].updateDate = updateDate;
        return {
            ...state,
            todoData: {
                lists: listsCopy
            }
        }
    })

    // 【updateNewTodo】
    .case(actions.updateNewTodo, (state: IStoreState, payload) => {
        const listId = payload.listId;
        const newText = payload.text;
        const newLabel = payload.label;
        return {
            ...state,
            newTodo: {
                listId,
                newText,
                newLabel,
            }
        }
    })

    // 【deleteTodo】
    .case(actions.deleteTodo, (state: IStoreState, payload) => {
        const listsCopy = state.todoData.lists.concat();
        const listIndex: number = listsCopy.findIndex((list: IList) => list.id === payload.listId);
        listsCopy[listIndex].todos = listsCopy[listIndex].todos.filter(
            (todo) => ( todo.id !== payload.id )
        )
        const updateDate = new Date().toLocaleString();
        listsCopy[listIndex].updateDate = updateDate;
        return {
            ...state,
            todoData: {
                lists: listsCopy
            }
        }
    })

    // 【updateTodo】
    .case(actions.updateTodo, (state: IStoreState, payload) => {
        const listsCopy = state.todoData.lists.concat();
        const listIndex: number = listsCopy.findIndex((list: IList) => list.id === payload.listId);
        listsCopy[listIndex].todos = updateTodo(listsCopy[listIndex].todos, payload.id, payload.text, payload.label);
        const updateDate = new Date().toLocaleString();
        listsCopy[listIndex].updateDate = updateDate;
        return {
            ...state,
            todoData: {
                lists: listsCopy
            }
        }
    })
    // 【updateDone】
    // .case(actions.updateDone, (state: IStoreState, payload) => ({
    //     ...state,
    //     todos: updateDone(state.todos, payload)
    // }))
    // 【moveupTodoItem】
    // .case(actions.moveupTodoItem, (state: IStoreState, payload) => ({
    //     ...state,
    //     todos: moveupTodoItem(state.todos, payload)
    // }))
    // 【movedownTodoItem】
    // .case(actions.movedownTodoItem, (state: IStoreState, payload) => ({
    //     ...state,
    //     todos: movedownTodoItem(state.todos, payload)
    // }))
    // 【moveTodoItem】
    .case(actions.moveTodoItem, (state: IStoreState, payload) => {
        console.log("入れ替え")
        const listsCopy = state.todoData.lists.concat()
        
        const fromListIndex: number = listsCopy.findIndex((list: IList) => list.id === payload.fromListId);
        const toListIndex: number = listsCopy.findIndex((list: IList) => list.id === payload.toListId);
        const fromIndex: number = listsCopy[fromListIndex].todos.findIndex((todo: ITodo) => todo.id === payload.fromId);
        const toIndex: number = listsCopy[toListIndex].todos.findIndex((todo: ITodo) => todo.id === payload.toId);

        const fromTodo = listsCopy[fromListIndex].todos[fromIndex]
        const toTodo = listsCopy[toListIndex].todos[toIndex]

        const updateDate = new Date().toLocaleString();
        listsCopy[fromListIndex].updateDate = updateDate;
        listsCopy[toListIndex].updateDate = updateDate;
        fromTodo.updateDate = updateDate;

        // 同じリスト内での並び替え
        if (fromListIndex === toListIndex) {
            listsCopy[fromListIndex].todos[fromIndex] = toTodo;
            listsCopy[toListIndex].todos[toIndex] = fromTodo;
            toTodo.updateDate = updateDate;
        // カードの移動
        } else {
            // ドラッグしたカードを移動前のリストから削除
            listsCopy[fromListIndex].todos = listsCopy[fromListIndex].todos.filter(
                (todo) => ( todo.id !== payload.fromId )
            )
            const toListTodosCopy = listsCopy[toListIndex].todos.concat()
            toListTodosCopy.splice(
                toIndex + 1, 0, fromTodo
            )
            listsCopy[toListIndex].todos = toListTodosCopy;
        }

        return {
            ...state,
            todoData: {
                lists: listsCopy
            }
        }
    })

    // 【moveListItem】
    .case(actions.moveListItem, (state: IStoreState, payload) => {
        console.log("リスト入れ替え")
        const listsCopy = state.todoData.lists.concat()
        
        const fromListIndex: number = listsCopy.findIndex((list: IList) => list.id === payload.fromListId);
        const toListIndex: number = listsCopy.findIndex((list: IList) => list.id === payload.toListId);

        const fromList = listsCopy[fromListIndex]
        const toList = listsCopy[toListIndex]

        const updateDate = new Date().toLocaleString();
        listsCopy[fromListIndex].updateDate = updateDate;
        listsCopy[toListIndex].updateDate = updateDate;

        listsCopy[fromListIndex] = toList;
        listsCopy[toListIndex] = fromList;

        return {
            ...state,
            todoData: {
                lists: listsCopy
            }
        }
    })

    // 【moveTodoItemToList】
    .case(actions.moveTodoItemToList, (state: IStoreState, payload) => {
        const listsCopy = state.todoData.lists.concat()
        
        const fromListIndex: number = listsCopy.findIndex((list: IList) => list.id === payload.fromListId);
        const toListIndex: number = listsCopy.findIndex((list: IList) => list.id === payload.toListId);
        const fromIndex: number = listsCopy[fromListIndex].todos.findIndex((todo: ITodo) => todo.id === payload.fromId);
        const fromTodo = listsCopy[fromListIndex].todos[fromIndex]

        const updateDate = new Date().toLocaleString();
        listsCopy[fromListIndex].updateDate = updateDate;
        listsCopy[toListIndex].updateDate = updateDate;
        fromTodo.updateDate = updateDate;

        // ドラッグしたカードを移動前のリストから削除
        listsCopy[fromListIndex].todos = listsCopy[fromListIndex].todos.filter(
            (todo) => ( todo.id !== payload.fromId )
        )
        // 行き先のリストの末尾にTodoを追加
        const toListTodosCopy = listsCopy[toListIndex].todos.concat(fromTodo);
        listsCopy[toListIndex].todos = toListTodosCopy;

        return {
            ...state,
            todoData: {
                lists: listsCopy
            }
        }
    })

    // 【addList】
    .case(actions.addList, (state: IStoreState, payload) => {
        const listsCopy = state.todoData.lists.concat(
            createNewList(payload)
        );
        return {
            ...state,
            todoData: {
                lists: listsCopy
            }
        }
    })

    // 【updateListTitle】
    .case(actions.updateListTitle, (state: IStoreState, payload) => {
        const listsCopy = state.todoData.lists.concat();
        const listIndex: number = listsCopy.findIndex((list: IList) => list.id === payload.listId);
        listsCopy[listIndex].title = payload.title;
        const updateDate = new Date().toLocaleString();
        listsCopy[listIndex].updateDate = updateDate;
        return {
            ...state,
            todoData: {
                lists: listsCopy
            }
        }
    })

    // 【deleteList】
    .case(actions.deleteList, (state: IStoreState, payload) => {
        const listsCopy = state.todoData.lists.filter(
            (list) => ( list.id !== payload )
        )
        return {
            ...state,
            todoData: {
                lists: listsCopy
            }
        }
    })

    // 【deleteAllTodo】
    .case(actions.deleteAllTodo, (state: IStoreState, payload) => {
        const listsCopy = state.todoData.lists.concat();
        const listIndex: number = listsCopy.findIndex((list: IList) => list.id === payload);
        listsCopy[listIndex].todos = [];
        const updateDate = new Date().toLocaleString();
        listsCopy[listIndex].updateDate = updateDate;
        return {
            ...state,
            todoData: {
                lists: listsCopy
            }
        }
    })

    .build();



/* ---------------------------------
    処理関数群
---------------------------------- */
// 新しいTodoを作成する
const createNewTodo = (text: string, label: string): ITodo => {
    const createDate = new Date().toLocaleString();
    return {
        id: uuidv4(),
        text,
        label,
        createDate,
        updateDate: createDate,
    }
};

// 指定idのTodoを編集する
const updateTodo = (todos: ITodo[], id: string, text: string, label: string): ITodo[] => {
    const updateDate = new Date().toLocaleString();
    const todosCopy = todos.concat();
    const index: number = todosCopy.findIndex((todo: ITodo) => todo.id === id);
    todosCopy[index] = {
        id,
        text,
        label,
        createDate: todosCopy[index].createDate,
        updateDate,
    };
    return todosCopy
}

// 新しいListを作成する
const createNewList = (title: string): IList => {
    const createDate = new Date().toLocaleString();
    return {
        id: uuidv4(),
        title,
        todos: [],
        createDate,
        updateDate: createDate,
    }
};

// 指定のidのcardをうごかす
// const moveTodoItem = (todos: ITodo[], fromId: string, toId: string): ITodo[] => {
//     console.log("入れ替え");
//     const todosCopy = todos.concat();
//     const toIndex = todosCopy.findIndex(todo => todo.id === toId);
//     const fromIndex = todosCopy.findIndex(todo => todo.id === fromId);
//     const toTodo = todosCopy[toIndex]
//     const fromTodo = todosCopy[fromIndex]
//     todosCopy[toIndex] = fromTodo
//     todosCopy[fromIndex] = toTodo
//     return todosCopy;
// };


// 指定idのTodoのdoneを変更する
// const updateDone = (todos: ITodo[], id: string): ITodo[] => {
//     const todosCopy = todos.concat();
//     const index: number = todos.findIndex((todo: ITodo) => todo.id === id);
//     todosCopy[index] = {
//         id: todosCopy[index].id,
//         text: todosCopy[index].text,
//         label: todosCopy[index].label,
//         done: !todosCopy[index].done
//     };
//     return todosCopy
// }

// 指定のidのTodoを一つ上にあげる
// const moveupTodoItem = (todos: ITodo[], id: string): ITodo[] => {
//     const todosCopy = todos.concat();
//     const index: number = todos.findIndex((todo: ITodo) => todo.id === id);    
//     if (index !== 0) {
//         todosCopy.splice(index-1, 2, todosCopy[index], todosCopy[index-1]);
//         return todosCopy;
//     } else {
//         return todos;
//     }
// };

// 指定のidのcardを一つ下に下げる
// const movedownTodoItem = (todos: ITodo[], id: string): ITodo[] => {
//     const todosCopy = todos.concat();
//     const index: number = todos.findIndex((todo: ITodo) => todo.id === id);
//     if (index !== todos.length-1) {
//         todosCopy.splice(index, 2, todosCopy[index+1], todosCopy[index]);
//         return todosCopy;
//     } else {
//         return todos;
//     }
// };


