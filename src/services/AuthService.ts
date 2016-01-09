import {Injectable} from 'angular2/core';
import {Http , Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import User = wu.model.User;

@Injectable()
export class AuthService {

    token: string;
    user: wu.model.User;

    constructor(private http: Http) {}

    login(username, password): Observable<User>  {
        const headers = new Headers();

        headers.set('Content-Type', 'application/json');

        return this.http.post('http://localhost:8080/auth/login', JSON.stringify({username, password}), {
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

