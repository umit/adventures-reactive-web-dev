import { Just, Nothing } from "data.maybe";
import { complement, filter, propEq } from "ramda";

import { Action } from "./action";

// handler : Model -> [ model, Maybe (Task Action) ]
const handler = services => model => ({
  NoOp: () => [model, Nothing()],

  LoadList: () => [
    { todos: model.todos, message: "Loading, please wait..." },
    Just(services.loadTodos.map(Action.ShowList))
  ],

  ShowList: list => [list, Nothing()],

  UpdateList: _todo => [model, Nothing()],

  EditTodo: _todo => [model, Nothing()],

  DeleteTodo: todoId => [
    { todos: model.todos, message: "Deleting, please wait..." },
    Just(services.deleteTodo(todoId).map(Action.DeletedTodo))
  ],

  DeletedTodo: maybeTodoId => [
    maybeTodoId
      .map(todoId => ( { todos: filter(complement(propEq("id", todoId)), model.todos),  message: ""} ))
      .getOrElse({todos: model.todos, message: "An error occured when deleting a Todo."}),

    Nothing()
  ]
});

// update : Services -> Action -> Model -> [ model, Maybe (Task Action) ]
const update = services => action => model => Action.case(handler(services)(model), action);

export { update };
