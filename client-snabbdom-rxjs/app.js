import Type from "union-type";
import Rx from "rxjs";
import snabbdom from "snabbdom";
import {identity as id} from "ramda";

import {initialModel} from "./todoList/model";
import view from "./todoList/view";
import {runLoadTodos, onAction, onLoad, update} from "./todoList/update";

// snabbdom setup
const patch = snabbdom.init([
  require("snabbdom/modules/props"),
  require("snabbdom/modules/eventlisteners")
]);

// destination node
const appNode = document.getElementById("app");

// view stream
const view$ = onAction.scan(update, initialModel).map(view(onLoad));

// view renderer
view$.scan((vnode, view) => patch(vnode, view), appNode).subscribe();

// ports
// runLoadTodos : Bool -> Task Http.Error ()
onLoad.map(runLoadTodos).map(t => t.fork(id, id)).subscribe();

