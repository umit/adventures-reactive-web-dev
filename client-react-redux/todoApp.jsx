import React from "react";
import {render} from "react-dom";
import {connect, Provider} from "react-redux";
import {identity} from "ramda";

import TodoList from "./todoList/main";
import TodoForm from "./todoForm/main";

import ajax from "./util/ajax-axios";
import todoUrl from "./util/todoUrl";

import {hashHistory, Link, Router} from "react-router";

export default function(element, createStore, Component) {
  const store = createStore(TodoList.reducer, TodoForm.reducer, Component);
  const listActions = TodoList.actions(ajax, todoUrl);
  const formActions = TodoForm.actions(ajax, todoUrl);

  const TodoListView = props => <TodoList.view actions={listActions} {...props}/>;
  const TodoFormView = props => <TodoForm.view actions={formActions} {...props}/>;

  const mapStateToProps = identity;

  const TodoListComponent = connect(mapStateToProps)(TodoListView);
  const TodoFormComponent = connect(mapStateToProps)(TodoFormView);

  const component = Component ? <Component/> : null;

  const App = function(props) {
    return (
      <Provider store={store}>
        <div>
          <div>
            <Link to="/list">Todo List</Link> | <Link to="/edit">New Todo</Link>
          </div>
          {props.children}
          {component}
        </div>
      </Provider>
    );
  };

  const routes = {
    path: "/",
    component: App,
    indexRoute: {component: TodoListComponent},
    childRoutes: [
      {path: "/list", component: TodoListComponent},
      {path: "/edit", component: TodoFormComponent}
    ]
  };

  render(
    <Router history={hashHistory} routes={routes}/>,
    element
  );

  store.dispatch(listActions.loadTodos());
};
