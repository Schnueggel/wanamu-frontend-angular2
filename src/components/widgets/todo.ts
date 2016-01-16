import { Component, Input, Output, ViewChild, NgZone, ElementRef, EventEmitter } from 'angular2/core';
import { Router } from 'angular2/router';
import * as Immutable from 'immutable';
import { ChangeDetectionStrategy, OnInit } from 'angular2/core';
import { TodoModel } from '../../models/todo-models';

@Component({
    selector   : 'todo',
    templateUrl: 'app/components/widgets/todo.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent implements OnInit {

    @Input() todoMap: TodoModel;
    @Output() todoChanged: EventEmitter<wu.model.Todo> =  new EventEmitter<wu.model.Todo>();

    editDescription: boolean = false;
    editTitle: boolean = false;

    todoModel: any = {};

    @ViewChild('description') description: ElementRef;
    @ViewChild('title') title: ElementRef;

    constructor(private ngZone: NgZone) {
        console.log(this.todoMap);
    }

    ngOnInit() {
        this.todoModel = {};
    }

    titleEdit() {console.log(this);
        this.editTitle = true;
        this.focusElement(this.title, 'input');
    }

    titleBlur() {console.log('huhu');
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
        if (this.todoModel[key] !== this.todoMap.get(key) && this.todoModel.title) {
            this.todoChanged.emit(this.todoMap.set(key, this.todoModel[key]) as wu.model.Todo);
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