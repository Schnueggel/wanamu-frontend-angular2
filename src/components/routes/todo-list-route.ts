import { Component } from 'angular2/core';
import { TodoListService } from '../../services/TodoListService';
import { RouteParams, CanActivate } from 'angular2/router';
import { AuthService } from '../../services/AuthService';

@Component({
    selector: 'todo-list-route',
    templateUrl: 'app/components/routes/todo-list-route.html',
    directives: []
})
@CanActivate(AuthService.canActivateAuthCheck)
export class TodoListRouteComponent {

    isLoading: boolean = false;
    id: string;

    constructor(private routeParams: RouteParams, private todoListService: TodoListService) {
        this.id = routeParams.get('id');
    }
}