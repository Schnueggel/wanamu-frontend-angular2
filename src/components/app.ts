import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {LoginRouteComponent} from './routes/login-route';

@Component({
    selector  : 'app',
    template  : `<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/login', useAsDefault: true, name: 'Login', component: LoginRouteComponent},
])
export class AppComponent {

}