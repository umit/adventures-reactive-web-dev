import {div, span} from "@cycle/dom";
import {map, pipe, pluck, sum} from "ramda";

let view = function(model) {
  let view$ = model.todos$.map(function(todos) {
    let totalTodos = todos.length;
    let totalPriority = pipe(pluck("priority"), map(parseInt), sum);
    let averagePriority = totalPriority(todos) / totalTodos;
    return div(
      span("Total todos: " + totalTodos + " Average priority: " + averagePriority)
    );
  });

  return {
    DOM: view$
  };
};

export default view;
