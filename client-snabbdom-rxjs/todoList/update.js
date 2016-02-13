import Rx from "rxjs";
import Type from "union-type";
import {always, identity} from "ramda";
import Task from "data.task";
import {futurizeP} from "futurize";

import ajax from "../util/ajax-axios";
import todoUrl from "../util/todoUrl";

const toTask = futurizeP(Task);

const Action = Type({
  NoOp: [],
  ShowList: [Array]
});

// update : Action -> Model -> Model
const update = action => model => Action.case({
  ShowList: identity,
  NoOp: always(model)
});

const actions = new Rx.BehaviorSubject(Action.NoOp());

const onLoadTodos = new Rx.BehaviorSubject(false);

// loadTodos : Bool -> Task Http.Error Model
const loadTodos = indicator => {
  if (indicator) {
    return toTask(ajax.getJSON(todoUrl.get))
  }
  else {
    return Task.of([{id:0, priority:0, description:"Waiting"}]);
  }
};

// sendList : (Maybe Model) -> Task x ()
const sendList = mm =>
  mm.getOrElse([{id:0, priority:0, description:"Error"}]);
  /*
  >> ShowList
  >> Signal.send actions.address


runLoadTodos : Bool -> Task Http.Error ()
runLoadTodos indicator =
  (loadTodos indicator |> toMaybe) `andThen` sendList
  */

