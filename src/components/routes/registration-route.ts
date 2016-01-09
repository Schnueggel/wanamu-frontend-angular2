import {Component} from 'angular2/core';
import {RegistrationFormComponent} from '../forms/registration-form';
import { UserService } from '../../services/UserService';

@Component({
    selector: 'registration-route',
    templateUrl: 'app/components/routes/registration-route.html',
    directives: [RegistrationFormComponent]
})
export class RegistrationRouteComponent {

    constructor(private userService: UserService) {}

    isLoading: boolean = false;

    /**
     * @param model
     */
    onRegister(model: wu.model.User) {
        this.isLoading = true;
        setTimeout(() => this.isLoading = false, 5000);
    }
}