import Cycle from "@cycle/core";
import {find, propEq} from "ramda";

const TODO_LIST_URL = "/todoList";

let deleteTodoUrl = function(todoId) {
  return "/deleteTodo/" + todoId;
};

let model = function(HTTP, intent) {
  let request$ = intent.deleteTodo$
    .map(function(todoId) {
      return {
        method: "DEL",
        url: deleteTodoUrl(todoId)
      };
    })
    .startWith(TODO_LIST_URL);

  let todos$ = HTTP
    //.filter(res$ => res$.request === TODO_LIST_URL)
    .mergeAll()
    .map(res => JSON.parse(res.text))
    .share();

  let editTodo$ = intent.editTodo$.withLatestFrom(todos$, function(editTodoId, todos) {
    return {todo: find(propEq("id", editTodoId))(todos)};
  });

  return {
    todos$: todos$,
    editTodo$: editTodo$,
    HTTP: request$
  };
};

export default model;
