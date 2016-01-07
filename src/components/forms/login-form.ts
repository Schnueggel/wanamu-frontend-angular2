import {Component, Output, EventEmitter} from 'angular2/core';
import {NgForm, Control, ControlGroup, FORM_DIRECTIVES}    from 'angular2/common';
import User = wu.model.User;

@Component({
    selector   : 'login-form',
    templateUrl: 'app/components/forms/login-form.html',
    directives : [FORM_DIRECTIVES]
})
export class LoginFormComponent {
    /**
     * Passing the submit event to the parent
     * @type {EventEmitter}
     */
    @Output() login = new EventEmitter<User>();

    model: User = {username: '', password: ''};

    //We create references of the form and form controls to get more control over them especially custom validation
    loginForm: ControlGroup;
    usernameControl: Control;
    passwordControl: Control;
    //Patterns to match validity of login form field
    usernamePattern: RegExp = /(^[a-zA-Z0-9_-]{8,}$)|(^[^ @]+@[^ @]+$)/;
    passwordPattern: RegExp = /^.{8,}$/;

    constructor() {
        this.usernameControl = new Control('', this.validateUsername.bind(this));
        this.passwordControl = new Control('', this.validatePassword.bind(this));
        this.loginForm       = new ControlGroup({username: this.usernameControl, password: this.passwordControl});
    }

    onSubmit() {console.log(this.model);
        this.login.emit(this.model);
    }

    validateUsername(control: Control) {
        if (!this.usernamePattern.test(control.value)) {
            return {pattern: false}
        }
    }

    validatePassword(control: Control) {
        if (!this.passwordPattern.test(control.value)) {
            return {pattern: false}
        }
    }
}