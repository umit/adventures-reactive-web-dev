import snabbdom from "snabbdom";
import {always, identity as id} from "ramda";

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
// runLoadTodos : Bool -> Task Http.Error ()
const isLoadListAction = Action.case({
  LoadList: always(true),
  _: always(false)
});

actions.filter(isLoadListAction).map(runLoadTodos).map(t => t.fork(id, id)).subscribe();

