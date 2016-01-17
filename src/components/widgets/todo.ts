import { Component, Input, Output, ViewChild, NgZone, ElementRef, EventEmitter } from 'angular2/core';
import { Router } from 'angular2/router';
import * as Immutable from 'immutable';
import { OnInit, AfterViewInit, OnDestroy } from 'angular2/core';
import { TodoModel } from '../../models/todo-models';
import { Observable, Subscription } from 'rxjs/Rx';
import {OnChanges} from 'angular2/core';

export interface Data {
    title?: string;
    description?: string;
}

export interface TodoData {
    isEditingTitle?: boolean;
    isEditingDescription?: boolean;
    data?: Data & Immutable.Map<string, string>
}

type TodoMap = TodoData & Immutable.Map<string, any>;

@Component({
    selector   : 'todo',
    templateUrl: 'app/components/widgets/todo.html'
})
export class TodoComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

    @Input() todoMap: TodoMap;
    @Input() todoStream: Observable;
    @Output() todoChange: EventEmitter<TodoMap> =  new EventEmitter<TodoMap>();

    @ViewChild('description') description: ElementRef;
    @ViewChild('title') title: ElementRef;

    todoModel: TodoData = {
        data: {
            title      : '',
            description: ''
        },
        isEditingTitle: false,
        isEditingDescription: false
    } as TodoData;

    todoStreamSubscription: Subscription;

    constructor(private ngZone: NgZone) {

    }

    ngOnInit() {
        if (this.todoStream) {
            this.todoStreamSubscription = this.todoStream.subscribe((map: TodoMap) => {
                this.ngZone.run(() => {
                    this.todoMap = map;
                    this._map(map);

                    setTimeout( () => this.ngAfterViewInit(), 100);
                });
            });
        } else {
            this._map(this.todoMap);
        }
    }

    ngAfterViewInit() {
        if (this.todoMap.isEditingTitle) {
            this.focusElement(this.title, 'input');
        }

        if (this.todoMap.isEditingDescription) {
            this.focusElement(this.description, 'textarea');
        }
    }

    ngOnDestroy() {
        if (this.todoStreamSubscription) {
            this.todoStreamSubscription.unsubscribe();
        }
    }

    ngOnChanges() {
        this.ngAfterViewInit();
    }

    _map(todoMap: TodoMap) {
        this.todoModel = {
            title: todoMap.data.title,
            description: todoMap.data.description,
            isEditingTitle: todoMap.isEditingTitle,
            isEditingDescription: todoMap.isEditingDescription
        };
    }

    titleEdit(event) {
        if (this.todoModel.isEditingTitle) {
            return;
        }
        this.dispatch( x => x.set('isEditingTitle', true));
    }

    titleBlur(event) {
        this.dispatch( x => x.set('isEditingTitle', false).setIn(['data', 'title'], event.target.value));
    }

    descriptionEdit() {
        if (this.todoModel.isEditingDescription) {
            return;
        }
        this.dispatch( x => x.set('isEditingDescription', true));
    }

    descriptionBlur(event) {
        this.dispatch( x => x.set('isEditingDescription', false).setIn(['data', 'description'], event.target.value));
    }

    dispatch(func: (todoMap: TodoMap) => TodoMap) {
        this.todoMap = func(this.todoMap);

        this.todoChange.emit(this.todoMap);
    }

    focusElement(elementRef: ElementRef, query: string) {
        this.ngZone.runOutsideAngular(() =>
            setTimeout(
                () => elementRef.nativeElement.querySelector(query).focus(), 100
            )
        );
    }
}