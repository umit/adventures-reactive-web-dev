import {Component, Inject, Input} from 'angular2/core';
import {Store} from "redux";

import {Todo} from '../model/todo';

@Component({
  selector: '[todo-item]',
  template: `
    <td>{{todo.priority}}</td>
    <td>{{todo.description}}</td>
    <td>
      <button class="btn btn-primary btn-xs" (click)="onEdit(todo)">Edit</button>
      <span> </span>
      <button class="btn btn-danger btn-xs" (click)="onDelete(todo)">Delete</button>
    </td>
  `
})
export class TodoItem {
  @Input() todo: Todo;

  constructor(
    @Inject("ReduxStore") private store: Store,
    @Inject("listActions") private actions
  ) {
  }

  onEdit(todo: Todo) {
    this.store.dispatch(this.actions.editTodo(Object.assign({}, todo)));
  }

  onDelete(todo: Todo) {
    this.store.dispatch(this.actions.deleteTodo(todo));
  }
}

