import { Injectable } from 'angular2/core';
import { Http , Headers } from 'angular2/http';
import { Observable } from 'rxjs/Rx';
import { AuthService } from './AuthService';
import { WU_CONFIG } from '../config';
import { Inject } from 'angular2/core';
import * as Immutable from 'immutable';

import User = wu.model.User;
@Injectable()
export class UserService {

    constructor(private http: Http,
                private authService: AuthService,
                @Inject(WU_CONFIG) private config: wu.Config) {
    }

    register(userData: any): Observable<User> {
        return this.http.post(`${this.config.apiUrl}/user`, JSON.stringify(userData))
            .map(res => res.json())
            .map((res: wu.model.User[]) => {
                return res[0];
            });
    }
}

