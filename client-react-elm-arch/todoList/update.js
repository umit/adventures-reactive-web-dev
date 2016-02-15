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
  ShowList: [Object],
  DeleteTodo: [Number]
});

// update : Model -> Action -> Model
const update = (model, action) => Action.case({
  ShowList: identity,
  LoadList: always({todos:[], message:"Loading, please wait..."}),
  _: always(model)
}, action);

const actions = new BehaviorSubject(Action.NoOp());

const intoModel = todos => ({todos:todos, message:""});

// loadTodos : Bool -> Task Http.Error Model
const loadTodos = () =>
  toTask(() => ajax.getJSON(todoUrl.get))().map(intoModel);

// deleteTodo : Number -> Task Http.Error Model
const deleteTodo = (todoId) =>
  toTask(() => ajax.deleteJSON(todoUrl.delete(todoId)))().map(intoModel);

// sendList : Model -> Task x ()
const sendList = pipe(
  Action.ShowList,
  actions.next.bind(actions)
);

// errorMessage : Http.Error -> Task never Model
const errorMessage = err => Task.of({todos:[], message:"An error occurred."});

// runLoadTodos : Task Http.Error ()
const runLoadTodos = () =>
  loadTodos().orElse(errorMessage).map(sendList);

// runDeleteTodo : Task Http.Error ()
const runDeleteTodo = (todoId) =>
  deleteTodo(todoId).orElse(errorMessage).map(sendList);

export {Action, runLoadTodos, runDeleteTodo, actions, update};

