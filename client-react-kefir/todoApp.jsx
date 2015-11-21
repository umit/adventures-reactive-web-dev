var React = require("react");
var ReactDOM = require("react-dom");
var Kefir = require("kefir");
var R = require("ramda");
var ajax = require("./util/ajax-axios");
var formModel = require("./todoForm/model");
var listModel = require("./todoList/model");
var formEvents = require("./todoForm/events");
var listEvents = require("./todoList/events");
var todoList = require("./todoList/component.jsx");
var todoForm = require("./todoForm/component.jsx");
var todoSummary = require("./todoSummary/component.jsx");

module.exports = function(element) {
  var formEvents$ = formEvents(element);
  var listEvents$ = listEvents(element);
  var events$ = R.merge(formEvents$, listEvents$);

  var listModel$ = listModel(ajax, events$);
  var formModel$ = formModel(events$, listModel$.editTodo$);

  var listView$ = listModel$.todos$.map(function(todos) {
    return todoList(todos, events$);
  });

  var formView$ = formModel$.formModel$.map(function(model) {
    return todoForm(model, events$);
  });

  var summaryView$ = listModel$.todos$.map(function(todos) {
    return todoSummary(todos);
  });

  var view$ = Kefir.combine([listView$, formView$, summaryView$], function(listView, formView, summaryView) {
    return (
      <div>
        {formView}
        {listView}
        {summaryView}
      </div>
    );
  });

  view$.onValue(function(view) {
    ReactDOM.render(view, element);
  });
};
