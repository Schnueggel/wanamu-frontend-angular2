import { Component, OnInit, OnDestroy, Input } from 'angular2/core';
import { TodoListService } from '../../services/TodoListService';
import { RouteParams, CanActivate } from 'angular2/router';
import { TodoListComponent } from '../widgets/todo-list';
import { Subscription } from 'rxjs/Subscription';
import {ChangeDetectionStrategy} from 'angular2/core';
import {canActivateAuthCheck} from '../../util/can-activate';
import {TodoListStore} from '../../stores/TodoListStore';
import {TodoModel} from '../../models/todo-models';
import {ToObservablePipe} from '../../pipes/immutable';

import {TodoData} from '../widgets/todo';

@Component({
    selector   : 'todo-list-route',
    templateUrl: 'app/components/routes/todo-list-route.html',
    directives : [TodoListComponent],
    pipes: [ToObservablePipe]
})
@CanActivate(canActivateAuthCheck)
export class TodoListRouteComponent implements OnInit, OnDestroy {

    isLoading: boolean = false;
    id: string;
    todoList: Array<TodoModel>;

    todoListSubscription: Subscription;

    constructor(private routeParams: RouteParams, public todoListService: TodoListService, public todoListStore: TodoListStore) {
        this.id = routeParams.get('id');
    }

    ngOnInit() {
        this.loadTodos();
    }

    ngOnDestroy() {
        this.todoListSubscription.unsubscribe();
    }

    loadTodos() {
        this.isLoading = true;
        this.todoListSubscription = this.todoListService.loadTodos(this.id)
            .subscribe(
                null,
                e => this.onTodosError(e)
            )
    }

    onTodoChange(todo: TodoModel) {
        this.todoListService.updateTodo(todo);
        console.log('todo changed bubbled up', todo);
    }

    onTodosError(e) {
        console.error(e);
    }

    onAddTodo() {
        this.todoListService.addTodo({
            title: '',
            description: ''
        });
    }
}