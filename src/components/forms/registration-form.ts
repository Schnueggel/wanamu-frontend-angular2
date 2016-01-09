import {Component, Output, EventEmitter, Input} from 'angular2/core';
import {NgForm, Control, ControlGroup, FORM_DIRECTIVES, FormBuilder} from 'angular2/common';
import User = wu.model.User;
import {Validators} from 'angular2/common';

@Component({
    selector   : 'registration-form',
    templateUrl: 'app/components/forms/registration-form.html',
    directives : [FORM_DIRECTIVES]
})
export class RegistrationFormComponent {
    /**
     * Passing the submit event to the parent
     * @type {EventEmitter}
     */
    @Output() register = new EventEmitter<User>();

    model: User = {username: '', password: '', firstname: '', lastname: '', email: '', salutation: 'Mr'};

    //We create references of the form and form controls to get more control over them especially custom validation
    regForm: ControlGroup;

    //Patterns to match validity of login form field
    usernamePattern: RegExp = /(^[a-zA-Z0-9_-]{8,}$)/;
    emailPattern: RegExp = /(^[^ @]+@[^ @]+$)/;
    passwordPattern: RegExp = /^.{8,}$/;

    salutations: Array<string> = ['Mr', 'Mrs', 'Human', 'Neutrum'];

    @Input() isLoading: boolean = false;

    constructor(fb: FormBuilder) {
        this.regForm = fb.group({
            username: ['', c => this.validatePattern(c, this.usernamePattern)],
            password: ['', c => this.validatePattern(c, this.passwordPattern)],
            email: ['', c => this.validatePattern(c, this.emailPattern)],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            salutation: [null, c => this.validateEnum(c, this.salutations)],
            passwordRepeat: ['', c => this.validatePasswordRepeat(c)]
        });
    }

    onSubmit() {
        this.register.emit(this.model);
    }

    validateEnum(control, list: Array<string>) {
        if (list.indexOf(control.value) === -1) {
            return {'enum': true}
        }

        return null;
    }

    validatePattern(control: Control, pattern: RegExp) {
        if (!pattern.test(control.value)) {
            return {pattern: true}
        }
        this.regForm.controls['passwordRepeat'].markAsTouched();
        this.regForm.controls['passwordRepeat'].updateValueAndValidity({onlySelf: true, emitEvent: true});

        return null;
    }

    validatePasswordRepeat(control: Control) {
        if (!this.regForm) {
            return {repeat: true};
        }

        if (control.value !== this.regForm.controls['password'].value){
            return {repeat: true};
        }

        return null;
    }
}