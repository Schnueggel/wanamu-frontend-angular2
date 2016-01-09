import { Injectable, Inject, Injector, provide } from 'angular2/core';
import { Http , Headers, Response, BaseRequestOptions, RequestOptions, HTTP_PROVIDERS } from 'angular2/http';
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

    token: string;
    user: wu.model.User;

    constructor(private http: Http,
                @Inject(WU_CONFIG) private config: wu.Config) {
    }

    login(username, password): Observable<User>  {
        return this.http.post(`${this.config.apiUrl}/auth/login`, JSON.stringify({username, password}))
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
            return this.user;
        });
    }

    logout() {
        this.clearToken();
        this.user = null;
    }

    storeLogin(loginData: wu.model.LoginData) {
        this.token = loginData.token;
        this.user = loginData.data[0];

        localStorage.setItem('token', this.token);

        class JwtAuthRequestOptions extends BaseRequestOptions {
            Authorization: string = `Bearer ${loginData.token}`;
        }

        Injector.resolveAndCreate([provide(RequestOptions, {useClass: JwtAuthRequestOptions})]);
    }

    clearToken() {
        localStorage.removeItem('token');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static canActivateAuthCheck(nextInstr: any, currInstr: any) {
        const authed = typeof AuthService.getToken() === 'string';

        if (!authed) {
            console.log(nextInstr);
        }

        return authed;
    }
}
