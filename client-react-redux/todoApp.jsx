var React = require("react");
var ReactDOM = require("react-dom");
var ajax = require("./util/ajax-axios");
var R = require("ramda");
var Redux = require("redux");
var ReactRedux = require("react-redux");
var thunk = require("redux-thunk");
var promiseMiddleware = require("redux-promise");
var Actions = require("redux-actions");
var todoListModel = require("./todoList/model");
var TodoList = require("./todoList/component.jsx");

module.exports = function(element) {
  // 1. with redux-thunk
  /*
  var store = Redux.applyMiddleware(thunk)(Redux.createStore)(todoListModel);
  */

  // 2. with redux-actions and redux-promise
  var store = Redux.applyMiddleware(promiseMiddleware)(Redux.createStore)(todoListModel);

  var App = ReactRedux.connect(R.identity)(TodoList);
  var Provider = ReactRedux.Provider;

  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    element
  );

  // This will go somewhere else, putting it here for now.
  var todoUrl = {
    get: "/todoList",
    save: "/saveTodo",
    delete: function(todoId) {
      return "deleteTodo/" + String(todoId);
    }
  };

  // 1. with thunk
  /*
  var getTodos = function(dispatch) {
    ajax.getJSON(todoUrl.get).then(todoList => {
      dispatch({type: "EVT_LIST", payload: {todos: todoList}});
    });
  };
  */

  // 2. with redux-actions and redux-promise
  var getTodos = Actions.createAction("EVT_LIST",
    () => ajax.getJSON(todoUrl.get).then(todoList => R.assoc("todos", todoList, {})));

  store.dispatch(getTodos());
};
