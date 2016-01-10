import {Injectable} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {Http, Response} from "angular2/http";
// import "rxjs/Rx";
import "rxjs/add/operator/map";

import todoUrl from "./todoUrl";
import {Todo} from "../model/todo";

@Injectable()
export class TodoService {
  constructor(public http: Http) {
  }

  receiveTodos(res: Response): Todo[] {
    return <Todo[]>JSON.parse(res.text());
  }

  loadTodos(): Observable<Todo[]> {
    return this.http.get(todoUrl.get).map(this.receiveTodos);
  }

  deleteTodo(todoId: number): Observable<Todo[]> {
    return this.http.delete(todoUrl.delete(todoId)).map(this.receiveTodos);
  }

  saveTodo(todo: Todo): Observable<Todo[]> {
    return this.http.post(todoUrl.save, JSON.stringify(todo)).map(this.receiveTodos);
  }
}
