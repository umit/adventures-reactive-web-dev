import {Component} from "angular2/core";
import {bootstrap} from "angular2/platform/browser";
import {HTTP_PROVIDERS} from "angular2/http";

import {TodoList} from "./todoList/component";
import {TodoForm} from "./todoForm/component";
import {Todo} from "./model/todo";
import {TodoService} from "./service/todoService";

@Component({
  selector: "#app",
  template: `
    <div class="todo-form" [todo]="todo" (saveTodo)="onSaveTodo($event)"></div>
    <div class="todo-list" [todos]="todos"
      (editTodo)="onEditTodo($event)"
      (deleteTodo)="onDeleteTodo($event)">
    </div>
  `,
  directives: [TodoList, TodoForm],
  providers: [TodoService]
})
export class App {
  todos: Todo[] = [];
  todo: Todo = {};

  constructor(private _todoService: TodoService) {
    this._todoService.loadTodos().subscribe(this.receiveTodos.bind(this));
  }

  receiveTodos(todos: Todo[]) {
    this.todos = todos;
  }

  onEditTodo(todo: Todo) {
    this.todo = Object.assign({}, todo);
  }

  onDeleteTodo(todoId: number) {
    this._todoService.deleteTodo(todoId).subscribe(this.receiveTodos.bind(this));
  }

  onSaveTodo(todo: Todo) {
    this._todoService.saveTodo(todo).subscribe(this.receiveTodos.bind(this));
  }
}

bootstrap(App, [HTTP_PROVIDERS]);
