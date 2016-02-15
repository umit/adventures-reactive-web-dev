import {BehaviorSubject} from "rxjs/subject/BehaviorSubject";
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
  LoadList: [],
  ShowList: [Object]
});

// update : Model -> Action -> Model
const update = (model, action) => Action.case({
  ShowList: identity,
  LoadList: always({todos:[], message:"Loading, please wait..."}),
  NoOp: always(model)
}, action);

const actions = new BehaviorSubject(Action.NoOp());

// loadTodos : Bool -> Task Http.Error Model
const loadTodos = () => {
  return toTask(() => ajax.getJSON(todoUrl.get))().map(todos =>
    ({todos:todos, message:""}));
};

// sendList : Model -> Task x ()
const sendList = pipe(
  Action.ShowList,
  actions.next.bind(actions)
);

// defaultList : Http.Error -> Task never Model
const defaultList = err => Task.of({todos:[], message:"An error occurred."});

// runLoadTodos : Task Http.Error ()
const runLoadTodos = () =>
  loadTodos().orElse(defaultList).map(sendList);

export {Action, runLoadTodos, actions, update};

