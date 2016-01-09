import {Injectable} from 'angular2/core';
import {Http , Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import User = wu.model.User;

@Injectable()
export class UserService {

    constructor(private http: Http) {}

    register(userData: any): Observable<User>  {
        const headers = new Headers();

        headers.set('Content-Type', 'application/json');

        return this.http.post('http://localhost:8080/user', JSON.stringify(userData), {
            headers: headers
        })
        .map(res => res.json())
        .map( (res: wu.model.User) => {
            return res;
        });
    }
}

