import {createElement as ce} from "react";
import {render} from "react-dom";
import {identity, merge} from "ramda";
import {connect, Provider} from "react-redux";

import ajax from "./util/ajax-axios";
import todoUrl from "./util/todoUrl";
import createStore from "./store.prod";
import TodoList from "./todoList/main";
import TodoForm from "./todoForm/main";

export default function(element) {

  const store = createStore(TodoList.model, TodoForm.model);

  const listActions = TodoList.actions(ajax, todoUrl);
  const formActions = TodoForm.actions(ajax, todoUrl);

  const View = (props) => ce("div", null,
    ce(TodoForm.component, merge({actions:formActions}, props)),
    ce(TodoList.component, merge({actions:listActions}, props)));

  const App = connect(identity)(View);

  render(
    ce(Provider, {store:store}, ce(App)),
    element);

  store.dispatch(listActions.getTodosAction());
};
