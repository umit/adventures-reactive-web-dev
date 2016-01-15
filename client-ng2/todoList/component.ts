import {Component, Inject, OnDestroy} from "angular2/core";
import {Store} from "redux";

import {Todo} from "../model/todo";
import {TodoItem} from "./item";

@Component({
  selector: ".todo-list",
  template: `
    <div class="row">
      <div class="col-md-8">
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
            <tr *ngIf="inProgress">Loading, please wait...</tr>
            <tr todo-item *ngFor="#todo of todos" [todo]="todo"></tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  directives: [TodoItem]
})
export class TodoList implements OnDestroy {
  todos: Todo[];
  inProgress: boolean = false;
  unsubscribe: Function;

  constructor(
    @Inject("ReduxStore") private store: Store,
    @Inject("listActions") private actions
  ) {
    this.unsubscribe = this.store.subscribe(() => {
      let state = this.store.getState();
      this.todos = state.list.todos;
      this.inProgress = state.list.inProgress;
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
