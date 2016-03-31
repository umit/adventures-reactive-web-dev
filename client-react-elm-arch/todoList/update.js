import { complement, filter, propEq } from "ramda";

import { Action } from "./action";

// handler : Model -> [ model, Maybe (Task Action) ]
const handler = services => model => ({
  NoOp: () => [model, null],

  LoadList: () => [
    { todos: model.todos, message: "Loading, please wait..." },
    services.loadTodos.map(Action.ShowList)
  ],

  ShowList: list => [list, null],

  UpdateList: _todo => [model, null],

  EditTodo: todo => [model, services.signalEditTodo(todo)(Action.NoOp())],

  DeleteTodo: todoId => [
    { todos: model.todos, message: "Deleting, please wait..." },
    services.deleteTodo(todoId).map(Action.DeletedTodo)
  ],

  DeletedTodo: maybeTodoId => [
    maybeTodoId
    .map(todoId => ({ todos: filter(complement(propEq("id", todoId)), model.todos), message: "" }))
    .getOrElse({ todos: model.todos, message: "An error occured when deleting a Todo." }),
    null
  ]
});

// update : Services -> Action -> Model -> [ model, Maybe (Task Action) ]
const update = services => action => model => Action.case(handler(services)(model), action);

export { update };
