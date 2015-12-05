import React from "react";
import {render} from "react-dom";
import ajax from "./util/ajax-axios";
import {identity} from "ramda";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {connect, Provider} from "react-redux";
import promiseMiddleware from "redux-promise";
import {createAction} from "redux-actions";
import todoListModel from "./todoList/model";
import todoFormModel from "./todoForm/model";
import TodoList from "./todoList/component.jsx";
import TodoForm from "./todoForm/component.jsx";

export default function(element) {
  const model = combineReducers({todos: todoListModel, todo:todoFormModel});
  const store = applyMiddleware(promiseMiddleware)(createStore)(model);

  const View = (props) => <div><TodoForm {...props}/><TodoList {...props}/></div>;
  const App = connect(identity)(View);

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

  const getTodos = createAction("ACTION_LIST", () => ajax.getJSON(todoUrl.get));

  store.dispatch(getTodos());
};
