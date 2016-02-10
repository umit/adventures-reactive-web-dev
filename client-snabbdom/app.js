import Type from "union-type";
import most from "most";
import {subject} from "most-subject";
import snabbdom from "snabbdom";

// snabbdom setup
const patch = snabbdom.init([
  require("snabbdom/modules/props"),
  require("snabbdom/modules/eventlisteners")
]);

const h = require("snabbdom/h");

// destination node
const appNode = document.getElementById("app");

// Action union type
const Action = Type({Increment: [Number], Decrement: [Number]});

// view : Address -> Model -> VNode
const view = address => counter => {
  // Action handlers
  const incrementHandler = (address, value) => address.next(Action.Increment(value));
  const decrementHandler = (address, value) => address.next(Action.Decrement(value));

  return h("div", [
    h("span", `Counter: ${counter}`),
    h("span", " "),
    h("button", {on: {click: [incrementHandler, address, 2]}}, "Increment"),
    h("span", " "),
    h("button", {on: {click: [decrementHandler, address, 1]}}, "Decrement")
  ])
};

// mailbox setup
const {observer, stream} = subject(Action.Increment(0));

// update function
const update = (counter, action) => Action.case({
  Increment: value => counter + value,
  Decrement: value => counter - value
}, action);

// model : Number
const initialModel = 0;

// view stream
const view$ = stream.scan(update, initialModel).map(view(observer));

// view renderer
view$.scan((vnode, view) => patch(vnode, view), appNode).drain();

