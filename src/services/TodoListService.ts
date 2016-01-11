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
import 'rxjs/add/operator/combineLatest';

import TodoResultData = wu.model.TodoResultData;
import Todo = wu.model.Todo;

@Injectable()
export class TodoListService {

    currentTodos: Observable<Immutable.Map<string, Todo>>;
    loadingTodos: Observable<wu.model.Todo[]>;
    addingTodo: Observable<Todo>;

    loadingCount: number = 0;

    private nextTodos: BehaviorSubject<Immutable.Map<string, Todo>> = new BehaviorSubject(Immutable.Map({}));
    private startLoadingTodo: Subject<string>                       = new Subject();
    private startAddingTodo: Subject<Immutable.Map<string, any>>    = new Subject();

    /**
     *
     * @param http
     * @param authService
     * @param config
     */
    constructor(private http: Http, private authService: AuthService, @Inject(WU_CONFIG) private config) {
        this.currentTodos = this.nextTodos
            .publish().refCount();

        this.currentTodos.subscribe();

        this.loadingTodos = this.startLoadingTodo
            .mergeMap((id: string) => {
                this.loadingCount += 1;

                const headers = new Headers();

                AuthService.setAuthHeaders(headers);

                return this.http.get(`${this.config.apiUrl}/todolist/${id}`, {
                    headers
                });
            })
            .do(() => this.loadingCount -= 1)
            .map<Response, TodoResultData>(res => res.json())
            .map<TodoResultData, Todo[]>((res: TodoResultData) => {
                return res.data;
            }).publish().refCount();

        this.loadingTodos.subscribe((data: Todo[]) => {
            const todoMap = data.reduce((map, v) => {
                map[v._id] = Immutable.fromJS(v);
                return map;
            }, {});
            this.nextTodos.next(Immutable.OrderedMap(todoMap));
        });

        this.addingTodo = this.startAddingTodo
            .mergeMap((todo: Todo) => {
                this.loadingCount += 1;

                const headers = new Headers();

                AuthService.setAuthHeaders(headers);

                return this.http.post(`${this.config.apiUrl}/todo/${AuthService.user.defaultTodolistId}`, JSON.stringify(todo.toJS()), {
                    headers
                });
            })
            .do(() => this.loadingCount -= 1)
            .map<Response, TodoResultData>(res => res.json())
            .map<TodoResultData, TodoResultData>((res: TodoResultData) => {
                return res.data[0];
            })
            //.combineLatest(this.currentTodos, (data: wu.model.TodoData, todoList: Immutable.Map<string, Todo>) => {
            //    console.log('huhuhu');
            //    const todo = Immutable.Map(data);
            //    this.nextTodos.next(todoList.set(data._id, todo));
            //    return todo;
            //})
            .publish().refCount();

        this.addingTodo.subscribe((r) => { console.log('hunudd');
            this.currentTodos.subscribe( x => {
                const todo = Immutable.Map(r);
                this.nextTodos.next(x.set(r._id, todo));
                return todo;
            });
        });

    }

    addTodo(todo: wu.model.TodoData) {
        this.startAddingTodo.next(Immutable.Map(todo));
        return this.addingTodo;
    }

    /**
     *
     * @param todoListId
     * @returns {Observable<Immutable.List<wu.model.Todo>>}
     */
    loadTodos(todoListId: string): Observable<Immutable.Map<string, Todo>> {
        this.startLoadingTodo.next(todoListId);
        return this.currentTodos;
    }
}

