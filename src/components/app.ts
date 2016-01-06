import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {LoginRouteComponent} from './routes/login-route';
import {AuthService} from '../services/AuthService';

@Component({
    selector  : 'app',
    template  : `<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES],
    providers: [ AuthService ]
})
@RouteConfig([
    {path: '/login', useAsDefault: true, name: 'Login', component: LoginRouteComponent},
])
export class AppComponent {

}