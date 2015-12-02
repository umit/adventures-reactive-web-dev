var React = require("react");
var ReactDOM = require("react-dom");
var ajax = require("./util/ajax-axios");
var R = require("ramda");
var Redux = require("redux");
var ReactRedux = require("react-redux");
var todoListModel = require("./todoList/model");
var TodoList = require("./todoList/component.jsx");

module.exports = function(element) {
  var store = Redux.createStore(todoListModel(ajax));
  var App = ReactRedux.connect(R.identity)(TodoList);
  var Provider = ReactRedux.Provider;

  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    element
  )
};
