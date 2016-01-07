import {Component} from 'angular2/core';
import {LoginFormComponent} from '../forms/login-form';
import { AuthService } from '../../services/AuthService';

@Component({
    selector: 'login-route',
    templateUrl: 'app/components/routes/login-route.html',
    directives: [LoginFormComponent]
})
export class LoginRouteComponent {

    constructor(private authService: AuthService) {}

    /**
     * TODO the output event somehow delivers a first value of undefined and the second is the emitted value. This could be a bug and change in the future.
     * @param hmm
     * @param model
     */
    onLogin(hmm:any, model: wu.model.User,a,b) {
        console.log(hmm, model,a,b);
    }
}