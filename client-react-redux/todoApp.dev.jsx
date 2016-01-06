import React from "react";
import {render} from "react-dom";
import {connect, Provider} from "react-redux";
import {identity} from "ramda";

import createStore from "./store.dev";
import TodoList from "./todoList/main";
import TodoForm from "./todoForm/main";

import ajax from "./util/ajax-axios";
import todoUrl from "./util/todoUrl";

import {createDevTools} from "redux-devtools";
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export default function(element) {

  const DevTools = createDevTools(
    <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
      <LogMonitor theme="tomorrow"/>
    </DockMonitor>
  );

  const store = createStore(TodoList.reducer, TodoForm.reducer, DevTools);
  const listActions = TodoList.actions(ajax, todoUrl);
  const formActions = TodoForm.actions(ajax, todoUrl);

  const View = function(props) {
    return (
      <div>
        <TodoForm.view actions={formActions} {...props}/>
        <TodoList.view actions={listActions} {...props}/>
      </div>
    );
  };

  const mapStateToProps = identity;
  const App = connect(mapStateToProps)(View);

  render(
    <Provider store={store}>
      <div>
        <App/>
        <DevTools/>
      </div>
    </Provider>,
    element
  );

  store.dispatch(listActions.loadTodos());
};
