import snabbdom from "snabbdom";
import {always, identity as id} from "ramda";

import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/scan";

import {initialModel} from "./todoList/model";
import view from "./todoList/view";
import {Action, actions, runLoadTodos, update} from "./todoList/update";

// snabbdom setup
const patch = snabbdom.init([
  require("snabbdom/modules/props"),
  require("snabbdom/modules/eventlisteners")
]);

// destination node
const appNode = document.getElementById("app");

// view stream
const view$ = actions.scan(update, initialModel).map(view(actions));

// view renderer
view$.scan((vnode, view) => patch(vnode, view), appNode).subscribe();

// ports
const isAction = actionType => Action.case({
  [actionType]: always(true),
  _: always(false)
});

// runLoadTodos : Bool -> Task Http.Error ()
actions.filter(isAction("LoadList")).map(runLoadTodos).map(t => t.fork(id, id)).subscribe();

