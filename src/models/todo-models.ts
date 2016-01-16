import { Record } from 'immutable';

const defaultValue = { _id: undefined, title: undefined, description: undefined, isEditingTitle: false, isEditingDescription: false, owner: undefined, color: undefined };

export class TodoModel extends Record<wu.model.Todo>(defaultValue) implements wu.model.Todo {
    _id: string;
    title: string;
    description: string;
    color: string;
    owner: string;
    finished: boolean;

    //State
    isEditingTitle: boolean;
    isEditingDescription: boolean;
}