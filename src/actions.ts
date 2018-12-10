import actionCreatorFactory from "typescript-fsa";



const actionCreator = actionCreatorFactory();



/* ---------------------------------
   各 Action の作成 
---------------------------------- */
export const addTodo = actionCreator<{listId: string, text:string, label:string}>(
    "ADD_TODO",
);

export const updateNewTodo = actionCreator<{listId: string, text:string, label:string}>(
    "UPDATE_NEW_TODO",
);

export const deleteTodo = actionCreator<{listId: string, id:string}>(
    'DELETE_TODO',
);

export const updateTodo = actionCreator<{listId: string, id: string, text:string, label:string}>(
    'UPDATE_TODO',
);

export const moveTodoItem = actionCreator<{fromId: string, toId: string, fromListId: string, toListId: string}>(
    'MOVE_TODO_ITEM',
);

export const moveTodoItemToList = actionCreator<{fromId: string, fromListId: string, toListId: string}>(
    'MOVE_TODO_ITEM_TO_LIST',
);

export const addList = actionCreator<string>(
    "ADD_LIST",
);

export const updateListTitle = actionCreator<{listId: string, title:string}>(
    "UPDATE_LIST_TITLE",
);

export const deleteList = actionCreator<string>(
    "DELETE_LIST",
);

export const deleteAllTodo = actionCreator<string>(
    "DELETE_ALL_TODO",
);

export const moveListItem = actionCreator<{fromListId: string, toListId: string}>(
    'MOVE_LIST_ITEM',
);
