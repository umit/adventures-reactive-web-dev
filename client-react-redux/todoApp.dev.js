import {createElement as ce} from "react";
import {render} from "react-dom";
import {identity, merge} from "ramda";
import {connect, Provider} from "react-redux";

import ajax from "./util/ajax-axios";
import todoUrl from "./util/todoUrl";
import createStore from "./store.dev";
import TodoList from "./todoList/main";
import TodoForm from "./todoForm/main";

import {createDevTools} from "redux-devtools";
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export default function(element) {

  const DevTools = createDevTools(
    ce(DockMonitor, {toggleVisibilityKey:"ctrl-h", changePositionKey:"ctrl-q"}, [
      ce(LogMonitor, {theme:"tomorrow"})])
  );

  const store = createStore(TodoList.model, TodoForm.model, DevTools);

  const listActions = TodoList.actions(ajax, todoUrl);
  const formActions = TodoForm.actions(ajax, todoUrl);

  const View = (props) => ce("div", [
    ce(TodoForm.component, merge({actions:formActions}, props)),
    ce(TodoList.component, merge({actions:listActions}, props))]);

  const App = connect(identity)(View);

  render(
    ce(Provider, {store:store},
      ce("div", null, [ce(App), ce(DevTools)])),
    element);

  store.dispatch(listActions.getTodosAction());
};
