import React from "react";
import {render} from "react-dom";

import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/scan";

import {always, identity as id} from "ramda";
import {initialModel as listModel} from "./todoList/model";
import {initialModel as formModel} from "./todoForm/model";
import todoList from "./todoList/component.jsx";
import todoForm from "./todoForm/component.jsx";
import {Action, actions, runLoadTodos, runDeleteTodo, update} from "./todoList/update";

export default function(element) {
  const listView = todoList(actions);
  const formView = todoForm(actions);

  const appView = model => (
    <div>
      {formView(model)}
      <div className="row"><div className="col-md-12">&nbsp;</div></div>
      {listView(model)}
    </div>
  );

  const model = {
    list: listModel,
    form: formModel
  };

  // view stream
  const view$ = actions.scan(update, model).map(appView);

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
  const isAction = actionType => Action.case({
    [actionType]: always(true),
    _: always(false)
  });

  // runLoadTodos : Bool -> Task Http.Error ()
  actions.filter(isAction("LoadList")).map(runLoadTodos).map(t => t.fork(id, id)).subscribe();

  // runDeleteTodo : Number -> Task Http.Error ()
  actions.filter(isAction("DeleteTodo")).map(runDeleteTodo).map(t => t.fork(id, id)).subscribe();
};
