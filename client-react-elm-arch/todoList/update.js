import { Just, Nothing } from "data.maybe";
import { Action } from "./action";

// handler : Model -> { model, task: Maybe (Task Action) }
const handler = services => model => ({
  NoOp: () => ({model, task: Nothing()}),

  LoadList: () => ({
    model: {todos: [], message: "Loading, please wait..."},
    task: Just(services.loadTodos.map(Action.ShowList))
  }),

  ShowList: list => ({model: list, task: Nothing()}),

  UpdateList: _todo => ({model, task: Nothing()}),

  EditTodo: _todo => ({model, task: Nothing()}),

  DeleteTodo: todoId => ({
    model: {todos: [], message: "Deleting, please wait..."},
    task: services.deleteTodo(todoId).map(Action.DeletedTodo)
  }),

  DeletedTodo: _maybeTodoId => ({model, task: Nothing()})
});

// update : Services -> Action -> Model -> { model, task: Maybe (Task Action) }
const update = services => action => model => Action.case(handler(services)(model), action);

export { update };
