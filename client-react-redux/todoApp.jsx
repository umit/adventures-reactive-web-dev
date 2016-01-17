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

  const Root = function(props) {
    return (
      <Provider store={store}>
        <div>
          <div>
            <Link to="/main">Main</Link> | <Link to="/about">About</Link>
          </div>
          {props.children}
          {component}
        </div>
      </Provider>
    );
  };

  const About = props => <div>About goes here</div>;

  const routes = {
    path: "/",
    component: Root,
    childRoutes: [
      {path: "/main",  component: App},
      {path: "/about", component: About}
    ]
  };

  render(
    <Router history={hashHistory} routes={routes}/>,
    element
  );

  store.dispatch(listActions.loadTodos());
};
