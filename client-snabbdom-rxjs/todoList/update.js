import Rx from "rxjs";
import Type from "union-type";
import {always, identity} from "ramda";
import Task from "data.task";
import {futurizeP} from "futurize";
import {pipe} from "ramda";

import ajax from "../util/ajax-axios";
import todoUrl from "../util/todoUrl";

const toTask = futurizeP(Task);

const Action = Type({
  NoOp: [],
  ShowList: [Object]
});

// update : Model -> Action -> Model
const update = (model, action) => Action.case({
  ShowList: identity,
  NoOp: always(model)
}, action);

const signalAction = new Rx.BehaviorSubject(Action.NoOp());

const signalLoad = new Rx.BehaviorSubject(false);

// loadTodos : Bool -> Task Http.Error Model
const loadTodos = indicator => {
  if (indicator) {
    return toTask(() => ajax.getJSON(todoUrl.get))().map(todos =>
      ({todos:todos, message:""}));
  }
  else {
    return Task.of({todos:[], message:"Waiting..."});
  }
};

// sendList : Model -> Task x ()
const sendList = pipe(
  Action.ShowList,
  signalAction.next.bind(signalAction)
);

// defaultList : Http.Error -> Task x Model
const defaultList = err => Task.of({todos:[], message:"An error occurred."});

// runLoadTodos : Bool -> Task Http.Error ()
const runLoadTodos = indicator =>
  loadTodos(indicator).orElse(defaultList).map(sendList);

export {runLoadTodos, signalAction, signalLoad, update};

