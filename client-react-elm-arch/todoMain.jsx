import React from "react";
import "rxjs/add/operator/map";

import { createTodoListFeature } from "./todoList/feature";

export default function() {
  const todoListFeature = createTodoListFeature({inputs: []});

  const view$ = todoListFeature.view$.map(listView =>
    <div>
      {listView}
    </div>
  );

  return { view$, task$: todoListFeature.task$ };
}
