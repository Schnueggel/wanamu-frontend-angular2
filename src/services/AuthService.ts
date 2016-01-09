import {Injectable} from 'angular2/core';
import {Http , Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ConfigService} from './ConfigService';

import User = wu.model.User;

@Injectable()
export class AuthService {

    token: string;
    user: wu.model.User;
    config: wu.Config;

    constructor(private http: Http, configService: ConfigService) {
        this.config = configService.config;
        console.log(this.config);
    }

    login(username, password): Observable<User>  {
        const headers = new Headers();

        headers.set('Content-Type', 'application/json');

        return this.http.post(this.config.apiUrl, JSON.stringify({username, password}), {
            headers: headers
        })
        .map(res => res.json())
        .map( (res: wu.model.LoginData) => {
            this.storeLogin(res);
            return this.user;
        });
    }

    storeLogin(loginData: wu.model.LoginData) {
        this.token = loginData.token;
        this.user = loginData.data[0];
    }
}

