import React from "react";
import {render} from "react-dom";
import {identity} from "ramda";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {connect, Provider} from "react-redux";
import promiseMiddleware from "redux-promise-middleware";
import {createAction} from "redux-actions";

import ajax from "./util/ajax-axios";
import todoUrl from "./util/todoUrl";
import TodoList from "./todoList/main";
import TodoForm from "./todoForm/main";

import {createDevTools} from "redux-devtools";
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export default function(element) {

  const model = combineReducers({todos: TodoList.model, todo:TodoForm.model});
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

  const listActions = TodoList.actions(ajax, todoUrl);
  const formActions = TodoForm.actions(ajax, todoUrl);

  const View = (props) => <div>
    <TodoForm.component actions={formActions} {...props}/>
    <TodoList.component actions={listActions} {...props}/>
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
