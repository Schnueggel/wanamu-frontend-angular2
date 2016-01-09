import { Component } from 'angular2/core';
import { LoginFormComponent } from '../forms/login-form';
import { AuthService } from '../../services/AuthService';
import { LoginFailedError } from '../../services/errors/errors';
import 'rxjs/add/operator/do';
import {Router} from 'angular2/router';

@Component({
    selector   : 'login-route',
    templateUrl: 'app/components/routes/login-route.html',
    directives : [LoginFormComponent]
})
export class LoginRouteComponent {

    constructor(private authService: AuthService, private router: Router) {
    }

    isLoading: boolean = false;
    message: string = null;

    /**
     * @param model
     */
    onLogin(model: wu.model.User) {
        this.isLoading = true;
        this.message = '';

        this.authService.login(model.username, model.password)
            .finally(() => {
                this.isLoading = false;
            })
            .subscribe(
                u => this.loginSuccess(u),
                e => this.loginError(e as any)
            )
    }

    loginSuccess(user: wu.model.User) {
        this.router.navigate(['TodoList', {id: user.defaultTodolistId}])
    }

    loginError(err: Error) {
        if (err instanceof LoginFailedError) {
            this.message = 'Login failed please check your password and username';
        } else if(err instanceof Error) {
            this.message = err.message;
        } else {
            this.message = 'Unexpected error happend please try again';
        }
    }
}