import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import routes from './routes/routes';

@Component({
    selector  : 'app',
    template  : `<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/login', useAsDefault: true, name: 'Login', component: routes.LoginRouteComponent},
    {path: '/registration', name: 'Registration', component: routes.RegistrationRouteComponent},
    {path: '/todolist/:id', name: 'TodoList', component: routes.TodoListRouteComponent},
])
export class AppComponent {

}