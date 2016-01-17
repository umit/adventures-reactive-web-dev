import React from "react";
import {render} from "react-dom";
import {connect, Provider} from "react-redux";
import {identity} from "ramda";

import TodoList from "./todoList/main";
import TodoForm from "./todoForm/main";

import ajax from "./util/ajax-axios";
import todoUrl from "./util/todoUrl";

export default function(element, createStore, Component) {
  const store = createStore(TodoList.reducer, TodoForm.reducer, Component);
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
  const component = Component ? <Component/> : null;

  render(
    <Provider store={store}>
      <div>
        <App/>
        {component}
      </div>
    </Provider>,
    element
  );

  store.dispatch(listActions.loadTodos());
};
