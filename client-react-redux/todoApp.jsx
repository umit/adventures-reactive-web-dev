import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";

import TodoList from "./todoList/main";
import TodoForm from "./todoForm/main";

import ajax from "./util/ajax-axios";
import todoUrl from "./util/todoUrl";

export default function(element, createStore, Component) {

  const store = createStore(TodoList.reducer, TodoForm.reducer, Component);
  const listActions = TodoList.actions(ajax, todoUrl);
  const formActions = TodoForm.actions(ajax, todoUrl);

  const component = Component ? <Component/> : null;

  render(
    <Provider store={store}>
      <div>
        <TodoForm.view actions={formActions}/>
        <TodoList.view actions={listActions}/>
        {component}
      </div>
    </Provider>,
    element
  );

  store.dispatch(listActions.loadTodos());
};
