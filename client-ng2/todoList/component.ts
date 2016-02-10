import {Component, EventEmitter, Input, OnInit, Output} from "angular2/core";
import {Observable} from "rxjs/Observable";

import {Todo} from "../model/todo";
import {TodoItem} from "./item";

@Component({
  selector: ".todo-list",
  template: `
    <div>
      <div>Todo List:</div>
      <table class="table">
        <thead>
          <tr>
            <th>Priority</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr todo-item *ngFor="#todo of todos" [todo]="todo"
              (editTodo)="onEditTodo($event)"
              (deleteTodo)="onDeleteTodo($event)"></tr>
        </tbody>
      </table>
    </div>
  `,
  directives: [TodoItem]
})
export class TodoList implements OnInit {
  @Input() todos$: Observable<Array<Todo>>;
  todos: Array<Todo>;
  @Output() editTodo = new EventEmitter<Todo>();
  @Output() deleteTodo = new EventEmitter<number>();

  ngOnInit() {
    this.todos$.subscribe(todos => this.todos = todos);
  }

  onEditTodo(todo: Todo) {
    this.editTodo.next(todo);
  }

  onDeleteTodo(todoId: number) {
    this.deleteTodo.next(todoId);
  }
}
