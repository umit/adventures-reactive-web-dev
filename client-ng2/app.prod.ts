import {Component, provide} from "angular2/core";
import {bootstrap} from "angular2/platform/browser";
import {HTTP_PROVIDERS} from "angular2/http";

import {TodoList} from "./todoList/component";
import {TodoForm} from "./todoForm/component";

import createStore from "./store.prod";
import TodoListMain from "./todoList/main";
import TodoFormMain from "./todoForm/main";

import ajax from "./util/ajax-axios";
import todoUrl from "./util/todoUrl";

@Component({
  selector: "#app",
  template: `
    <div class="todo-form"></div>
    <div class="todo-list"></div>
  `,
  directives: [TodoList, TodoForm]
})
export class App {
}

const store = createStore(TodoListMain.reducer, TodoFormMain.reducer);
const listActions = TodoListMain.actions(ajax, todoUrl);
const formActions = TodoFormMain.actions(ajax, todoUrl);

bootstrap(App, [
  provide("ReduxStore", {useValue:store}),
  provide("listActions", {useValue:listActions}),
  provide("formActions", {useValue:formActions}),
  HTTP_PROVIDERS
]);

store.dispatch(listActions.loadTodos());
