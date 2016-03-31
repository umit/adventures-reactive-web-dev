import Task from "data.task";

import { Action } from "./action";
import { initialModel } from "./model";

// handler : Model -> [ model, Maybe (Task Action) ]
const handler = services => model => ({
  NoOp: () => [model, null],

  Edit: todo => [{ todo: todo }, null],

  ClearForm: () => [initialModel, null],

  Save: todo => [model, services.saveTodo(todo).map(Action.Saved)],

  Saved: _maybeTodo => [
    model,
    Task.of(Action.ClearForm()) // signal saved maybeTodo
  ]
});

// update : Services -> Action -> Model -> [ model, Maybe (Task Action) ]
const update = services => action => model => Action.case(handler(services)(model), action);

export { update };
