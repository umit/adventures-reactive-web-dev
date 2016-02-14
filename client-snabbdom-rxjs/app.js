import Type from "union-type";
import Rx from "rxjs";
import snabbdom from "snabbdom";
import {identity} from "ramda";

import {initialModel} from "./todoList/model";
import view from "./todoList/view";
import {runLoadTodos, signalAction, signalLoad, update} from "./todoList/update";

// snabbdom setup
const patch = snabbdom.init([
  require("snabbdom/modules/props"),
  require("snabbdom/modules/eventlisteners")
]);

// destination node
const appNode = document.getElementById("app");

// view stream
const view$ = signalAction.scan(update, initialModel).map(view(signalLoad));

// view renderer
view$.scan((vnode, view) => patch(vnode, view), appNode).subscribe();

// ports
// runLoadTodos : Bool -> Task Http.Error ()
signalLoad.map(runLoadTodos).map(t => t.fork(identity, identity)).subscribe();

