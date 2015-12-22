import React from "react";
import {render} from "react-dom";
import {identity} from "ramda";
import {connect, Provider} from "react-redux";

import ajax from "./util/ajax-axios";
import todoUrl from "./util/todoUrl";
import createStore from "./store";
import TodoList from "./todoList/main";
import TodoForm from "./todoForm/main";

import {createDevTools} from "redux-devtools";
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export default function(element) {

  const DevTools = createDevTools(
    <DockMonitor toggleVisibilityKey="ctrl-h"
                 changePositionKey="ctrl-q">
      <LogMonitor theme="tomorrow" />
    </DockMonitor>
  );

  const store = createStore(TodoList.model, TodoForm.model, DevTools);

  const listActions = TodoList.actions(ajax, todoUrl);
  const formActions = TodoForm.actions(ajax, todoUrl);

  const View = (props) => <div>
    <TodoForm.component actions={formActions} {...props}/>
    <TodoList.component actions={listActions} {...props}/>
  </div>;

  const App = connect(identity)(View);

  render(
    <Provider store={store}>
      <div>
        <App/>
        <DevTools/>
      </div>
    </Provider>,
    element
  );

  store.dispatch(listActions.getTodosAction());
};
