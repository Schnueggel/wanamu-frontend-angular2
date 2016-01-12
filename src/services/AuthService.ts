import { Injectable, Inject, Injector, provide } from 'angular2/core';
import { Http , Headers, Response } from 'angular2/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Router } from 'angular2/router';
import * as Immutable from 'immutable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {WU_CONFIG} from '../config';
import { LoginFailedError, ServerError } from './errors/errors';

import User = wu.model.User;

@Injectable()
export class AuthService {

    token: string;
    user: wu.model.User;

    userStream: Observable<wu.model.User>;

    private startUserStream: BehaviorSubject<wu.model.User> = new BehaviorSubject<wu.model.User>(null);

    /**
     *
     * @param http
     * @param config
     */
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

        this.userStream = this.startUserStream.share();

        this.userStream.subscribe(()=> {});
    }

    /**
     * Auths user by username and password
     * @param username
     * @param password
     * @returns {Observable<R>}
     */
    login(username, password): Observable<User>  {

        this.clearToken();

        this.http.post(`${this.config.apiUrl}/auth/login`, JSON.stringify({username, password}), {})
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
        }).subscribe( user => this.startUserStream.next(user) );

        return this.userStream;
    }

    /**
     * Clears the user data from the frontend app
     */
    logout() {
        this.clearToken();
        this.user = null;
        this.startUserStream.next(null);
    }

    /**
     * Loads the current user if a auth token exists and returns a promise that resovles with true or false
     * @returns {Promise<boolean>}
     */
    hasCurrentUser() {
        if (this.user) {
            return Promise.resolve(true);
        }

        if (!this.getToken()) {
            return Promise.resolve(false);
        }

        const headers = new Headers();

        this.setAuthHeaders(headers);

        return this.http.get(`${this.config.apiUrl}/user`, {
                headers
            })
            .map(res => res.json())
            .map<wu.model.UserResponseData, boolean>((res: wu.model.UserResponseData) => {
                this.user = Immutable.fromJS(res.data[0]);
                return true;
            })
            .toPromise();
    }

    /**
     *
     * @param loginData
     */
    storeLogin(loginData: wu.model.LoginData) {
        this.token = loginData.token;
        this.user = Immutable.fromJS(loginData.data[0]);

        localStorage.setItem('token', this.token);
    }

    /**
     * Removes the current user token from this app
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    /**
     * Returns the current token is one exist
     * @returns {string|undefined}
     */
    getToken() {
        if (this.token) {
            return this.token;
        }
        return this.token = localStorage.getItem('token');
    }

    /**
     * Sets the auth header needed for authed request.
     * TODO remove this when angular2 has something like http interception
     * @param headers
     * @returns {Headers}
     */
    setAuthHeaders(headers: Headers) {
        const token = this.getToken();
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
}
