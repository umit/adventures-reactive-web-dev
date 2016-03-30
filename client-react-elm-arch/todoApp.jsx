import React from "react";
import { render } from "react-dom";

import "rxjs/add/operator/map";

import { taskRunner } from "./library/feature";
import { createTodoListFeature } from "./todoList/feature";

export default function(element) {
  const todoListFeature = createTodoListFeature({inputs: []});

  const appView$ = todoListFeature.view$.map(listView =>
    <div>
      {listView}
    </div>
  );

  // view rendering
  appView$.subscribe(view => render(view, element));

  // ports
  todoListFeature.task$.subscribe(taskRunner);
}
