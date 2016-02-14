import Rx from "rxjs";
import Type from "union-type";
import {always, identity} from "ramda";
import Task from "data.task";
import Maybe from "data.maybe";
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

// toMaybe : Task x a -> Task never (Maybe a)
/*
const toMaybe = ITask => task =>
  new ITask((reject, resolve) => {
  console.log("inside task:", task);
  console.log("task.fork:", task.fork);
    task.fork(
      rej => resolve(Maybe.Nothing()),
      res => resolve(Maybe.Just(res))
    );
    console.log("done");
  }
  );
*/

// sendList : (Maybe Model) -> Task x ()
/*
const sendList = mm => pipe(
  Action.ShowList,
  signalAction.next.bind(signalAction))(
    mm.getOrElse({todos:[], message:"An error occurred."})
  );
*/

// sendList : Model -> Task x ()
const sendList = pipe(
  Action.ShowList,
  signalAction.next.bind(signalAction)
);

const sendErrorMessage = () =>
  signalAction.next(Action.ShowList({todos:[], message:"An error occurred."}));

// runLoadTodos : Bool -> Task Http.Error ()
const runLoadTodos = indicator =>
  loadTodos(indicator).fork(sendErrorMessage, sendList);

export {runLoadTodos, signalAction, signalLoad, update};

