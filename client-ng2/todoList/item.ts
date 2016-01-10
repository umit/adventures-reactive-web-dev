import {Component, EventEmitter, Input, Output} from 'angular2/core';
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
  @Output() editTodo = new EventEmitter<Todo>();
  @Output() deleteTodo = new EventEmitter<number>();

  onEdit(todo: Todo) {
    this.editTodo.next(todo);
  }

  onDelete(todo: Todo) {
    this.deleteTodo.next(todo.id);
  }
}

