import {Injectable} from 'angular2/core';
import {Http , Headers} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class TodoListService {

    constructor(private http: Http) {}

    getTodos(todoListId: number): Observable<wu.model.Todo[]>  {
        const headers = new Headers();

        headers.set('Content-Type', 'application/json');

        return this.http.get(`http://localhost:8080/todolist/${todoListId}`,{
            headers: headers
        })
        .map(res => res.json())
        .map( (res: wu.model.TodoData) => {
            return res;
        });
    }
}

