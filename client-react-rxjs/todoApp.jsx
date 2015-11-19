var React = require("react");
var ReactDOM = require("react-dom");
var Rx = require("rx");
var ajax = require("./util/ajax-rx-dom");
var model = require("./model");
var events = require("./events");
var todoList = require("./todoList/component.jsx");
var todoForm = require("./todoForm/component.jsx");
var todoSummary = require("./todoSummary/component.jsx");

module.exports = function(element) {
  var events$ = events();
  var model$ = model(ajax, events$);

  var listView$ = model$.listModel$.map(function(model) {
    return todoList(model, events$);
  });

  var formView$ = model$.formModel$.map(function(model) {
    return todoForm(model, events$);
  });

  var summaryView$ = model$.listModel$.map(function(model) {
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
