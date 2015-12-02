var React = require("react");
var ReactDOM = require("react-dom");
var ajax = require("./util/ajax-axios");
var R = require("ramda");
var Redux = require("redux");
var ReactRedux = require("react-redux");
var thunk = require("redux-thunk");
var todoListModel = require("./todoList/model");
var TodoList = require("./todoList/component.jsx");

module.exports = function(element) {
  var store = Redux.applyMiddleware(thunk)(Redux.createStore)(todoListModel);
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

  store.dispatch(dispatch => {
    ajax.getJSON(todoUrl.get).then(todoList => {
      dispatch({type: "EVT_LIST", payload: {todos: todoList}});
    });
  });
};
