import {Component} from 'angular2/core';
import { TodoListService } from '../../services/TodoListService';
import { RouteParams } from 'angular2/router';

@Component({
    selector: 'todo-list-route',
    templateUrl: 'app/components/routes/todo-list-route.html',
    directives: []
})
export class TodoListRouteComponent {

    isLoading: boolean = false;
    id: string;

    constructor(private routeParams: RouteParams, private todoListService: TodoListService) {
        this.id = routeParams.get('id');
    }
}