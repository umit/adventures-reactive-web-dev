import {Component} from "angular2/core";
import {bootstrap} from "angular2/platform/browser";
import {Observable} from "rxjs/Observable";
import {HTTP_PROVIDERS} from "angular2/http";

import {TodoList} from "./todoList/component";
import {TodoForm} from "./todoForm/component";
import {Todo} from "./model/todo";
import {TodoService} from "./service/todoService";

@Component({
  selector: "#app",
  template: `
    <div class="todo-form" [todo]="todo" (saveTodo)="onSaveTodo($event)"></div>
    <div class="todo-list" [todos$]="todos$"
      (editTodo)="onEditTodo($event)"
      (deleteTodo)="onDeleteTodo($event)">
    </div>
  `,
  directives: [TodoList, TodoForm],
  providers: [TodoService]
})
export class App {
  todos$: Observable<Array<Todo>>;
  todo: Todo = {};

  constructor(private _todoService: TodoService) {
    this.todos$ = this._todoService.todoList();
  }

  onEditTodo(todo: Todo) {
    this.todo = Object.assign({}, todo);
  }

  onDeleteTodo(todoId: number) {
    this._todoService.deleteTodo(todoId);
  }

  onSaveTodo(todo: Todo) {
    this._todoService.saveTodo(todo);
  }
}

bootstrap(App, [HTTP_PROVIDERS]);
