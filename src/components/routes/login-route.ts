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

    isLoading: boolean = false;

    /**
     * @param model
     */
    onLogin(model: wu.model.User) {
        this.isLoading = true;
        setTimeout(() => this.isLoading = false, 5000);
    }
}