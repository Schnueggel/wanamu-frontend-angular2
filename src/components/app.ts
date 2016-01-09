import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import routes from './routes/routes';
import { WU_SERVICES } from '../services/services';

@Component({
    selector  : 'app',
    template  : `<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES],
    providers: [WU_SERVICES]
})
@RouteConfig([
    {path: '/login', useAsDefault: true, name: 'Login', component: routes.LoginRouteComponent},
    {path: '/registration', name: 'Registration', component: routes.RegistrationRouteComponent},
])
export class AppComponent {

}