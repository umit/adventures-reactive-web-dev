var vdux = require("vdux");
var ajax = require("./util/ajax-axios");
var Redux = require("redux");
var thunk = require("redux-thunk");
var todoListModel = require("./todoList/model");
var TodoList = require("./todoList/component.jsx");

module.exports = function(element) {
  var store = Redux.applyMiddleware(thunk)(Redux.createStore)(todoListModel);
  var app = (state) => TodoList(state);

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

  store.dispatch(dispatch => {
    ajax.getJSON(todoUrl.get).then(todoList => {
      dispatch({type: "EVT_LIST", payload: {todos: todoList}});
    });
  });
};
