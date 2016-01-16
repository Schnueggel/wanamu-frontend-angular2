import { Component, OnInit, OnDestroy, Input } from 'angular2/core';
import { TodoListService } from '../../services/TodoListService';
import { RouteParams, CanActivate } from 'angular2/router';
import { TodoListComponent } from '../widgets/todo-list';
import { Subscription } from 'rxjs/Subscription';
import {ChangeDetectionStrategy} from 'angular2/core';
import {canActivateAuthCheck} from '../../util/can-activate';
import {TodoListStore} from '../../stores/TodoListStore';
import {TodoModel} from '../../models/todo-models';

@Component({
    selector   : 'todo-list-route',
    templateUrl: 'app/components/routes/todo-list-route.html',
    directives : [TodoListComponent]
})
@CanActivate(canActivateAuthCheck)
export class TodoListRouteComponent implements OnInit, OnDestroy {

    isLoading: boolean = false;
    id: string;
    todoList: Array<TodoModel>;

    todoListSubscription: Subscription;
    todoListStoreSubscription: Subscription;

    constructor(private routeParams: RouteParams, public todoListService: TodoListService, public todoListStore: TodoListStore) {
        this.id = routeParams.get('id');
    }

    ngOnInit() {
        this.todoListStoreSubscription = this.todoListStore.currentTodosStream.subscribe((todoList : any) => {
            this.todoList = todoList.toArray();console.log(this.todoList);
        });
        this.loadTodos();
    }

    ngOnDestroy() {
        this.todoListStoreSubscription.unsubscribe();
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

    onTodoChanged(todo: wu.model.Todo) {
        console.log(todo);
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