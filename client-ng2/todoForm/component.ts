import {Component, Inject, OnDestroy} from "angular2/core";
import {NgClass} from "angular2/common";
import {Store} from "redux";

import {Todo} from "../model/todo";

@Component({
  selector: ".todo-form",
  template: `
    <div class="row">
      <div class="col-md-4">
        <form>
          <input type="hidden" name="id" value={{todo.id}}/>
          <div [ngClass]="priorityClasses">
            <label for="priority">Priority:</label>
            <input type="text" id="priority" name="priority" class="form-control"
              [(ngModel)]="todo.priority"/>
            <span class="help-block">{{validationErrors["priority"]}}</span>
          </div>
          <div [ngClass]="descriptionClasses">
            <label for="description">Description:</label>
            <input type="text" id="description" name="description" class="form-control"
              [(ngModel)]="todo.description"/>
            <span class="help-block">{{validationErrors["description"]}}</span>
          </div>
          <div>
            <button class="btn btn-primary btn-xs" (click)="onSave(todo)">Save</button>
            <span> </span>
            <button class="btn btn-default btn-xs" (click)="onCancel()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  directives: [NgClass]
})
export class TodoForm implements OnDestroy {
  todo: Todo = {};
  validationErrors = {};

  priorityClasses: {[s: string]: boolean} = {"form-group": true, "has-error": false};
  descriptionClasses: {[s: string]: boolean} = {"form-group": true, "has-error": false};

  unsubscribe: Function;

  constructor(
    @Inject("ReduxStore") private store: Store,
    @Inject("formActions") private actions
  ) {
    this.unsubscribe = this.store.subscribe(() => {
      let state = this.store.getState();
      this.todo = state.form.todo;
      this.validationErrors = state.form.validationErrors || {};
      this.priorityClasses["has-error"] = !!this.validationErrors["priority"];
      this.descriptionClasses["has-error"] = !!this.validationErrors["description"];
    });
  }

  onCancel() {
    this.store.dispatch(this.actions.cancelForm());
  }

  onSave(todo: Todo) {
    this.store.dispatch(this.actions.saveTodo({todo:todo}));
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}

