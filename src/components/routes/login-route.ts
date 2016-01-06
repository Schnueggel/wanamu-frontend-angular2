import {Component} from 'angular2/core';
import {LoginFormComponent} from '../forms/login-form';

@Component({
    selector: 'login-route',
    templateUrl: 'app/components/routes/login-route.html',
    directives: [LoginFormComponent]
})
export class LoginRouteComponent {

}