import vdux from "vdux";
import ajax from "./util/ajax-axios";
import {applyMiddleware, createStore} from "redux";
import promiseMiddleware from "redux-promise";
import {createAction} from "redux-actions";
import todoListModel from "./todoList/model";
import TodoList from "./todoList/component.jsx";

export default function(element) {
  var store = applyMiddleware(promiseMiddleware)(createStore)(todoListModel);
  var app = TodoList;

  document.addEventListener("DOMContentLoaded", function() {
    vdux(store, app, element);
  });

  // This will go somewhere else, putting it here for now.
  var todoUrl = {
    get: "/todoList",
    save: "/saveTodo",
    delete: function(todoId) {
      return "deleteTodo/" + String(todoId);
    }
  };

  var intoTodosObject = todoList => { return {todos: todoList}; };
  var getTodos = () => ajax.getJSON(todoUrl.get).then(intoTodosObject);

  store.dispatch(createAction("EVT_LIST", getTodos)());
};
