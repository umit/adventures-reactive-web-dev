import React from "react";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/map";
import "rxjs/add/operator/merge";
import { unary } from "ramda";

import { createTodoListFeature } from "./todoList/feature";
import { createTodoFormFeature } from "./todoForm/feature";

import { Action as FormAction } from "./todoForm/action";

export default function() {
  const todoFormMailbox = new Subject();

  const todoListFeature = createTodoListFeature({ inputs: [], outputs: { onEditTodo: [todoFormMailbox] } });
  const todoFormFeature = createTodoFormFeature({ inputs: [todoFormMailbox.map(unary(FormAction.Edit))] });

  const view$ = todoListFeature.view$.combineLatest(todoFormFeature.view$, (listView, formView) =>
    <div>
      {formView}
      {listView}
    </div>
  );

  const task$ = todoListFeature.task$.merge(todoFormFeature.task$);

  return { view$, task$ };
}
