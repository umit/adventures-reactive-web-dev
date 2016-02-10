import {Injectable} from "angular2/core";
import {Observable, Subject} from "rxjs/Rx";
import {Http, Response} from "angular2/http";

import todoUrl from "./todoUrl";
import {Todo} from "../model/todo";

@Injectable()
export class TodoService {
  deleteTodo$ : Subject<number> = new Subject<number>();
  saveTodo$: Subject<Todo> = new Subject<Todo>();

  constructor(private http: Http) {
  }

  receiveTodos(res: Response): Array<Todo> {
    return <Array<Todo>>JSON.parse(res.text());
  }

  todoList(): Observable<Array<Todo>> {
    const todoListAfterDelete$ = this.deleteTodo$
      .map(todoUrl.delete)
      .mergeMap(this.http.delete.bind(this.http))
      .map(this.receiveTodos);

    const todoListAfterSave$ = this.saveTodo$
      .mergeMap(todo => this.http.post(todoUrl.save, JSON.stringify(todo)))
      .map(this.receiveTodos);

    return this.http.get(todoUrl.get).map(this.receiveTodos)
      .merge(todoListAfterDelete$)
      .merge(todoListAfterSave$);
  }

  deleteTodo(todoId: number): void {
    this.deleteTodo$.next(todoId);
  }

  saveTodo(todo: Todo): void {
    this.saveTodo$.next(todo);
  }
}
