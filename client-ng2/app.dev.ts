import {Component, Inject, provide} from "angular2/core";
import {bootstrap} from "angular2/platform/browser";
import {HTTP_PROVIDERS} from "angular2/http";

import {TodoList} from "./todoList/component";
import {TodoForm} from "./todoForm/component";

import createStore from "./store.dev";
import TodoListMain from "./todoList/main";
import TodoFormMain from "./todoForm/main";

import ajax from "./util/ajax-axios";
import todoUrl from "./util/todoUrl";

const ce = require("react").createElement;
const {render} = require("react-dom");
const {createDevTools} = require("redux-devtools");
const LogMonitor = require("redux-devtools-log-monitor")["default"];
const DockMonitor = require("redux-devtools-dock-monitor")["default"];

@Component({
  selector: "#app",
  template: `
    <div class="todo-form"></div>
    <div class="todo-list"></div>
  `,
  directives: [TodoList, TodoForm]
})
export class App {
  constructor(@Inject("devTools") devTools, @Inject("ReduxStore") private store) {
    devTools.install(store);
  }
}

const DevTools = createDevTools(
  ce(DockMonitor, {toggleVisibilityKey: "ctrl-h", changePositionKey: "ctrl-q"},
    ce(LogMonitor, {theme: "tomorrow"}))
);

const store = createStore(TodoListMain.reducer, TodoFormMain.reducer, DevTools);
const listActions = TodoListMain.actions(ajax, todoUrl);
const formActions = TodoFormMain.actions(ajax, todoUrl);

const devTools = provide("devTools", {
  useFactory: () => ({
    install: (store) => {
      render(ce(DevTools, {store: store}), document.getElementById("devTools"));
    }
  })
});

bootstrap(App, [
  provide("ReduxStore", {useValue:store}),
  provide("listActions", {useValue:listActions}),
  provide("formActions", {useValue:formActions}),
  HTTP_PROVIDERS,
  devTools
]);

store.dispatch(listActions.loadTodos());
