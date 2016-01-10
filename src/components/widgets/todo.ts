import { Component, Input, ViewChild, NgZone, ElementRef } from 'angular2/core';
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

    @ViewChild('description') description: ElementRef;
    @ViewChild('title') title: ElementRef;

    constructor(private ngZone: NgZone) {}

    titleEdit() {
        this.editTitle = true;
        this.focusElement(this.title, 'input');
    }

    titleBlur() {
        this.editTitle = false;
    }

    descriptionEdit() {
        this.editDescription = true;
        this.focusElement(this.description, 'textarea');
    }

    descriptionBlur() {
        this.editDescription = false;
    }

    focusElement(elementRef: ElementRef, query: string) {
        this.ngZone.runOutsideAngular(() =>
            setTimeout(
                () => elementRef.nativeElement.querySelector(query).focus(), 10
            )
        );
    }
}