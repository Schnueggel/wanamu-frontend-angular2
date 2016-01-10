import { Component, Input } from 'angular2/core';
import { TodoComponent } from './todo';
import {Router} from 'angular2/router';

@Component({
    selector   : 'todo-list',
    templateUrl: 'app/components/widgets/todo-list.html',
    directives : [TodoComponent]
})
export class TodoListComponent {

    @Input() todos: Array<wu.model.Todo>;

}