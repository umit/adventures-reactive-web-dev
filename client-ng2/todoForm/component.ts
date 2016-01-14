import {Component, Inject, OnDestroy} from "angular2/core";
import {FORM_DIRECTIVES, ControlGroup, FormBuilder, NgClass, NgForm, Validators} from "angular2/common";
import {Store} from "redux";

import {Todo} from "../model/todo";
import {rangeValidator} from "./rangeValidator";

@Component({
  selector: ".todo-form",
  template: `
    <div class="row">
      <div class="col-md-4">
        <form #todoForm="ngForm" [ngFormModel]="myForm" novalidate>
          <input type="hidden" name="id" value={{todo.id}}/>
          <div [ngClass]="priorityClasses">
            <label for="priority">Priority:</label>
            <input type="text" id="priority" name="priority" class="form-control"
              [(ngModel)]="todo.priority" ngControl="priority" #priority="ngForm"/>
            <div [hidden]="!submitted || priority.valid">
              <span *ngIf="priority.control.hasError('required')" class="help-block">
                Priority can't be blank
              </span>
              <span *ngIf="priority.control.hasError('invalidNumber')" class="help-block">
                Priority is not a number
              </span>
              <span *ngIf="priority.control.hasError('belowRange')" class="help-block">
                Priority must be greater than 0
              </span>
              <span *ngIf="priority.control.hasError('aboveRange')" class="help-block">
                Priority must be less than or equal to 10
              </span>
            </div>
          </div>
          <div [ngClass]="descriptionClasses">
            <label for="description">Description:</label>
            <input type="text" id="description" name="description" class="form-control"
              [(ngModel)]="todo.description" ngControl="description" #description="ngForm"/>
            <div [hidden]="!submitted || description.valid">
              <span class="help-block">Description can't be blank</span>
            </div>
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
  directives: [FORM_DIRECTIVES, NgClass]
})
export class TodoForm implements OnDestroy {
  todo: Todo = {};

  submitted: boolean = false;
  priorityClasses: {[s: string]: boolean} = {"form-group": true, "has-error": false};
  descriptionClasses: {[s: string]: boolean} = {"form-group": true, "has-error": false};

  myForm: ControlGroup;
  unsubscribe: Function;

  constructor(
    fb: FormBuilder,
    @Inject("ReduxStore") private store: Store,
    @Inject("formActions") private actions
  ) {
    this.unsubscribe = this.store.subscribe(() => {
      let state = this.store.getState();
      this.todo = state.form.todo;
    });

    this.myForm = fb.group({
      "priority": ["", Validators.compose([Validators.required, rangeValidator])],
      "description": ["", Validators.required]
    });
  }

  onCancel() {
    this.store.dispatch(this.actions.cancelForm());
  }

  onSave(todo: Todo) {
    this.store.dispatch(this.actions.saveTodo({todo:todo}));
  }

  onSubmit() {
    this.submitted = true;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}

