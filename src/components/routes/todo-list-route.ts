import { Component } from 'angular2/core';
import { TodoListService } from '../../services/TodoListService';
import { RouteParams, CanActivate } from 'angular2/router';
import { AuthService } from '../../services/AuthService';
import { TodoListComponent } from '../widgets/todo-list';

import {OnInit} from 'angular2/core';

@Component({
    selector   : 'todo-list-route',
    templateUrl: 'app/components/routes/todo-list-route.html',
    directives : [TodoListComponent]
})
@CanActivate(AuthService.canActivateAuthCheck)
export class TodoListRouteComponent implements OnInit{

    isLoading: boolean = false;
    id: string;

    constructor(private routeParams: RouteParams, public todoListService: TodoListService) {
        this.id = routeParams.get('id');
    }

    ngOnInit() {
        this.loadTodos();
    }

    loadTodos() {
        this.isLoading = true;
        this.todoListService.loadTodos(this.id)
            .subscribe(
                null,
                e => this.onTodosError(e)
            )
    }


    onTodosError(e) {
        console.error(e);
    }
}