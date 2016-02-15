import React from "react";
import {render} from "react-dom";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/scan";
//import Rx from "rx";
import {always, identity as id} from "ramda";
//import ajax from "./util/ajax-rx-dom";
//import formModel from "./todoForm/model";
import {initialModel} from "./todoList/model";
//import formEvents from "./todoForm/events";
//import listEvents from "./todoList/events";
import todoList from "./todoList/component.jsx";
//import todoForm from "./todoForm/component.jsx";
//import todoSummary from "./todoSummary/component.jsx";
import {Action, actions, runLoadTodos, update} from "./todoList/update";

export default function(element) {
/*
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
*/

  // view stream
  const view$ = actions.scan(update, initialModel).map(todoList(actions));

/*
  const view$ = Rx.Observable.combineLatest(listView$, formView$, summaryView$, function(listView, formView, summaryView) {
    return (
      <div>
        {formView}
        {listView}
        {summaryView}
      </div>
    );
  });
*/

  view$.subscribe(view => render(view, element));

  // ports
  // runLoadTodos : Bool -> Task Http.Error ()
  const isLoadListAction = Action.case({
    LoadList: always(true),
    _: always(false)
  });

  actions.filter(isLoadListAction).map(runLoadTodos).map(t => t.fork(id, id)).subscribe();
};
