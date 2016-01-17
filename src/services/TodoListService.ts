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
import TodoList = wu.model.TodoList;
import TodoData = wu.model.TodoData;

import {TodoListStore} from '../stores/TodoListStore';
import {TodoModel, TodoDataModel} from '../models/todo-models';

@Injectable()
export class TodoListService {

    NEW_TODO_PREFIX: string = 'NEW_TODO_PREFIX';

    loadingTodos: Observable<wu.model.TodoData[]>;
    addingTodo: Observable<Todo>;

    loadingCount: number = 0;

    private startLoadingTodo: Subject<string>                       = new Subject();
    private startAddingTodo: Subject<Immutable.Map<string, any>>    = new Subject();;
    /**
     *
     * @param http
     * @param authService
     * @param config
     * @param todoListStore
     */
    constructor(private http: Http, private authService: AuthService, @Inject(WU_CONFIG) private config, private todoListStore: TodoListStore) {
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
            .map<Response, TodoResultData>( res => res.json())
            .map<TodoResultData, Todo[]>( res => res.data)
            .map<TodoData[], TodoList>( data => data.reduce((map, v: TodoData) => {
                map[v._id] = new TodoModel({
                    data: new TodoDataModel(v)
                });
                return map;
            }, {}))
            .publish()
            .refCount();

        this.loadingTodos.subscribe((todoMap: any) => {
            this.todoListStore.dispatch( ( map ) => map.merge(todoMap) );
        });

        this.initTodoStreams();
    }

    updateTodo(todoModel: TodoModel) {
        this.todoListStore.dispatch( tList => tList.update(todoModel.data._id, todo => todo.merge(todoModel)));
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
            .publish()
            .refCount();

        // With nest subscribe cause combineLatest seems not to work with RefCountObservables
        // TODO open issue for combineLatest RefCountObservable
        this.addingTodo.subscribe((todo: wu.model.Todo) => {
            this.todoListStore.dispatch((x) => x.set(todo.get('_id'), todo));
        });
    }

    /**
     * Adds a todo. This will stream a new todo list to TodoList::currentTodos
     * @param todo
     * @returns {Observable<TodoList>}
     */
    addTodo(todo: wu.model.TodoData) {
        const tempId = `${this.NEW_TODO_PREFIX}${uuid()}`;
        this.todoListStore.dispatch((x) => x.set(tempId, Immutable.fromJS(todo)));
    }

    /**
     *
     * @param todoListId
     * @returns {Observable<Immutable.List<wu.model.Todo>>}
     */
    loadTodos(todoListId: string) {
        this.startLoadingTodo.next(todoListId);
        return this.loadingTodos;
    }
}

