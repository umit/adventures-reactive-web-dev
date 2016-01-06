import React from "react";
import {render} from "react-dom";
import {connect, Provider} from "react-redux";
import {identity} from "ramda";

import createStore from "./store.prod";
import TodoList from "./todoList/main";
import TodoForm from "./todoForm/main";

import ajax from "./util/ajax-axios";
import todoUrl from "./util/todoUrl";

export default function(element) {

  const store = createStore(TodoList.reducer, TodoForm.reducer);
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
      <App/>
    </Provider>,
    element
  );

  store.dispatch(listActions.loadTodos());
};
