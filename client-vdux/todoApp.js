var vdux = require("vdux");
var ajax = require("./util/ajax-axios");
var Redux = require("redux");
var promiseMiddleware = require("redux-promise");
var Actions = require("redux-actions");
var todoListModel = require("./todoList/model");
var TodoList = require("./todoList/component.jsx");

module.exports = function(element) {
  var store = Redux.applyMiddleware(promiseMiddleware)(Redux.createStore)(todoListModel);
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

  store.dispatch(Actions.createAction("EVT_LIST", getTodos)());
};
