import vdux from "vdux";
import ajax from "./util/ajax-axios";
import {applyMiddleware, createStore} from "redux";
import promiseMiddleware from "redux-promise-middleware";
import {createAction} from "redux-actions";
import todoListModel from "./todoList/model";
import TodoList from "./todoList/component.jsx";

export default function(element) {
  const store = applyMiddleware(promiseMiddleware())(createStore)(todoListModel);
  const app = TodoList;

  document.addEventListener("DOMContentLoaded", function() {
    vdux(store, app, element);
  });

  // This will go somewhere else, putting it here for now.
  const todoUrl = {
    get: "/todoList",
    save: "/saveTodo",
    delete: function(todoId) {
      return "deleteTodo/" + String(todoId);
    }
  };

  const intoTodosObject = todoList => { return {todos: todoList}; };
  const getTodos = function() {
    return {
      promise: ajax.getJSON(todoUrl.get).then(intoTodosObject)
    };
  };

  store.dispatch(createAction("EVT_LIST", getTodos)());
};
