import {Component, Inject, OnDestroy} from "angular2/core";
import {Store} from "redux";

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
          <tr todo-item *ngFor="#todo of todos" [todo]="todo"></tr>
        </tbody>
      </table>
    </div>
  `,
  directives: [TodoItem]
})
export class TodoList implements OnDestroy {
  todos: Todo[];
  unsubscribe: Function;

  constructor(
    @Inject("ReduxStore") private store: Store,
    @Inject("listActions") private actions
  ) {
    this.unsubscribe = this.store.subscribe(() => {
      let state = this.store.getState();
      this.todos = state.list.todos;
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
