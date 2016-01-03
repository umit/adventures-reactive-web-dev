import {h, render} from "yolk";
import Rx from "rx";
import {merge} from "ramda";
import ajax from "./util/ajax-rx-dom";
import formModel from "./todoForm/model";
import listModel from "./todoList/model";
import formEvents from "./todoForm/events";
import listEvents from "./todoList/events";
import todoList from "./todoList/component.jsx";
import todoForm from "./todoForm/component.jsx";
import todoSummary from "./todoSummary/component.jsx";

export default function(element) {
  const formEvents$ = formEvents();
  const listEvents$ = listEvents();
  const events$ = merge(formEvents$, listEvents$);

  const formModel$ = formModel(events$);
  const listModel$ = listModel(ajax, events$, formModel$);

  const listView$ = listModel$.map(function(model) {
    return todoList(model, events$);
  });

  const formView$ = formModel$.formModel$.map(function(model) {
    return todoForm(model, events$);
  });

  const summaryView$ = listModel$.map(function(model) {
    return todoSummary(model);
  });

  const view$ = Rx.Observable.combineLatest(listView$, formView$, summaryView$, function(listView, formView, summaryView) {
    return (
      <div>
        {formView}
        {listView}
        {summaryView}
      </div>
    );
  });

  /*
  view$.subscribe(function(view) {
    ReactDOM.render(view, element);
  });
  */
};
