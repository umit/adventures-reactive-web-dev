import React from "react";
import {render} from "react-dom";
import ajax from "./util/ajax-axios";
import {assoc, identity} from "ramda";
import {applyMiddleware, createStore} from "redux";
import {connect, Provider} from "react-redux";
import promiseMiddleware from "redux-promise";
import {createAction} from "redux-actions";
import todoListModel from "./todoList/model";
import TodoList from "./todoList/component.jsx";

export default function(element) {
  const store = applyMiddleware(promiseMiddleware)(createStore)(todoListModel);

  const App = connect(identity)(TodoList);

  render(
    <Provider store={store}>
      <App/>
    </Provider>,
    element
  );

  // This will go somewhere else, putting it here for now.
  const todoUrl = {
    get: "/todoList",
    save: "/saveTodo",
    delete: function(todoId) {
      return "deleteTodo/" + String(todoId);
    }
  };

  const getTodos = createAction("ACTION_LIST",
    () => ajax.getJSON(todoUrl.get).then(todoList => assoc("todos", todoList, {})));

  store.dispatch(getTodos());
};
