import React from "react";
import {render} from "react-dom";
import ajax from "./util/ajax-axios";
import {identity} from "ramda";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {connect, Provider} from "react-redux";
import promiseMiddleware from "redux-promise-middleware";
import {createAction} from "redux-actions";
import todoListModel from "./todoList/model";
import todoFormModel from "./todoForm/model";
import TodoList from "./todoList/component.jsx";
import TodoForm from "./todoForm/component.jsx";
import createListActions from "./todoList/actions";
import createFormActions from "./todoForm/actions";

import {createDevTools} from "redux-devtools";
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export default function(element) {
  // This will go somewhere else, putting it here for now.
  const todoUrl = {
    get: "/todoList",
    save: "/saveTodo",
    delete: function(todoId) {
      return "deleteTodo/" + String(todoId);
    }
  };

  const model = combineReducers({todos: todoListModel, todo:todoFormModel});
//const store = applyMiddleware(promiseMiddleware())(createStore)(model);

  const DevTools = createDevTools(
    <DockMonitor toggleVisibilityKey="ctrl-h"
                 changePositionKey="ctrl-q">
      <LogMonitor theme="tomorrow" />
    </DockMonitor>
  );

  const store = compose(
    applyMiddleware(promiseMiddleware()),
    DevTools.instrument()
  )(createStore)(model);

  const listActions = createListActions(ajax, todoUrl);
  const formActions = createFormActions(ajax, todoUrl);

  const View = (props) => <div>
    <TodoForm actions={formActions} {...props}/>
    <TodoList actions={listActions} {...props}/>
  </div>;

  const App = connect(identity)(View);

/*
  render(
    <Provider store={store}>
      <App/>
    </Provider>,
    element
  );
*/
  render(
    <Provider store={store}>
      <div>
        <App/>
        <DevTools/>
      </div>
    </Provider>,
    element
  );

  const getTodos = createAction("ACTION_LIST", () => { return {promise: ajax.getJSON(todoUrl.get)}; });

  store.dispatch(getTodos());
};
