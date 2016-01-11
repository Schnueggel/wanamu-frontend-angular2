import { Component, OnInit, OnDestroy, Input } from 'angular2/core';
import { TodoListService } from '../../services/TodoListService';
import { RouteParams, CanActivate } from 'angular2/router';
import { AuthService } from '../../services/AuthService';
import { TodoListComponent } from '../widgets/todo-list';

import {Subscription} from 'rxjs/Subscription';

@Component({
    selector   : 'todo-list-route',
    templateUrl: 'app/components/routes/todo-list-route.html',
    directives : [TodoListComponent]
})
@CanActivate(AuthService.canActivateAuthCheck)
export class TodoListRouteComponent implements OnInit, OnDestroy {

    isLoading: boolean = false;
    id: string;
    todoListSubscription: Subscription<any>;

    constructor(private routeParams: RouteParams, public todoListService: TodoListService) {
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

    onTodoChanged(todo: wu.model.Todo & Immutable.Map) {
        console.log(todo);
    }

    onTodosError(e) {
        console.error(e);
    }

    onAddTodo() {console.log('hund');
        this.todoListService.addTodo({
            title: '',
            description: ''
        });
    }
}