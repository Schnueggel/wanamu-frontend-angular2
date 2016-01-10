import { Injectable, Inject } from 'angular2/core';
import { Http , Headers, Response } from 'angular2/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { WU_CONFIG } from '../config';
import { AuthService } from './AuthService';
import * as Immutable from 'immutable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/mergeMap';

import TodoData = wu.model.TodoData;
import Todo = wu.model.Todo;


@Injectable()
export class TodoListService {

    currentTodos: Observable<wu.model.Todo[]>;
    loadingTodos: Observable<wu.model.Todo[]>;

    loadingCount: number = 0;

    private nextTodos: BehaviorSubject<wu.model.Todo[]> = new BehaviorSubject([]);
    private startLoadingTodo: Subject<string>           = new Subject();

    constructor(private http: Http, private authService: AuthService, @Inject(WU_CONFIG) private config) {
        this.currentTodos = this.nextTodos
            .publish().refCount();

        this.loadingTodos = this.startLoadingTodo
            .mergeMap((id: string) => {
                this.loadingCount += 1;

                const headers = new Headers();

                AuthService.setAuthHeaders(headers);

                return this.http.get(`${this.config.apiUrl}/todolist/${id}`, {
                    headers
                })
            })
            .do( () => this.loadingCount -= 1)
            .map<Response, TodoData>(res => res.json())
            .map<TodoData, Todo[]>((res: TodoData) => {
                return res.data;
            }).publish().refCount();

        this.loadingTodos.subscribe((data: Todo[]) => {
            this.nextTodos.next(data);
        });
    }

    loadTodos(todoListId: string): Observable<Todo[]> {
        this.startLoadingTodo.next(todoListId);
        return this.currentTodos;
    }
}

