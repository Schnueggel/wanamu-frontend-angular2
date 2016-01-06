import {Component, Output, EventEmitter} from 'angular2/core';
import {NgForm, Control}    from 'angular2/common';
import User = wu.model.User;

@Component({
    selector: 'login-form',
    templateUrl: 'app/components/forms/login-form.html'
})
export class LoginFormComponent {

    usernameControl: Control = new Control('');
    passwordControl: Control = new Control('');

    /**
     * Passing the submit event to the parent
     * @type {EventEmitter}
     */
    @Output() login = new EventEmitter<User>();

    model: User = {username: '', password: ''};

    onSubmit() {
        this.login.emit(this.model);
    }

    onChange(event, b) {
        console.log(this, this.model, event, b);
    }
}