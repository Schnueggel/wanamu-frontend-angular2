import { Component, Input, Output, ViewChild, NgZone, ElementRef, EventEmitter } from 'angular2/core';
import { Router } from 'angular2/router';
import * as Immutable from 'immutable';
import { ImmutablePipe } from '../../pipes/immutable';

@Component({
    selector   : 'todo',
    templateUrl: 'app/components/widgets/todo.html',
    pipes : [ImmutablePipe]
})
export class TodoComponent {

    @Input() todo: wu.model.Todo;
    @Output() todoChanged: EventEmitter =  new EventEmitter<wu.model.Todo>();

    editDescription: boolean = false;
    editTitle: boolean = false;

    todoModel: any;

    @ViewChild('description') description: ElementRef;
    @ViewChild('title') title: ElementRef;

    constructor(private ngZone: NgZone) {}

    ngOnInit() {
        this.todoModel = this.todo.toJS();
    }

    titleEdit() {
        this.editTitle = true;
        this.focusElement(this.title, 'input');
    }

    titleBlur() {
        this.editTitle = false;
        this.set('title');
    }

    descriptionEdit() {
        this.editDescription = true;
        this.focusElement(this.description, 'textarea');
    }

    descriptionBlur() {
        this.editDescription = false;
        this.set('description');
    }

    set(key) {
        if (this.todoModel[key] !== this.todo.get(key)) {
            this.todoChanged.emit(this.todo.set(key, this.todoModel[key]));
        }
    }

    focusElement(elementRef: ElementRef, query: string) {
        this.ngZone.runOutsideAngular(() =>
            setTimeout(
                () => elementRef.nativeElement.querySelector(query).focus(), 10
            )
        );
    }
}