var React = require("react");
var ReactDOM = require("react-dom");
var Rx = require("rx");
var R = require("ramda");
var ajax = require("./util/ajax-rx-dom");
var formModel = require("./todoForm/model");
var listModel = require("./todoList/model");
var formEvents = require("./todoForm/events");
var listEvents = require("./todoList/events");
var todoList = require("./todoList/component.jsx");
var todoForm = require("./todoForm/component.jsx");
var todoSummary = require("./todoSummary/component.jsx");

module.exports = function(element) {
  var formEvents$ = formEvents();
  var listEvents$ = listEvents();
  var events$ = R.merge(formEvents$, listEvents$);

  var formModel$ = formModel(events$);
  var listModel$ = listModel(ajax, events$, formModel$);

  var listView$ = listModel$.map(function(model) {
    return todoList(model, events$);
  });

  var formView$ = formModel$.formModel$.map(function(model) {
    return todoForm(model, events$);
  });

  var summaryView$ = listModel$.map(function(model) {
    return todoSummary(model);
  });

  var view$ = Rx.Observable.combineLatest(listView$, formView$, summaryView$, function(listView, formView, summaryView) {
    return (
      <div>
        {formView}
        {listView}
        {summaryView}
      </div>
    );
  });

  view$.subscribe(function(view) {
    ReactDOM.render(view, element);
  });
};
