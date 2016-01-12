import { Injectable, Inject } from 'angular2/core';
import { Http , Headers, Response } from 'angular2/http';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';
import * as Immutable from 'immutable';
import { WU_CONFIG } from '../config';
import { AuthService } from './AuthService';
import { uuid } from '../util/uuid';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';

import TodoResultData = wu.model.TodoResponseData;
import Todo = wu.model.Todo;


@Injectable()
export class TodoListService {

    NEW_TODO_PREFIX: string = 'NEW_TODO_PREFIX';

    currentTodos: Observable<wu.model.TodoList>;
    loadingTodos: Observable<wu.model.TodoData[]>;
    addingTodo: Observable<Todo>;

    loadingCount: number = 0;

    private nextTodos: Subject<Immutable.Map<string, Todo>>   = new Subject();
    private startLoadingTodo: Subject<string>                       = new Subject();
    private startAddingTodo: Subject<Immutable.Map<string, any>>    = new Subject();
    private todoList: wu.model.TodoList = Immutable.Map({});
    /**
     *
     * @param http
     * @param authService
     * @param config
     */
    constructor(private http: Http, private authService: AuthService, @Inject(WU_CONFIG) private config) {
        this.currentTodos = this.nextTodos
            .publish().refCount();

        this.loadingTodos = this.startLoadingTodo
            .mergeMap<string>((id: string) => {
                this.loadingCount += 1;

                const headers = new Headers();

                this.authService.setAuthHeaders(headers);

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
            }, {}) as any;

            this.todoList = Immutable.OrderedMap<string, wu.model.Todo>(todoMap);
            this.nextTodos.next(this.todoList);
        });

        this.initTodoStreams();
    }

    /**
     * Initializes the todo streams
     */
    initTodoStreams() {
        this.addingTodo = this.startAddingTodo
            .mergeMap((todo: Todo) => {
                this.loadingCount += 1;

                const headers = new Headers();

                this.authService.setAuthHeaders(headers);

                return this.http.post(`${this.config.apiUrl}/todo/${this.authService.user.defaultTodolistId}`, JSON.stringify(todo.toJS()), {
                    headers
                });
            })
            .do(() => this.loadingCount -= 1)
            .map<Response, TodoResultData>(res => res.json())
            .map<TodoResultData, TodoResultData>( res => Immutable.Map<string, any>(res.data[0]))
            .publish().refCount();

        // With nest subscribe cause combineLatest seems not to work with RefCountObservables
        // TODO open issue for combineLatest RefCountObservable
        this.addingTodo.subscribe((todo: wu.model.Todo) => {
            this.currentTodos.toPromise().then( x => {
                this.nextTodos.next(x.set(todo.get('_id'), todo));
            });
        });
    }

    /**
     * Adds a todo. This will stream a new todo list to TodoList::currentTodos
     * @param todo
     * @returns {Observable<TodoList>}
     */
    addTodo(todo: wu.model.TodoData) {
        this.nextTodos.next(this.todoList = this.todoList.set(`${this.NEW_TODO_PREFIX}${uuid()}`, Immutable.fromJS(todo)));

        return this.currentTodos;
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

