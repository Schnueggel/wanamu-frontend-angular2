import { Injectable, Inject, Injector, provide } from 'angular2/core';
import { Http , Headers, Response } from 'angular2/http';
import { Observable } from 'rxjs/Rx';
import {Router} from 'angular2/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {WU_CONFIG} from '../config';
import { LoginFailedError, ServerError } from './errors/errors';

import User = wu.model.User;

@Injectable()
export class AuthService {

    static token: string;
    static user: wu.model.User;

    constructor(private http: Http,
                @Inject(WU_CONFIG) private config: wu.Config) {

        // TODO: Use official Angular2 CORS support when merged (https://github.com/angular/angular/issues/4231).
        // https://github.com/angular/angular/issues/4231
        let _build = (<any> http)._backend._browserXHR.build;
        (<any> http)._backend._browserXHR.build = () => {
            let _xhr =  _build();
            _xhr.withCredentials = true;
            return _xhr;
        };
    }

    login(username, password): Observable<User>  {

        AuthService.clearToken();

        return this.http.post(`${this.config.apiUrl}/auth/login`, JSON.stringify({username, password}), {})
        .catch((res: Response) => {
            console.error(res);
            if (res.status === 403) {
                return Observable.throw(new LoginFailedError());
            } else {
                //TODO be more precise
                return Observable.throw(new ServerError());
            }
        })
        .map( (res: Response) => res.json())
        .map( (res: wu.model.LoginData) => {
            this.storeLogin(res);
            return AuthService.user;
        });
    }

    logout() {
        AuthService.clearToken();
        AuthService.user = null;
    }

    storeLogin(loginData: wu.model.LoginData) {
        AuthService.token = loginData.token;
        AuthService.user = loginData.data[0];

        localStorage.setItem('token', AuthService.token);
    }

    static clearToken() {
        AuthService.token = null;
        localStorage.removeItem('token');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static setAuthHeaders(headers: Headers) {
        const token = AuthService.getToken();
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
    }

    static canActivateAuthCheck(nextInstr: any, currInstr: any) {
        const authed = typeof AuthService.getToken() === 'string';

        if (!authed) {
            console.log(nextInstr);
        }

        return authed;
    }
}
