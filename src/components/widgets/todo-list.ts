import { Component, Input, Output,  EventEmitter } from 'angular2/core';
import { TodoComponent } from './todo';
import {Router} from 'angular2/router';
import {ChangeDetectionStrategy} from 'angular2/core';

@Component({
    selector   : 'todo-list',
    templateUrl: 'app/components/widgets/todo-list.html',
    directives : [TodoComponent]
})
export class TodoListComponent {

    @Input() todos: Array<wu.model.Todo>;
    @Output() todoChanged: EventEmitter<wu.model.Todo> = new EventEmitter<wu.model.Todo>();
    @Output() addTodo: EventEmitter<void> = new EventEmitter<void>();

    onTodoChanged(model: wu.model.Todo) {
        this.todoChanged.emit(model);
    }

    onAddTodo() {
        this.addTodo.emit(undefined);
    }
}