import {Injectable} from 'angular2/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {OrderedMap} from 'immutable';

import Todo = wu.model.Todo;

@Injectable()
export class TodoListStore {

    currentTodosStream: Observable<wu.model.TodoList>;
    currentTodos: wu.model.TodoList = OrderedMap<wu.model.TodoList>();

    private nextTodos: Subject<wu.model.TodoList>  = new Subject();

    constructor() {
        this.currentTodosStream = this.nextTodos
            .publish()
            .refCount();
    }

    dispatch( func: (current: wu.model.TodoList) => wu.model.TodoList) {
        this.nextTodos.next(this.currentTodos = func(this.currentTodos));
    }
}