import {Component, EventEmitter, Input, Output} from "angular2/core";
import {FORM_DIRECTIVES, ControlGroup, FormBuilder, NgClass, NgForm, Validators} from "angular2/common";

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
                Priority is required
              </span>
              <span *ngIf="priority.control.hasError('invalidNumber')" class="help-block">
                Priority must be a number.
              </span>
              <span *ngIf="priority.control.hasError('invalidRange')" class="help-block">
                Priority must be between 1 and 10.
              </span>
            </div>
          </div>
          <div [ngClass]="descriptionClasses">
            <label for="description">Description:</label>
            <input type="text" id="description" name="description" class="form-control"
              [(ngModel)]="todo.description" ngControl="description" #description="ngForm"/>
            <div [hidden]="!submitted || description.valid">
              <span class="help-block">Description is required</span>
            </div>
          </div>
          <div>
            <button class="btn btn-primary btn-xs" (click)="onSave(todo, todoForm, priority, description)">Save</button>
            <span> </span>
            <button class="btn btn-default btn-xs" (click)="onCancel()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  directives: [FORM_DIRECTIVES, NgClass]
})
export class TodoForm {
  @Input() todo: Todo;
  @Output() saveTodo = new EventEmitter<Todo>();

  submitted: boolean = false;
  priorityClasses: {[s: string]: boolean} = {"form-group": true, "has-error": false};
  descriptionClasses: {[s: string]: boolean} = {"form-group": true, "has-error": false};

  myForm: ControlGroup;

  constructor(fb: FormBuilder) {
    this.myForm = fb.group({
      "priority": ["", Validators.compose([Validators.required, rangeValidator])],
      "description": ["", Validators.required]
    });
  }

  clearForm() {
    this.submitted = false;
    this.todo = {};
    this.priorityClasses["has-error"] = false;
    this.descriptionClasses["has-error"] = false;
  }

  onCancel() {
    this.clearForm();
  }

  onSave(todo: Todo, todoForm: NgForm, priority: NgForm, description: NgForm) {
    if (todoForm.valid) {
      this.saveTodo.next(todo);
      this.clearForm();
    }
    else {
      this.submitted = true;
      this.priorityClasses["has-error"] = !priority.valid;
      this.descriptionClasses["has-error"] = !description.valid;
    }
  }

  onSubmit() {
    this.submitted = true;
  }
}

