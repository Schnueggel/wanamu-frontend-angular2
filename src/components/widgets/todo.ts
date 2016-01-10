import { Component, Input } from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    selector   : 'todo',
    templateUrl: 'app/components/widgets/todo.html',
    directives : []
})
export class TodoComponent {

    @Input() todo: wu.model.Todo;
    editDescription: boolean = false;
    editTitle: boolean = false;
}