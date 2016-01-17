import { Record } from 'immutable';

export interface TodoData {
    _id: string;
    title: string;
    description: string;
    color: string;
    owner: string;
    finished: boolean;
}

export interface Todo {
    data: TodoData & Immutable.Map<string, any>;

    //State
    isEditingTitle: boolean;
    isEditingDescription: boolean;
}

const defaultTodoDataValue = { _id: undefined, title: undefined, description: undefined, owner: undefined, color: undefined };

export const TodoDataModel = Record<TodoData>(defaultTodoDataValue);

const defaultTodoValue = {isEditingTitle: false, isEditingDescription: false, data: TodoDataModel({})};

export class TodoModel extends Record<Todo>(defaultTodoValue) implements Todo {
    data: TodoData & Immutable.Map<string, any>;

    //State
    isEditingTitle: boolean;
    isEditingDescription: boolean;
}

